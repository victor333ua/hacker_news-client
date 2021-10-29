import { ChakraProvider, ColorModeProvider } from '@chakra-ui/react'
import { ApolloProvider } from '@apollo/client'
import theme from '../theme'
import React from 'react';
import { client } from '../apolloClient';

function MyApp({ Component, pageProps }: any) {
  return (
    <ChakraProvider resetCSS theme={theme}>
      <ColorModeProvider
        options={{
          useSystemColorMode: true,
        }}
      >
        <ApolloProvider client={client}>
          <Component {...pageProps} />
        </ApolloProvider>
      </ColorModeProvider>
    </ChakraProvider>
  )
}

export default MyApp
