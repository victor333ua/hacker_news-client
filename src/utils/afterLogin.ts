import { ApolloClient } from "@apollo/client"
import { User } from "../generated/graphql";
import { modifyCacheSetUser } from "./cache";
import { changeAuth } from "./changeAuth";

export const afterLogin = 
    (client: ApolloClient<object>, 
    data: { token: string, user: User | undefined }) => {
    
    const strToken = data.token as string;              
    localStorage.setItem('token', strToken);
    // for ssr
    document.cookie = `token=${encodeURIComponent(strToken)}; path=/;`;               

    if (data.user) modifyCacheSetUser(client.cache, data.user);

    changeAuth(client); 
} 