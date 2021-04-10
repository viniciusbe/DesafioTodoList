import {
  Box,
  Button,
  Checkbox,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  VStack,
} from '@chakra-ui/react';

import { SubmitHandler, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { useEffect } from 'react';
import { Input } from '../Form/Input';
import api from '../../services/api';

export interface EditUserFormData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  is_admin: boolean;
}

interface EditUserProps {
  isOpen: boolean;
  onClose: () => void;
  user: EditUserFormData;
  handleUpdateUsers: (user: EditUserFormData) => void;
}

const editUserFormSchema = yup.object().shape({
  name: yup.string().required('Nome obrigatório'),
  email: yup.string().required('E-mail obrigatório').email('E-mail inválido'),
  is_admin: yup.boolean().required(),
  password: yup.string().when('isResetPassword', {
    is: true,
    then: yup.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
    otherwise: yup.string().ensure().optional(),
  }),
  password_confirmation: yup
    .string()
    .oneOf([null, yup.ref('password')], 'As senhas precisam ser iguais'),
});

export function EditUser({
  isOpen,
  onClose,
  user,
  handleUpdateUsers,
}: EditUserProps): JSX.Element {
  const { register, handleSubmit, formState, reset } = useForm({
    resolver: yupResolver(editUserFormSchema),
  });

  const { errors } = formState;

  useEffect(() => {
    reset(user);
  }, [user, reset]);

  const handleEditUser: SubmitHandler<EditUserFormData> = async values => {
    try {
      await api.put('users', values);

      handleUpdateUsers(values);
      onClose();
      alert('Usuário atualizado com sucesso!');
    } catch {
      alert('Falha ao criar novo usuário');
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent bg="gray.800">
          <ModalHeader>Editar usuário</ModalHeader>
          <Box as="form" flex="1" p="8" onSubmit={handleSubmit(handleEditUser)}>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing="8">
                <SimpleGrid minChildWidth="240px" spacing="8" w="100%">
                  <Input
                    label="Nome completo"
                    error={errors.name}
                    {...register('name')}
                  />
                  <Input
                    label="E-mail"
                    error={errors.email}
                    {...register('email')}
                  />

                  <Checkbox {...register('is_admin')}>Administrador?</Checkbox>

                  <Checkbox {...register('isResetPassword')}>
                    Resetar a senha?
                  </Checkbox>

                  <Input
                    label="Senha"
                    type="password"
                    error={errors.password}
                    {...register('password')}
                  />
                  <Input
                    label="Confirmação da senha"
                    type="password"
                    error={errors.password_confirmation}
                    {...register('password_confirmation')}
                  />
                </SimpleGrid>
              </VStack>
            </ModalBody>

            <ModalFooter mt="4">
              <Button
                colorScheme="purple"
                mr={3}
                type="submit"
                isLoading={formState.isSubmitting}
              >
                Confirmar
              </Button>
              <Button variant="ghost" onClick={onClose}>
                Cancelar
              </Button>
            </ModalFooter>
          </Box>
        </ModalContent>
      </Modal>
    </>
  );
}
