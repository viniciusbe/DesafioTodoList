import {
  Box,
  Button,
  Flex,
  Heading,
  Icon,
  StackDivider,
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

  useEffect(() => {
    setTasks([
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
    ]);
  }, []);

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
    ({ id, name }) => {
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
            {tasks.map(task => (
              <Task
                taskName={task.name}
                key={task.id}
                handleUpdateTask={handleUpdateTask}
                taskId={task.id}
              />
            ))}
          </VStack>
        </Box>
      </Flex>
    </Box>
  );
}
