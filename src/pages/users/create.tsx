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
import { Input } from '../../components/Form/Input';
import api from '../../services/api';
import { Layout } from '../../components/Layout';

interface CreateUserFormData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  is_admin: boolean;
}

const createUserFormSchema = yup.object().shape({
  name: yup.string().required('Nome obrigatório'),
  email: yup.string().required('E-mail obrigatório').email('E-mail inválido'),
  password: yup.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
  password_confirmation: yup
    .string()
    .oneOf([null, yup.ref('password')], 'As senhas precisam ser iguais'),
});

export default function CreateUser(): JSX.Element {
  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(createUserFormSchema),
  });

  const { errors } = formState;

  const router = useRouter();

  const handleCreateUser: SubmitHandler<CreateUserFormData> = async values => {
    try {
      await api.post('users', values);
      alert('Usuário criado com sucesso');
      router.push('/users');
    } catch {
      alert('Falha ao criar novo usuário');
    }
  };

  return (
    <Layout>
      <Box as="form" flex="1" py="8" onSubmit={handleSubmit(handleCreateUser)}>
        <Heading size="lg" fontWeight="normal">
          Criar usuário
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
        <Checkbox mt="4" {...register('is_admin')}>
          Administrador?
        </Checkbox>

        <Flex mt="8" justify="flex-end">
          <HStack spacing="4">
            <Button onClick={() => router.push('/users')} colorScheme="gray">
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
