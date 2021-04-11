import {
  Flex,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from '@chakra-ui/react';

import { useRouter } from 'next/router';
import { useAuth } from '../hooks/auth';

import { SignIn } from '../components/Form/SignIn';
import { Register } from '../components/Form/Register';

export default function Authentication(): JSX.Element {
  const { isLoading, user } = useAuth();

  const router = useRouter();

  if (!isLoading && user) {
    router.push('/tasks');
  }

  return (
    <Flex w="100vw" h="100vh" align="center" justify="center" bg="gray.800">
      <Tabs isFitted variant="enclosed" colorScheme="purple" w={360} px="8">
        <TabList>
          <Tab>Sign in</Tab>
          <Tab>Create account</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <SignIn />
          </TabPanel>

          <TabPanel>
            <Register />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  );
}
