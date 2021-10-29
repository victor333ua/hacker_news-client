import { Container, Flex } from '@chakra-ui/layout';
import { Button } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import router from 'next/router';
import React from 'react'
import { InputField } from '../components/InputField';
import { MeDocument, MeQuery, useSignupMutation } from './../generated/graphql';

interface registerProps {

}

export const register: React.FC<registerProps> = ({}) => {
    const [signup] = useSignupMutation({ errorPolicy: 'all'});
    return (
        <Formik
            initialValues={{ email: "", name: "", password: "" }}
            onSubmit={async (values, { setErrors }) => {
               
                const { data, errors } = await signup({
                    variables: values,
                    update: (cache, { data }) => {
                        if (!data) return;
                        cache.writeQuery<MeQuery>({
                            query: MeDocument,
                            data: {
                                __typename: "Query",
                                me: data.signup.user
                            }    
                        })
                    }
                }); 

                if (errors == undefined) {                
                    localStorage.setItem('token', data?.signup.token as string);
                    router.push("/");                                     
                } else {
                    const objError = JSON.parse(errors[0].message);
                    setErrors(objError);
                } 
            }}   
        >
            {({ isSubmitting }) => (
                 <Container height="100vh" maxWidth="400px" my={8}>
                    <Form>
                        <InputField 
                                name="name"
                                placeholder="..."
                                label="Name"
                        /> 
                         <br/>
                        <InputField 
                                name="email"
                                placeholder="...@..."
                                label="Email"
                        /> 
                        <br/>
                        <InputField 
                                name="password"
                                label="Password"
                                type="password"
                        />  
                        <Button 
                            mt={8} 
                            type="submit" 
                            colorScheme="blue"
                            isLoading={isSubmitting}
                        >
                            register
                        </Button>
                       
                       
                    </Form>
                </Container> 
            )}
        </Formik>
    );
};
export default register;
