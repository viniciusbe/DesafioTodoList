import { ChakraProvider } from '@chakra-ui/react';

import { AppProps } from 'next/app';
import { AuthProvider } from '../hooks/auth';

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <ChakraProvider>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </ChakraProvider>
  );
}

export default MyApp;
