import type { NextApiRequest, NextApiResponse } from 'next';
import { getRepository } from 'typeorm';
import { hash } from 'bcryptjs';

import User from '../../entities/User';
import { prepareConnection } from '../../lib/db';

export default async function Users(
  request: NextApiRequest,
  response: NextApiResponse,
): Promise<NextApiResponse | void> {
  await prepareConnection();
  const usersRepository = getRepository(User);

  switch (request.method) {
    case 'GET': {
      const users = await usersRepository.find();

      return response.status(200).json(users);
    }

    case 'POST': {
      const { name, email, password } = request.body;

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
      });

      await usersRepository.save(user);

      return response.status(200).json({ ...user, password: undefined });
    }
    case 'PUT': {
      const { id, name, email, isResetPassword, password } = request.body;

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
      });
    }
    case 'DELETE': {
      const { id } = request.query;
      console.log(id);

      const user = await usersRepository.findOne(String(id));

      if (!user) {
        return response.status(400).json({
          status: 'erro',
          message: 'Usuário não encontrado',
        });
      }

      await usersRepository.softDelete(id);

      return response.status(200);
    }

    default:
      return response.status(400).json({
        status: 'erro',
        message: 'Método inválido',
      });
  }
}
