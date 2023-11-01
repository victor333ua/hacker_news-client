import AllPosts from '../components/allPosts';
import { NavBar } from '../components/navBar';
import { NextPage, NextPageContext } from 'next';
import { getServerSideApolloState } from './../utils/getServerSideApolloState'
// import withApollo from './../apolloClient';
import React, { useState } from 'react';
import CreatePost from '../components/createPost';
import { useColorModeValue } from '@chakra-ui/system';
import { Flex } from '@chakra-ui/react';
import { ssrPageProps } from './_app';

export async function getServerSideProps(ctx: NextPageContext): Promise<{ props: ssrPageProps }> {

  const indexProps = {}; // you could add some data here  

  const { apolloState } = await getServerSideApolloState(ctx, Index); 
  
  return {
      props: { ...indexProps, apolloState, ssr: true }
  }
};

export enum Menu { Posts, NewPost };

const Index: NextPage = () => {
    const bg = useColorModeValue('gray.100', 'gray.500')

    const [menuItem, setItem] = useState<Menu>(Menu.Posts);

    return (
        <Flex h='100vh' flexDirection='column'>
            <NavBar setItem={ setItem } />
            <Flex 
                flexDirection='column'
                justifyContent='center'
                alignItems='center'
                w='100%'
                grow={1}
                bg={bg}
            >
                { menuItem == Menu.Posts && <AllPosts /> }
                { menuItem == Menu.NewPost && <CreatePost setItem={ setItem }/> }
            </Flex>     
        </Flex>
    )
}

export default Index;


