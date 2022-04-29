import AllPosts from '../components/AllPosts';
import { Layout } from '../components/Layout';
import { NavBar } from '../components/NavBar';
import { NextPage, NextPageContext } from 'next';
import withApollo from '../apolloClient';
import { getServerSidePropsWithApollo } from '../utils/getServerSidePropsWithApollo';

export async function getServerSideProps(ctx: NextPageContext) {
// work only with deploying in Vercel in production
    // if (ctx.res) {
    //     ctx.res.setHeader(
    //     'Cache-Control',
    //     'public, max-age=60'
    //   )
    // }

  const indexProps = {};  

  const { apolloState } = await getServerSidePropsWithApollo(ctx, Index); 
  
  return {
      props: { ...indexProps, apolloState }
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
