import { getMainDefinition } from "@apollo/client/utilities";
import { WebSocketLink } from "../subscriptions/WebSocketLink";
import { isServer } from "./isServer";
import { setContext } from '@apollo/client/link/context';
import { createHttpLink, split } from "@apollo/client";
import { NextPageContext } from "next";

const getAuthorizationStr = (ctx?: NextPageContext) => {
    let token: string | null; 
// for ssr we use cookie to transport token from client
    if (isServer()) {
        const cookies = ctx?.req?.headers.cookie;
        if (!cookies) return null;
        const arr = cookies.split("token=");
        token = arr.length == 2 //if token in 1 place arr[0] will be empty string
            ? decodeURIComponent(arr.pop()?.split(';').shift() as string)
            : null;
    }
    else {
        token = localStorage.getItem('token')
    }
    return (token && token!=='undefined')  ? `Bearer ${token}` : null;
};

export const getLink = (ctx?: NextPageContext) => {

    const auth = getAuthorizationStr(ctx);
      
    const authLink = setContext((_, { headers }) => { 
        return {
            headers: {...headers, authorization: auth }
        }
    });

    let protocol = 'http'; let wsProtocol = 'ws';
    if (process.env.NEXT_PUBLIC_SECURE === 'yes') {
        protocol = 'https'; wsProtocol = 'wss';
    }

    const link = createHttpLink({
        uri: `${protocol}${process.env.NEXT_PUBLIC_API_URL}graphql`,
        // headers: {
        //     authorization: auth  
        // },
        fetchOptions: {
            credentials: 'include',
        }
    });

    const httpLink = authLink.concat(link);

    if (isServer()) return httpLink;

    const wsLink = new WebSocketLink({
        url: `${wsProtocol}${process.env.NEXT_PUBLIC_API_URL}ws`,
        // lazyCloseTimeout: 50000,
        // retryAttempts: Infinity,
        lazy: true, // make the client does not connect immediately
        on: {
            // connected: () => console.log('graphql-ws connected'),
            error: (err) => console.log(err), 
            // message: (msg) => console.log('msg: ', msg)    
        },
        connectionParams: () => ({ authorization: auth })  
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