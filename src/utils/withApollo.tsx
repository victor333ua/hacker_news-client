import { ApolloClient,  ApolloProvider,  NormalizedCacheObject } from '@apollo/client';
import { NextPage, NextPageContext } from 'next';
import initializeApollo from './initApollo';

type ApolloClientParam = ApolloClient<NormalizedCacheObject>
  | ((ctx?: NextPageContext) => ApolloClient<NormalizedCacheObject>);

export const withApollo = (acp: ApolloClientParam) => {
    return (PageComponent: NextPage) => {
// we are on client side

        const WithApollo: NextPage = (pageProps: any) => {

        // get apollo cache state from getServerSideProps, if exist
            const state = pageProps.apolloState;

        // add this state to existing cache 
            const client = initializeApollo({ acp, state, ctx: undefined, isNew: false });

            return (
                <ApolloProvider client={client}>
                    <PageComponent {...pageProps} />   
                </ApolloProvider>
            )
        };

        return WithApollo;
    }
}