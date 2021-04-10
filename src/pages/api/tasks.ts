import type { NextApiRequest, NextApiResponse } from 'next';
import { getRepository } from 'typeorm';

import Task from '../../entities/Task';
import { prepareConnection } from '../../lib/db';
import { ensureAuthenticated } from '../../util/ensureAuthenticated';

export default async function Tasks(
  request: NextApiRequest,
  response: NextApiResponse,
): Promise<NextApiResponse | void> {
  await prepareConnection();
  const tasksRepository = getRepository(Task);
  const user_id = ensureAuthenticated(request);

  if (!user_id) {
    return response.status(401).json({
      status: 'erro',
      message: 'Token JWT inválido',
    });
  }

  switch (request.method) {
    case 'GET': {
      const tasks = await tasksRepository.find({ where: { user_id } });

      if (!tasks) {
        return response.status(400).json({
          status: 'erro',
          message: 'Usuário não encontrado',
        });
      }

      return response.status(200).json(tasks);
    }

    case 'POST': {
      const { name } = request.body;

      const task = tasksRepository.create({ name, user_id });

      await tasksRepository.save(task);

      return response.status(200).json(task);
    }
    case 'PUT': {
      const { id, name, is_completed } = request.body;

      const task = await tasksRepository.findOne({ where: { id, user_id } });

      if (!task) {
        return response.status(400).json({
          status: 'erro',
          message: 'Tarefa não encontrada',
        });
      }

      await tasksRepository.save({ id, name, is_completed });

      return response.status(200).json(task);
    }
    case 'DELETE': {
      const { id } = request.body;

      const task = tasksRepository.findOne({ where: { id, user_id } });

      if (!task) {
        return response.status(400).json({
          status: 'erro',
          message: 'Tarefa não encontrada',
        });
      }

      await tasksRepository.delete(id);

      return response.status(200).json({
        message: 'Tarefa excluída com sucesso',
      });
    }

    default:
      return response.status(400).json({
        status: 'erro',
        message: 'Método inválido',
      });
  }
}
