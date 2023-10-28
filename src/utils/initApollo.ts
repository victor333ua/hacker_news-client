import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import merge from 'deepmerge'
import isEqual from 'lodash/isEqual'
import { NextPageContext } from 'next';
import { ApolloClientParam } from '../types'
import { isServer } from './isServer';

let globalClient: ApolloClient<NormalizedCacheObject> | null;

type initializeApolloParam = {
    acp: ApolloClientParam;
    ctx: NextPageContext | undefined;
    state: NormalizedCacheObject | undefined;
    isNew: boolean
};

const initializeApollo = ({ acp, ctx, state, isNew }: initializeApolloParam ) => {
    
    if (isNew) globalClient = null; 
    globalClient = globalClient ?? acp(ctx);

// If cache already has data from previous pages or
// loaded during client side data fetching, the initial state,
// received from server for current page, is being added to existing cache.
// On server side during rendering page we already have apolloState
// after perfoming getDataFromTree
    if (state && !isServer()) {
        // Get existing cache, 
        const existingCache = globalClient.extract();

        // Merge the initialState from getStaticProps/getServerSideProps in the existing cache
        const data: NormalizedCacheObject = merge(existingCache, state, {
        // combine arrays using object equality (like in sets)
            arrayMerge: (destinationArray, sourceArray) => [
                ...sourceArray,
                ...destinationArray.filter((d) =>
                    sourceArray.every((s) => !isEqual(d, s))
                ),
            ],
        });

        // Restore the cache with the merged data
        globalClient.restore(data);
    }
    return globalClient;
};

export default initializeApollo;