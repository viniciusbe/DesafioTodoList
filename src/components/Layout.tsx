import { Box, Flex, useMediaQuery } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';

import { Header } from './Header';
import { Sidebar } from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps): JSX.Element {
  const [displayProfile, setDisplayProfile] = useState(true);

  const [isLargerThan800] = useMediaQuery(['(min-width: 800px)']);

  useEffect(() => {
    setDisplayProfile(isLargerThan800);
  }, [isLargerThan800]);

  return (
    <Box bg="gray.800" w="100vw" h="100vh" color="white">
      <Header />

      <Flex w="100%" my="6" maxW={1120} mx="auto" px="6" bg="gray.800">
        {displayProfile && <Sidebar />}
        {children}
      </Flex>
    </Box>
  );
}
