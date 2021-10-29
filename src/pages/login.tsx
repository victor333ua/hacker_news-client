import { Button, Container, Flex, Text } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import router from 'next/router';
import React from 'react'
import { InputField } from '../components/InputField';
import { MeQuery, useLoginMutation, MeDocument } from './../generated/graphql';

interface loginProps {}

const login: React.FC<loginProps> = ({}) => {
    const [login] = useLoginMutation({ errorPolicy: 'all' });
    
    return (
        <Formik
            initialValues={{ email: "", password: "" }}
            onSubmit={async (values, { setErrors }) => {
               
                const { data, errors } = await login({
                    variables: values,
                    update: (cache, { data }) => {
                        if (!data) return;
                        cache.writeQuery<MeQuery>({
                            query: MeDocument,
                            data: {
                                __typename: "Query",
                                me: data.login.user
                            }    
                        })
                    }
                });
                
                if (!errors) {                
                    localStorage.setItem('token', data?.login.token as string);
                    if (typeof router.query.next === 'string') {
                        router.push(router.query.next) ;
                    } else {
                        router.push("/");
                    }                                      
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
                            login
                        </Button>
                        <Flex mt={4} >
                            <Text fontSize="sm" fontStyle="italic">New to us?</Text>
                            <Button
                                ml={2} 
                                variant="link" 
                                colorScheme="blue" 
                                size="sm"
                                _focus={{ boxShadow: 'none !important' }}
                                _active={{ border: '1px blue !important' }}
                                onClick={() => router.push("/register")}
                            >
                                Register
                            </Button>
                        </Flex> 
                    </Form>
                </Container> 
            )}
        </Formik>
    );
};
export default login;