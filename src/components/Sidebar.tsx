import { Box, Stack, Text, Link, Icon } from '@chakra-ui/react';
import { RiTaskLine, RiContactsLine } from 'react-icons/ri';

export function Sidebar(): JSX.Element {
  return (
    <Box as="aside" w="64" mr="8">
      <Stack spacing="12" align="flex-start">
        <Box>
          <Text fontWeight="bold" color="gray.400" fontSize="small">
            MENU
          </Text>
          <Stack spacing="4" mt="8" align="stretch">
            <Link display="flex" align="center">
              <Icon as={RiTaskLine} fontSize="20" />
              <Text ml="4" fontWeight="medium">
                Tarefas
              </Text>
            </Link>
            <Link display="flex" align="center">
              <Icon as={RiContactsLine} fontSize="20" />
              <Text ml="4" fontWeight="medium">
                Usuários
              </Text>
            </Link>
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
}
