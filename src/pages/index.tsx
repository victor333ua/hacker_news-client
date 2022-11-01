import AllPosts from '../components/allPosts';
import { Layout } from '../components/layout';
import { NavBar } from '../components/navBar';
import { NextPage, NextPageContext } from 'next';
import { getServerSideApolloState } from '../utils/getServerSideApolloState'
import withApollo from '../apolloClient';
import React from 'react';
import Oauth2Login from '../components/oauth2Login';

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
            <Oauth2Login />
            <NavBar />
            <Layout>
                <AllPosts />     
            </Layout> 
        </div>
    )
}

export default withApollo(Index);


