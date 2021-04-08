import {
  Box,
  Button,
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
import { Header } from '../../components/Header';
import { Sidebar } from '../../components/Sidebar';
// import { Pagination } from '../components/Pagination';

interface ITask {
  id: string;
  name: string;
  isCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export default function UserList(): JSX.Element {
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [pendingTasks, setPendingTasks] = useState<ITask[]>([]);
  const [completedTasks, setCompletedTasks] = useState<ITask[]>([]);

  useEffect(() => {
    const data = [
      {
        id: '1',
        name: 'Tarefa 1',
        isCompleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        name: 'Tarefa 2',
        isCompleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '3',
        name: 'Tarefa 3',
        isCompleted: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '4',
        name: 'Tarefa 4',
        isCompleted: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    setTasks(data);
  }, []);

  useEffect(() => {
    setPendingTasks(tasks.filter(task => !task.isCompleted));
    setCompletedTasks(tasks.filter(task => task.isCompleted));
  }, [tasks]);

  const handleCreateTask = useCallback(() => {
    setTasks([
      {
        id: String(new Date()),
        name: 'Nova tarefa',
        isCompleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      ...tasks,
    ]);
  }, [tasks]);

  const handleUpdateTask = useCallback(
    async ({ id, name }) => {
      setTasks(
        tasks.map(task => {
          return task.id === id
            ? {
                ...task,
                name,
              }
            : task;
        }),
      );
    },
    [tasks],
  );

  const handleDeleteTask = useCallback(
    async id => {
      setTasks(tasks.filter(task => task.id !== id));
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
                isCompleted: !task.isCompleted,
              }
            : task,
        ),
      );
    },
    [tasks],
  );

  return (
    <Box>
      <Header />

      <Flex w="100%" my="6" maxW={1480} mx="auto" px="6">
        <Sidebar />

        <Box flex="1" borderRadius={8} bg="gray.800" p="8">
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
          <VStack spacing="4" divider={<StackDivider borderColor="gray.500" />}>
            <StackDivider />
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
                isCompleted
              />
            ))}
          </VStack>
        </Box>
      </Flex>
    </Box>
  );
}
