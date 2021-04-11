import { HamburgerIcon } from '@chakra-ui/icons';
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
  useMediaQuery,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';

import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';

import {
  RiLogoutBoxRLine,
  RiLoginCircleLine,
  RiTaskLine,
  RiContactsLine,
  RiProfileLine,
} from 'react-icons/ri';

import { useAuth } from '../hooks/auth';

export function Header(): JSX.Element {
  const { user, signOut, isLoading } = useAuth();

  const [displayProfile, setDisplayProfile] = useState(true);

  const [isLargerThan800] = useMediaQuery(['(min-width: 800px)']);

  useEffect(() => {
    setDisplayProfile(isLargerThan800);
  }, [isLargerThan800]);

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
      maxWidth={1120}
      h="20"
      mx="auto"
      pt="4"
      px="6"
      align="center"
      bg="gray.800"
    >
      <Text
        fontSize="3xl"
        fontWeight="bold"
        letterSpacing="tight"
        ml="4"
        w="64"
      >
        ToDoList
      </Text>
      {displayProfile ? (
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
      ) : (
        <Menu colorScheme="gray">
          <MenuButton
            ml="auto"
            as={IconButton}
            aria-label="Options"
            icon={<HamburgerIcon />}
            variant="outline"
          />
          <MenuList>
            <NextLink href="/tasks">
              <MenuItem icon={<RiTaskLine fontSize="20" />}>
                <Text ml="4" fontWeight="medium">
                  Tarefas
                </Text>
              </MenuItem>
            </NextLink>
            <NextLink href="/profile">
              <MenuItem icon={<RiProfileLine fontSize="20" />}>
                <Text ml="4" fontWeight="medium">
                  Perfil
                </Text>
              </MenuItem>
            </NextLink>
            {!isLoading && !!user?.is_admin && (
              <NextLink href="/users">
                <MenuItem icon={<RiContactsLine fontSize="20" />}>
                  <Link display="flex" align="center">
                    <Text ml="4" fontWeight="medium">
                      Usuários
                    </Text>
                  </Link>
                </MenuItem>
              </NextLink>
            )}
          </MenuList>
        </Menu>
      )}
    </Flex>
  );
}
