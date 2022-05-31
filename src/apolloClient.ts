import { ApolloClient, InMemoryCache } from "@apollo/client";
import { LinksPayload } from "./generated/graphql";
import { getLink } from "./utils/getLink";
import { isServer } from "./utils/isServer";
import { ApolloClientParam } from './types';
import { getWithApollo } from './utils/withApollo'

export const createApolloClient: ApolloClientParam =  ctx => {
        
    const cache = new InMemoryCache({
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
    return new ApolloClient({
        ssrMode: isServer(),
        link: getLink(ctx),
        cache,
        connectToDevTools: true
    });     
};
export default getWithApollo(createApolloClient);
