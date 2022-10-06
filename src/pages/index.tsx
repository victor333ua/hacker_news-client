import AllPosts from '../components/allPosts';
import { Layout } from '../components/layout';
import { NavBar } from '../components/navBar';
import { NextPage, NextPageContext } from 'next';
import { getServerSideApolloState } from '../utils/getServerSideApolloState'
import withApollo from '../apolloClient';
import React from 'react';

export async function getServerSideProps(ctx: NextPageContext) {

  const indexProps = {}; // you could add some data here  

  const { apolloState } = await getServerSideApolloState(ctx, Index); 
  
  return {
      props: { ...indexProps, apolloState, ssr: true }
  }
};

const Index: NextPage = () => {
    return (
        <div>
           <NavBar />
            <Layout>
                <AllPosts />     
            </Layout> 
        </div>
    )
}

export default withApollo(Index);


