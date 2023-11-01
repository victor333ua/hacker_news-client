import { ChakraProvider, ColorModeProvider } from '@chakra-ui/react'
import theme from '../theme'
import React from 'react';
import '../components/googleAutoComplete.css';
import { ApolloProvider } from '@apollo/client';
import { NormalizedCacheObject } from '@apollo/client';
import { NextPage } from 'next';
import { createApolloClient } from '../apolloClient';
import initializeApollo from '../utils/initApollo';
import { isServer } from '../utils/isServer';
// import App, { AppContext } from 'next/app';
// import { MeDocument } from '../generated/graphql'

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
  let client, key = 0;

  if(isServer())
// ctx is not neccessary here, 'cause apolloState has been populated already                
    client = initializeApollo({
      acp: createApolloClient, ctx: undefined, state: undefined, isNew: !ssr 
    });
  else {
// ctx doesn't exist on client's side
    client = initializeApollo({
      acp: createApolloClient, ctx: undefined, state: apolloState, isNew: false  
    });

  // key = Math.floor(Math.random() * 100);
  // console.log('key= ', key);
  //   const data = client.readQuery({ query: MeDocument });
  //   console.log('key= ', data?.me?.id);
  // key={isHomePage ? key : 1}
  }
  return (
    <ChakraProvider resetCSS theme={theme}>
      <ColorModeProvider
        options={{
          useSystemColorMode: true,
        }}
      > 
        <ApolloProvider client={client}> 
          <Component {...rest} /> 
        </ApolloProvider>    
      </ColorModeProvider>
    </ChakraProvider>
  )
};
// Only uncomment this method if you have blocking data requirements for
// every single page in your application. This disables the ability to
// perform automatic static optimization, causing every page in your app to
// be server-side rendered.
//
// MyApp.getInitialProps = async (appContext: AppContext) => {
//   const appProps = await App.getInitialProps(appContext)
//   return { ...appProps }
// }

export default MyApp
