import {
  Box,
  Button,
  Checkbox,
  Divider,
  Flex,
  Heading,
  HStack,
  SimpleGrid,
  VStack,
} from '@chakra-ui/react';

import { SubmitHandler, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { Input } from '../../components/Form/Input';
import { Layout } from '../../components/Layout';

import api from '../../services/api';
import { useAuth } from '../../hooks/auth';

interface UpdateProfileFormData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

const createUserFormSchema = yup.object().shape({
  name: yup.string().required('Nome obrigatório'),
  email: yup.string().required('E-mail obrigatório').email('E-mail inválido'),
  password: yup.string().when('isResetPassword', {
    is: true,
    then: yup.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
    otherwise: yup.string().ensure().optional(),
  }),
  password_confirmation: yup
    .string()
    .oneOf([null, yup.ref('password')], 'As senhas precisam ser iguais'),
});

export default function CreateUser(): JSX.Element {
  const { register, handleSubmit, formState, reset } = useForm({
    resolver: yupResolver(createUserFormSchema),
  });

  const { errors } = formState;

  const { user, updateUser } = useAuth();

  useEffect(() => {
    reset(user);
  }, [user, reset]);

  const router = useRouter();

  const handleUpdateProfile: SubmitHandler<UpdateProfileFormData> = async values => {
    try {
      const { data } = await api.put('profile', values);
      updateUser(data);
      router.push('/tasks');
      alert('Perfil atualizado com sucesso');
    } catch {
      alert('Falha ao atualizar perfil');
    }
  };

  return (
    <Layout>
      <Box
        as="form"
        flex="1"
        py="8"
        onSubmit={handleSubmit(handleUpdateProfile)}
      >
        <Heading size="lg" fontWeight="normal">
          Editar perfil
        </Heading>

        <Divider my="6" borderColor="gray.700" />

        <VStack spacing="8">
          <SimpleGrid minChildWidth="240px" spacing="8" w="100%">
            <Input
              label="Nome completo"
              error={errors.name}
              {...register('name')}
            />
            <Input label="E-mail" error={errors.email} {...register('email')} />
          </SimpleGrid>

          <Checkbox {...register('isResetPassword')}>Resetar a senha?</Checkbox>

          <SimpleGrid minChildWidth="240px" spacing="8" w="100%">
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

        <Flex mt="8" justify="flex-end">
          <HStack spacing="4">
            <Button
              colorScheme="gray"
              bg="gray.600"
              onClick={() => router.push('/tasks')}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              colorScheme="pink"
              isLoading={formState.isSubmitting}
            >
              Salvar
            </Button>
          </HStack>
        </Flex>
      </Box>
    </Layout>
  );
}
