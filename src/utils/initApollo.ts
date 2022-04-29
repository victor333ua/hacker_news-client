import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import merge from 'deepmerge'
import isEqual from 'lodash/isEqual'
import { NextPageContext } from 'next';

let client: ApolloClient<NormalizedCacheObject> | null;

type ApolloClientParam = ApolloClient<NormalizedCacheObject>
  | ((ctx?: NextPageContext) => ApolloClient<NormalizedCacheObject>);

type initializeApolloParam = {
    acp: ApolloClientParam,
    state: NormalizedCacheObject | undefined,
    ctx: NextPageContext | undefined,
    isNew: boolean
};

const initializeApollo = ({ acp, state, ctx, isNew }: initializeApolloParam ) => {
    
    if (isNew) client = null; 
    const _apolloClient = client ?? (typeof acp === 'function' ? acp(ctx) : acp);

// If cache already has data from previous pages or
// loaded during client side data fetching, the initial state,
// received from server for current page, is being added to existing cache
    if (state) {
        // Get existing cache, 
        const existingCache = _apolloClient.extract();

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
        _apolloClient.cache.restore(data);
    }

    client = _apolloClient;
    return _apolloClient;
};

export default initializeApollo;