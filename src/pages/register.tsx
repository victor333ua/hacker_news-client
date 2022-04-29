import { Container, Flex } from '@chakra-ui/layout';
import { Box, Button, HStack } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { NextPage } from 'next';
import router from 'next/router';
import React from 'react'
import { InputField } from '../components/InputField';
import { MeDocument, MeQuery, useSignupMutation } from './../generated/graphql';
import withApollo from '../apolloClient';
import { FaGithub, FaGoogle } from 'react-icons/fa';

export const Register: NextPage = ({}) => {
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

                if (!errors) { 
                    const strToken = data?.signup.token as string;              
                    localStorage.setItem('token', strToken);
                    // for ssr
                    document.cookie = "token=" + encodeURIComponent(strToken);                   
        
                    router.push("/");                                     
                } else {
                    const objError = JSON.parse(errors[0].message);
                    setErrors(objError);
                } 
            }}   
        >
            {({ isSubmitting }) => (
            <Container h="90vh" maxW="400px" mt={8} centerContent >
                <Box mt='20%' border='2px solid blue' p='20px' borderRadius='md'> 
                    <Form>
                        <InputField 
                                name="name"
                                placeholder="..."
                                label="Name"
                                bg='rgb(232, 240, 254)'
                                _placeholder={{ opacity: 1, fontWeight: 'extrabold', color: 'black', letterSpacing: '0.05rem'}}
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
                        <Flex justifyContent='center'> 
                            <Button 
                                mt={8} 
                                type="submit" 
                                colorScheme="blue"
                                isLoading={isSubmitting}
                            >
                                register
                            </Button>
                        </Flex>
                    </Form>

                    <Container m='30px 5px' pos='relative' h='fit-content' centerContent >
                        <Box 
                            w='fit-content'
                            h='fit-content'
                            borderRadius='50%'
                            border='1px solid lightgray' 
                            p='5px'
                            fontSize='xx-small'
                            fontWeight='semibold'
                            bg='white'
                        >
                            OR
                        </Box>
                        <Box h='0.5px' bg=' lightgray' pos='absolute' top='50%' left='0' bottom='0' right='0' zIndex={-1}/>        
                    </Container> 

                    <HStack>
                        <Button bg='black' color='white' leftIcon={<FaGithub />}>
                            Github
                        </Button>
                        <Button bg='#df4930' color='white' leftIcon={<FaGoogle />}>
                            Google
                        </Button>
                    </HStack>
                </Box>
            </Container> 
            )}
        </Formik>
    );
};
export default withApollo(Register);
