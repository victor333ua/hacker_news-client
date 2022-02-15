import AllPosts from '../components/AllPosts';
import { Layout } from '../components/Layout';
import { NavBar } from '../components/NavBar';

const Index = () => {
    return(
        <div>
            <NavBar />
            <Layout>
                <AllPosts />     
            </Layout> 
        </div>
    )
}
export default Index;
