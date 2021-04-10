import { Box, Flex, useMediaQuery } from '@chakra-ui/react';
import React from 'react';

import { Header } from './Header';
import { Sidebar } from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps): JSX.Element {
  const [isLargerThan800] = useMediaQuery(['(min-width: 800px)']);

  return (
    <Box>
      <Header />

      <Flex w="100%" my="6" maxW={1120} mx="auto" px="6">
        {isLargerThan800 && <Sidebar />}
        {children}
      </Flex>
    </Box>
  );
}
