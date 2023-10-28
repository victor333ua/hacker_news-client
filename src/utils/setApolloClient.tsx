import { ApolloProvider } from '@apollo/client';
import { NextPage } from 'next';
import { useEffect, useRef } from 'react';
import { ApolloClientParam } from '../types';
import initializeApollo from './initApollo';
import { isServer } from './isServer';
import { ssrPageProps } from '../pages/_app'

export const setApolloClient = (acp: ApolloClientParam) => {
    return (PageComponent: NextPage) => {

        const Fn: NextPage<ssrPageProps> = 
            ({ apolloState, ssr=false, ...rest }) => {
        // apolloState from getServerSideProps, if exist

        // when apolloState changed force react to remount PageComponent
        const stateRef = useRef(0);
        useEffect(() => {stateRef.current++});

        // on client side create new client if not exist or use existing
        // & add this state to client's cache 
        // on server side we get here only at first rendering
        // if getServerSideProps exists ssr=true & we use existing client
            let client; 

            if(isServer())
        // ctx is not neccessary here, 'cause apolloState has been populated already                
               client = initializeApollo({
                    acp, ctx: undefined, state: undefined, isNew: !ssr 
               });
            else
        // ctx doesn't exist on client's side, link'll be overrided after login
                client = initializeApollo({
                    acp, ctx: undefined, state: apolloState, isNew: false  
                });
            return (
                <ApolloProvider client={client}>
                    <PageComponent key={stateRef.current} {...rest} />   
                </ApolloProvider>
            )
        };

        return Fn;
    }
};
