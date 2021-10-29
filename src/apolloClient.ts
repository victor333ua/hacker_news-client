import { ApolloClient, createHttpLink, InMemoryCache, split } from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";
import { WebSocketLink } from "./subscriptions/WebSocketLink";
import { isServer } from "./utils/isServer";
import { setContext } from '@apollo/client/link/context';
import { LinksPayload } from "./generated/graphql";

export const cache = new InMemoryCache({
    typePolicies: {
        Query: {
            fields: {
                feed: {
                    keyArgs: false,
                    merge(
                        existing: LinksPayload = { posts: [], hasMore: true },
                        incoming: LinksPayload) {
                            const mergedPosts =  [...existing.posts, ...incoming.posts];
                            return {
                                posts: mergedPosts,
                                hasMore: incoming.hasMore
                            }                          
                    }
                },
            }       
        }               
    }
});

const getAuthorizationStr = () => {
    let token = localStorage.getItem('token');
    console.log('token= ', token);
    if (token === 'undefined') token = null;
    return   token  ? `Bearer ${token}` : null;
};

const link = createHttpLink({
    uri: `http${process.env.NEXT_PUBLIC_API_URL}`,
    // headers: {
    //     authorization: !isServer() ? getAuthorizationStr() : null  
    // },
    fetchOptions: {
        credentials: "include" as const,
    }
});

const authLink = setContext((_, { headers }) => {
    const authorization = getAuthorizationStr();  
    return {
      headers: {...headers, authorization }
    }
}); 
const httpLink = authLink.concat(link);

export const getLink = () => {

    if (isServer()) return httpLink;
     
    const wsLink = new WebSocketLink({
        url: `ws${process.env.NEXT_PUBLIC_API_URL}`,
        lazyCloseTimeout: 50000,
        retryAttempts: Infinity,
        lazy: false, // make the client connect immediately
        on: {
            connected: () => console.log('graphql-ws connected'),
            error: (err) => console.log(err), 
            message: (msg) => console.log('msg: ', msg)    
        },
        connectionParams: () => ({ authorization: getAuthorizationStr() })  
    });

    return split(
        ({ query }) => {
            const definition = getMainDefinition(query);
            return (
                definition.kind === 'OperationDefinition' &&
                definition.operation === 'subscription'
            );
        },
        wsLink,
        httpLink
    );
};  

export const client = new ApolloClient({
    link: getLink(),
    cache
});    

// client.onResetStore(async () => {
//     client.setLink(getLink());
// });