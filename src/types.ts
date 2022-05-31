import { NextPageContext } from 'next';
import { NormalizedCacheObject, ApolloClient} from '@apollo/client'

export type ApolloClientParam = 
    (ctx?: NextPageContext) => ApolloClient<NormalizedCacheObject>


