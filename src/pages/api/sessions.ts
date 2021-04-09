import type { NextApiRequest, NextApiResponse } from 'next';
import { getRepository } from 'typeorm';
import { compare } from 'bcryptjs';

import { sign } from 'jsonwebtoken';

import User from '../../entities/User';
import { prepareConnection } from '../../lib/db';
import authConfig from '../../config/auth';

export default async function Sessions(
  request: NextApiRequest,
  response: NextApiResponse,
): Promise<NextApiResponse | void> {
  await prepareConnection();
  const usersRepository = getRepository(User);

  try {
    const { email, password } = request.body;

    const user = await usersRepository.findOne({ where: { email } });

    if (!user) {
      return response.status(401).json({
        status: 'erro',
        message: 'Email/senha incorreto(s)',
      });
    }

    const passwordMatched = await compare(password, user.password);

    if (!passwordMatched) {
      return response.status(401).json({
        status: 'erro',
        message: 'Email/senha incorreto(s)',
      });
    }

    const { secret, expiresIn } = authConfig.jwt;

    const token = sign({}, secret, {
      subject: user.id,
      expiresIn,
    });

    return response.send({ user: { ...user, password: undefined }, token });
  } catch (error) {
    return response.status(500).json({
      status: 'erro',
      message: 'Erro ao fazer o login, tente novamente',
    });
  }
}
