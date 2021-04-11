import type { NextApiRequest, NextApiResponse } from 'next';
import { getRepository } from 'typeorm';
import { hash } from 'bcryptjs';

import User from '../../entities/User';
import { prepareConnection } from '../../lib/db';
import { ensureAuthenticated } from '../../util/ensureAuthenticated';

export default async function Users(
  request: NextApiRequest,
  response: NextApiResponse,
): Promise<NextApiResponse | void> {
  await prepareConnection();
  const usersRepository = getRepository(User);
  const user_id = ensureAuthenticated(request);

  if (user_id) {
    const checkUserAdmin = await usersRepository.findOne(user_id);

    if (!checkUserAdmin?.is_admin) {
      return response.status(401).json({
        status: 'erro',
        message: 'Usuário não é administrador',
      });
    }
  } else {
    return response.status(401).json({
      status: 'erro',
      message: 'Token JWT inválido',
    });
  }

  switch (request.method) {
    case 'GET': {
      const users = await usersRepository.find();

      return response.status(200).json(users);
    }

    case 'POST': {
      const { name, email, password, is_admin } = request.body;

      const checkUserExists = await usersRepository.findOne({
        where: { email },
      });

      if (checkUserExists) {
        return response.status(400).json({
          status: 'erro',
          message: 'Email já está em uso',
        });
      }

      const hashedPassword = await hash(password, 8);

      const user = usersRepository.create({
        name,
        email,
        password: hashedPassword,
        is_admin,
      });

      await usersRepository.save(user);

      return response.status(200).json({ ...user, password: undefined });
    }
    case 'PUT': {
      const {
        id,
        name,
        email,
        isResetPassword,
        password,
        is_admin,
      } = request.body;

      const user = await usersRepository.findOne(id);

      if (!user) {
        return response.status(400).json({
          status: 'erro',
          message: 'Usuário não encontrado',
        });
      }

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
          is_admin,
        });
      } else {
        updatedUser = await usersRepository.save({
          id: user.id,
          name,
          email,
          is_admin,
        });
      }

      return response.status(200).json({
        ...updatedUser,
        password: undefined,
      });
    }
    case 'DELETE': {
      const { id } = request.body;

      const user = await usersRepository.findOne(String(id));

      if (!user) {
        return response.status(400).json({
          status: 'erro',
          message: 'Usuário não encontrado',
        });
      }

      await usersRepository.delete(id);

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
