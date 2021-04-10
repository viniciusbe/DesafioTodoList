import { Button, VStack } from '@chakra-ui/react';
import { SubmitHandler, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { useRouter } from 'next/router';
import { Input } from './Input';
import api from '../../services/api';
import { useAuth } from '../../hooks/auth';

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

const registerFormSchema = yup.object().shape({
  name: yup.string().required('Nome obrigatório'),
  email: yup.string().required('E-mail obrigatório').email('E-mail inválido'),
  password: yup.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
  password_confirmation: yup
    .string()
    .oneOf([null, yup.ref('password')], 'As senhas precisam ser iguais'),
});

export function Register(): JSX.Element {
  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(registerFormSchema),
  });

  const { errors } = formState;

  const { signIn } = useAuth();

  const handleRegister: SubmitHandler<RegisterFormData> = async ({
    name,
    email,
    password,
  }) => {
    try {
      await api.post('register', {
        name,
        email,
        password,
      });

      await signIn({
        email,
        password,
      });
    } catch (error) {
      alert('Erro ao criar conta');
    }
  };

  return (
    <VStack spacing="4" as="form" onSubmit={handleSubmit(handleRegister)}>
      <Input label="Nome completo" error={errors.name} {...register('name')} />

      <Input label="E-mail" error={errors.email} {...register('email')} />

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

      <Button
        type="submit"
        colorScheme="pink"
        size="lg"
        isLoading={formState.isSubmitting}
      >
        Confirmar
      </Button>
    </VStack>
  );
}
