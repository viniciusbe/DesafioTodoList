import type { NextApiRequest, NextApiResponse } from 'next';
import { getRepository } from 'typeorm';
import { compare, hash } from 'bcryptjs';

import User from '../../entities/User';
import { prepareConnection } from '../../lib/db';

export default async function (
  request: NextApiRequest,
  response: NextApiResponse,
) {
  await prepareConnection();
  const usersRepository = getRepository(User);

  switch (request.method) {
    case 'GET':
      break;
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
    case 'PUT':
      break;
    case 'DELETE':
      break;

    default:
      break;
  }
  if (request.method === 'POST') {
    return response.status(200).json({ ok: 'ok' });
  }

  return response.status(400).json({ ok: 'get' });
}
