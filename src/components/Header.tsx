import {
  Flex,
  Text,
  HStack,
  Box,
  Avatar,
  IconButton,
  Button,
  Icon,
  Link,
} from '@chakra-ui/react';

import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useCallback } from 'react';

import { RiLogoutBoxRLine, RiLoginCircleLine } from 'react-icons/ri';

import { useAuth } from '../hooks/auth';

export function Header(): JSX.Element {
  const { user, signOut, isLoading } = useAuth();

  const router = useRouter();

  if (!isLoading && !user) {
    router.push('/');
  }

  const handleSignOut = useCallback(() => {
    signOut();
    router.push('/');
  }, [router, signOut]);

  return (
    <Flex
      as="header"
      w="100%"
      maxWidth={1480}
      h="20"
      mx="auto"
      mt="4"
      px="6"
      align="center"
    >
      <Text fontSize="3xl" fontWeight="bold" letterSpacing="tight" w="64">
        ToDoList
      </Text>

      <Flex align="center" ml="auto">
        <HStack align="center" spacing="4">
          {isLoading && <Text>Carregando</Text>}

          {!isLoading && user ? (
            <>
              <Box textAlign="right">
                <Text>{user.name}</Text>
                <Text color="gray.300" fontSize="small">
                  {user.email}
                </Text>
              </Box>
              <NextLink href="/profile">
                <Link _hover={{}}>
                  <Avatar size="md" name={user.name} />
                </Link>
              </NextLink>
              <IconButton
                aria-label="Sign out"
                icon={<Icon as={RiLogoutBoxRLine} />}
                onClick={handleSignOut}
              />
            </>
          ) : (
            <Link href="/">
              <Button
                aria-label="Sign in"
                leftIcon={<Icon as={RiLoginCircleLine} />}
              >
                Fazer login
              </Button>
            </Link>
          )}
        </HStack>
      </Flex>
    </Flex>
  );
}
