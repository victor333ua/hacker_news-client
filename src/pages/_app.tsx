import { ChakraProvider, ColorModeProvider } from '@chakra-ui/react'
import theme from '../theme'
import React, { useEffect, useRef } from 'react';
import '../components/googleAutoComplete.css';
import { ApolloProvider } from '@apollo/client';
import { NormalizedCacheObject } from '@apollo/client';
import { NextPage } from 'next';
import { createApolloClient } from '../apolloClient';
import initializeApollo from '../utils/initApollo';
import { isServer } from '../utils/isServer';

export type ssrPageProps = {
    apolloState: NormalizedCacheObject | undefined,
    ssr: boolean
};

type appType = {
  Component: NextPage, 
  pageProps: ssrPageProps
}

function MyApp({ Component, pageProps }: appType) {
  const { apolloState, ssr=false, ...rest } = pageProps;

// when apolloState changed force react to remount Index
  const isHomePage = Component.name === 'Index';
  const stateRef = useRef(0);
  useEffect(() => {
    if (isHomePage) stateRef.current++;
  });

  let client; 

  if(isServer())
// ctx is not neccessary here, 'cause apolloState has been populated already                
    client = initializeApollo({
      acp: createApolloClient, ctx: undefined, state: undefined, isNew: !ssr 
    });
  else
// ctx doesn't exist on client's side, link'll be overrided after login
    client = initializeApollo({
      acp: createApolloClient, ctx: undefined, state: apolloState, isNew: false  
    });

    console.log('key= %d', stateRef.current);

  return (
    <ChakraProvider resetCSS theme={theme}>
      <ColorModeProvider
        options={{
          useSystemColorMode: true,
        }}
      > 
        <ApolloProvider client={client}> 
          <Component key={isHomePage ? stateRef.current : 1} {...rest} /> 
        </ApolloProvider>    
      </ColorModeProvider>
    </ChakraProvider>
  )
}

export default MyApp
