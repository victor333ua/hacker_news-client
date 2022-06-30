import AllPosts from '../components/AllPosts';
import { Layout } from '../components/Layout';
import { NavBar } from '../components/NavBar';
import { NextPage, NextPageContext } from 'next';
import { getServerSideApolloState } from '../utils/getServerSideApolloState'
import withApollo from '../apolloClient';

export async function getServerSideProps(ctx: NextPageContext) {

  const indexProps = {}; // you could add some data here  

  const { apolloState } = await getServerSideApolloState(ctx, Index); 
  
  return {
      props: { ...indexProps, apolloState, ssr: true }
  }
};

const Index: NextPage = (props: any) => {
    return (
        <div>
            <NavBar {...props} />
            <Layout>
                <AllPosts {...props} />     
            </Layout> 
        </div>            
    )
}

export default withApollo(Index);


