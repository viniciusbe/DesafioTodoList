import type { NextApiRequest, NextApiResponse } from 'next';
import { getRepository } from 'typeorm';
import { hash } from 'bcryptjs';

import User from '../../entities/User';
import { prepareConnection } from '../../lib/db';
import { ensureAuthenticated } from '../../util/ensureAuthenticated';

export default async function Profile(
  request: NextApiRequest,
  response: NextApiResponse,
): Promise<NextApiResponse | void> {
  await prepareConnection();
  const usersRepository = getRepository(User);
  const user_id = ensureAuthenticated(request);

  if (!user_id) {
    return response.status(400).json({
      status: 'erro',
      message: 'Token JWT inválido',
    });
  }

  const user = await usersRepository.findOne(user_id);

  if (!user) {
    return response.status(400).json({
      status: 'erro',
      message: 'Usuário não encontrado',
    });
  }

  switch (request.method) {
    case 'PUT': {
      const { id, name, email, isResetPassword, password } = request.body;

      const userWithUpdatedEmail = await usersRepository.findOne({
        where: { email },
      });

      if (userWithUpdatedEmail && userWithUpdatedEmail.id !== id) {
        return response.status(404).json({
          status: 'erro',
          message: 'Email já está em uso',
        });
      }

      let updatedUser;

      if (isResetPassword) {
        const hashedPassword = await hash(password, 8);

        updatedUser = await usersRepository.save({
          id: user.id,
          name,
          email,
          password: hashedPassword,
        });
      } else {
        updatedUser = await usersRepository.save({
          id: user.id,
          name,
          email,
        });
      }

      return response.status(200).json({
        ...updatedUser,
        password: undefined,
        is_admin: user.is_admin,
      });
    }
    case 'DELETE': {
      await usersRepository.delete(user.id);

      return response.status(200).json({
        message: 'Usuário excluido com sucesso',
      });
    }

    default:
      return response.status(400).json({
        status: 'erro',
        message: 'Método inválido',
      });
  }
}
