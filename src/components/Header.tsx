import { Flex, Text, Input, Icon, HStack, Box, Avatar } from '@chakra-ui/react';
import {
  RiSearchLine,
  RiNotificationLine,
  RiUserAddLine,
} from 'react-icons/ri';
import { useAuth } from '../hooks/auth';

export function Header(): JSX.Element {
  const { user } = useAuth();

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
        <Flex align="center">
          <Box mr="4" textAlign="right">
            <Text>{user?.name}</Text>
            <Text color="gray.300" fontSize="small">
              {user?.email}
            </Text>
          </Box>

          <Avatar size="md" name="Vinícius Bernardes" />
        </Flex>
      </Flex>
    </Flex>
  );
}
