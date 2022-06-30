import { ApolloProvider } from '@apollo/client';
import { NextPage } from 'next';
import { useEffect, useRef } from 'react';
import { ApolloClientParam } from '../types';
import initializeApollo from './initApollo';
import { isServer } from './isServer';

export const getWithApollo = (acp: ApolloClientParam) => {
    return (PageComponent: NextPage) => {

        const WithApollo: NextPage<any> = ({apolloState, ssr=false, ...rest}) => {
        // apolloState from getServerSideProps, if exist

        // when apolloState changed force react to remount PageComponent
        const stateRef = useRef(0);
        useEffect(() => {stateRef.current++});

        // console.log(`render withApollo ${stateRef.current}`);
            
            // const stateRef = useRef(apolloState);
            // const [x, forceUpdate] = useState(0); 
            // useEffect(()=> {
            //     stateRef.current = {}; 
            //     console.log('empty');
            // },[x]);

            // useEffect(() => {
            //     return () => {
            //         stateRef.current = apolloState;
            //         console.log('state');
            //         forceUpdate(x => x + 1);
            //     }
            // },[apolloState]);

            // console.log('render');

        // on client side create new client if not exist or use existing
        // & add this state to client's cache 
        // on server side we get here only at first rendering
        // if getServerSideProps exists ssr=true & we use existing client
            let client; 

            if(isServer()) {               
               client = initializeApollo({
                    acp, ctx: undefined, state: undefined, isNew: !ssr 
               });
            } else
                client = initializeApollo({
                    acp, ctx: undefined, state: apolloState, isNew: false  
                });

            return (
                <ApolloProvider client={client}>
                    <PageComponent key={stateRef.current} {...rest} />   
                </ApolloProvider>
            )
        };

        return WithApollo;
    }
};
