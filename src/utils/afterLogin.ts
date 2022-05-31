import { ApolloClient } from "@apollo/client"
import { NextRouter } from "next/router";
import { changeAuth } from "./changeAuth";

export const afterLogin = 
    (client: ApolloClient<object>, strToken: string, router: NextRouter) => {
       
    localStorage.setItem('token', strToken);
    // for ssr
    document.cookie = `token=${encodeURIComponent(strToken)}; path=/;`;               

    changeAuth(client);// 

    if (typeof router.query.next === 'string') {
        router.push(router.query.next) ;
    } else {
        router.push('/');
    }                                                      
} 