import { ChakraProvider } from '@chakra-ui/react';

import { AppProps } from 'next/app';
import { AuthProvider } from '../hooks/auth';
import theme from '../theme';

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <ChakraProvider resetCSS theme={theme}>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </ChakraProvider>
  );
}

export default MyApp;
