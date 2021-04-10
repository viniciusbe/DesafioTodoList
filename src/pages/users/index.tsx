import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  Heading,
  Icon,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useMediaQuery,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { useCallback, useEffect, useState } from 'react';

import { RiAddLine, RiPencilLine, RiDeleteBin5Fill } from 'react-icons/ri';

import { Layout } from '../../components/Layout';
import { EditUser } from '../../components/Modal/EditUser';
import { useAuth } from '../../hooks/auth';
import api from '../../services/api';
import formatDate from '../../util/formatDate';

interface CreateUserFormData {
  id: string;
  name: string;
  email: string;
  created_at: Date;
  is_admin: boolean;
}

export default function UserList(): JSX.Element {
  const [users, setUsers] = useState<CreateUserFormData[]>([]);
  const [userSelected, setUserSelected] = useState<CreateUserFormData>(
    {} as CreateUserFormData,
  );
  const [isDeleting, setIsDeleting] = useState(false);

  const [isLargerThan800] = useMediaQuery(['(min-width: 800px)']);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const { isLoading } = useAuth();

  useEffect(() => {
    async function loadUsers() {
      if (!isLoading) {
        try {
          const { data } = await api.get('users');
          setUsers(data);
        } catch (error) {
          alert('Falha ao carregar usuários');
        }
      }
    }
    loadUsers();
  }, [isLoading]);

  const handleOpenModal = useCallback(
    (id: string) => {
      setUserSelected(users.filter(user => user.id === id)[0]);
      onOpen();
    },
    [users, onOpen],
  );

  const handleUpdateUsers = useCallback(
    ({ name, email }) => {
      setUsers(
        users.map(user =>
          user.id === userSelected.id
            ? {
                ...userSelected,
                name,
                email,
              }
            : user,
        ),
      );
    },
    [users, userSelected],
  );

  const handleDeleteUser = useCallback(
    async (id: string) => {
      try {
        setIsDeleting(true);
        await api.delete('users', {
          data: {
            id,
          },
        });

        setUsers(users.filter(user => user.id !== id));
      } catch (error) {
        alert('Erro ao exlcuir usuário');
      } finally {
        setIsDeleting(false);
      }
    },
    [users],
  );

  return (
    <Layout>
      <Box flex="1" pt="8">
        <EditUser
          isOpen={isOpen}
          onClose={onClose}
          user={{ ...userSelected, password: '', password_confirmation: '' }}
          handleUpdateUsers={handleUpdateUsers}
        />
        <Flex mb="8" justify="space-between" align="center">
          <Heading size="lg" fontWeight="normal">
            Usuários
          </Heading>

          <NextLink href="/users/create">
            <Button
              size="sm"
              fontSize="sm"
              colorScheme="pink"
              leftIcon={<Icon as={RiAddLine} fontSize="20" />}
            >
              Criar usuário
            </Button>
          </NextLink>
        </Flex>

        <Table colorScheme="whiteAlpha">
          <Thead>
            <Tr>
              <Th>Usuário</Th>
              {isLargerThan800 && <Th>Data de cadastro</Th>}
              <Th width="8" />
            </Tr>
          </Thead>
          <Tbody>
            {users.map(user => (
              <Tr key={user.id}>
                <Td>
                  <Box>
                    <Text fontWeight="bold">{user.name}</Text>
                    <Text fontSize="sm" color="gray.300">
                      {user.email}
                    </Text>
                  </Box>
                </Td>
                {isLargerThan800 && <Td>{formatDate(user.created_at)}</Td>}
                <Td>
                  <ButtonGroup size="sm">
                    <Button
                      onClick={() => handleOpenModal(user.id)}
                      colorScheme="purple"
                      leftIcon={<Icon as={RiPencilLine} fontSize="16" />}
                    >
                      Editar
                    </Button>
                    <Button
                      colorScheme="red"
                      onClick={() => handleDeleteUser(user.id)}
                      isLoading={isDeleting}
                      leftIcon={<Icon as={RiDeleteBin5Fill} fontSize="16" />}
                    >
                      Excluir
                    </Button>
                  </ButtonGroup>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Layout>
  );
}
