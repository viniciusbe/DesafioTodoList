import { Button, VStack } from '@chakra-ui/react';
import { SubmitHandler, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { Input } from './Input';
import { useAuth } from '../../hooks/auth';

interface SignInFormData {
  email: string;
  password: string;
}

const signInFormSchema = yup.object().shape({
  email: yup.string().required('E-mail obrigatório').email('E-mail inválido'),
  password: yup.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
});

export function SignIn(): JSX.Element {
  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(signInFormSchema),
  });

  const { errors } = formState;

  const { signIn } = useAuth();

  const handleSignIn: SubmitHandler<SignInFormData> = async values => {
    try {
      await signIn({
        email: values.email,
        password: values.password,
      });
    } catch (error) {
      alert('Erro na autenticação');
    }
  };

  return (
    <VStack spacing="4" as="form" onSubmit={handleSubmit(handleSignIn)}>
      <Input label="E-mail" error={errors.email} {...register('email')} />

      <Input
        label="Senha"
        type="password"
        error={errors.password}
        {...register('password')}
      />

      <Button
        type="submit"
        colorScheme="pink"
        size="lg"
        isLoading={formState.isSubmitting}
      >
        Entrar
      </Button>
    </VStack>
  );
}
