import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  Icon,
  StackDivider,
  Text,
  VStack,
} from '@chakra-ui/react';
import { RiAddLine } from 'react-icons/ri';
import { useCallback, useEffect, useState } from 'react';

import { Task } from '../../components/Task';
import api from '../../services/api';
import { useAuth } from '../../hooks/auth';
import { Layout } from '../../components/Layout';

interface ITask {
  id: string;
  name: string;
  is_completed: boolean;
}

export default function UserList(): JSX.Element {
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [pendingTasks, setPendingTasks] = useState<ITask[]>([]);
  const [completedTasks, setCompletedTasks] = useState<ITask[]>([]);
  const { isLoading, user } = useAuth();

  useEffect(() => {
    if (!isLoading && user) {
      const loadTasks = async () => {
        try {
          const { data } = await api.get('tasks');

          setTasks(data);
        } catch (error) {
          alert('Falha ao carregar tarefa');
        }
      };
      loadTasks();
    }
  }, [isLoading, user]);

  useEffect(() => {
    setPendingTasks(tasks.filter(task => !task.is_completed));

    setCompletedTasks(tasks.filter(task => task.is_completed));
  }, [tasks]);

  const handleCreateTask = useCallback(async () => {
    const { data } = await api.post('tasks', {
      name: 'Nova tarefa',
    });

    setTasks([data, ...tasks]);
  }, [tasks]);

  const handleUpdateTask = useCallback(
    async ({ id, name, is_completed }: ITask) => {
      try {
        await api.put('tasks', {
          id,
          name,
          is_completed,
        });

        setTasks(
          tasks.map(task => {
            return task.id === id
              ? {
                  ...task,
                  name,
                  is_completed,
                }
              : task;
          }),
        );
      } catch (error) {
        alert('Erro ao atualizar');
      }
    },
    [tasks],
  );

  const handleDeleteTask = useCallback(
    async id => {
      try {
        await api.delete('tasks', {
          data: { id },
        });

        setTasks(tasks.filter(task => task.id !== id));
      } catch (error) {
        alert('Falha ao excluir tarefa');
      }
    },
    [tasks],
  );

  const handleCompleteTask = useCallback(
    async id => {
      setTasks(
        tasks.map(task =>
          task.id === id
            ? {
                ...task,
                is_completed: !task.is_completed,
              }
            : task,
        ),
      );
    },
    [tasks],
  );

  return (
    <Layout>
      <Box flex="1" pt="8">
        <Flex mb="8" justify="space-between" align="center">
          <Heading size="lg" fontWeight="normal">
            Tarefas
          </Heading>

          <Button
            size="sm"
            fontSize="sm"
            colorScheme="pink"
            onClick={handleCreateTask}
            leftIcon={<Icon as={RiAddLine} fontSize="20" />}
          >
            Criar tarefa
          </Button>
        </Flex>

        <Divider my="6" borderColor="gray.700" />

        <VStack spacing="4" divider={<StackDivider borderColor="gray.500" />}>
          {tasks.length || (
            <Box>
              <Text>Sem tarefas ainda</Text>
            </Box>
          )}
          {pendingTasks.map(task => (
            <Task
              taskName={task.name}
              key={task.id}
              taskId={task.id}
              handleUpdateTask={handleUpdateTask}
              handleDeleteTask={handleDeleteTask}
              handleCompleteTask={handleCompleteTask}
              isCompleted={task.is_completed}
            />
          ))}
          {completedTasks.map(task => (
            <Task
              taskName={task.name}
              key={task.id}
              taskId={task.id}
              handleUpdateTask={handleUpdateTask}
              handleDeleteTask={handleDeleteTask}
              handleCompleteTask={handleCompleteTask}
              isCompleted={task.is_completed}
            />
          ))}
        </VStack>
      </Box>
    </Layout>
  );
}
