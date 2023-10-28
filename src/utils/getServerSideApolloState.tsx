import { createApolloClient } from '../apolloClient';
import { getDataFromTree } from '@apollo/client/react/ssr';
import initializeApollo from './initApollo';
import { NextPage, NextPageContext } from 'next';
import React from 'react';

export const getServerSideApolloState = 
    async (ctx: NextPageContext, Page: NextPage) => {

// we are on the server, always new client    
    const apolloClient = initializeApollo({
        acp: createApolloClient, ctx, state: undefined, isNew: true 
    });

// fill in the cache, here we have possibility to install react context
    await getDataFromTree(<Page  />, { client: apolloClient });

    return {
        apolloState:  apolloClient.extract(), // will be passed to the page component as props
    }
}