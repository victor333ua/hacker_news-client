import { Button } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { useRouter } from "next/router";
import React from 'react';
import { InputField } from '../components/InputField';
import { Layout } from '../components/Layout';
import { modifyCacheAddPost } from '../utils/cache';
import { AllPostsDocument, AllPostsQuery, Link, useCreatePostMutation } from './../generated/graphql';
import { useIsAuth } from './../utils/useIsAuth';


const CreatePost: React.FC<{}> = ({}) => {
    const router = useRouter();
    const [createPost] = useCreatePostMutation({ errorPolicy: 'all' });

    useIsAuth();
   
    return (
        <Layout>
            <Formik
                initialValues={{ description: "", url: "" }}
                onSubmit={async values => {
                    const { errors } = await createPost({
                        variables: values,
                        update: (_, { data }) => {
                            if (!data) return;
                            modifyCacheAddPost(data.createPost as Link)
                        }
                    });
                    if (!errors) {
                        router.push("/");
                    }
                }}
            >
                {({ isSubmitting }) => (
                    <Form>
                        <InputField 
                            name="description"
                            placeholder="...text"
                            label="Description"
                            textarea     
                        /> 
                        <br/>
                        <InputField 
                            name="url"
                            placeholder="...@..."
                            label="Url"       
                        />  
                        <Button 
                            mt={8} 
                            type="submit" 
                            colorScheme="blue"
                            isLoading={isSubmitting}
                        >
                            create post
                        </Button>
                    </Form> 
                )}
            </Formik>
        </Layout>
    );     
}
export default CreatePost;