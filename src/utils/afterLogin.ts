import { ApolloClient } from "@apollo/client"
import { NextRouter } from "next/router";
import { MeDocument, MeQuery, User } from "../generated/graphql";
import { changeAuth } from "./changeAuth";

export const afterLogin = 
    (client: ApolloClient<object>, 
    router: NextRouter, 
    data: { token: string, user: User | undefined }) => {
    
    const strToken = data.token as string;              
    localStorage.setItem('token', strToken);
    // for ssr
    document.cookie = `token=${encodeURIComponent(strToken)}; path=/;`;               

    if (data.user)
        client.cache.writeQuery<MeQuery>({
            query: MeDocument,
            data: {
                __typename: "Query",
                me: data.user
            }    
        });

    changeAuth(client); 

    if (typeof router.query?.next === 'string') {
        router.push(router.query.next) ;
    } else {
        router.push('/');
    }                                                      
} 