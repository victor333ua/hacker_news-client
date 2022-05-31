import { useApolloClient } from '@apollo/client';
import { Box, Button, Container, Flex, HStack, Text } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React from 'react';
import { FaGithub, FaGoogle } from 'react-icons/fa';
import withApollo from '../apolloClient';
import { InputField } from '../components/InputField';
import { afterLogin } from '../utils/afterLogin';
import { useLoginMutation } from './../generated/graphql';

const googleLogin = async () => {
   window.open(`http${process.env.NEXT_PUBLIC_API_URL}oauth2/google/login`, '_self');
}

const gitHubLogin = () => {

}

const Login: NextPage = () => {
    const client = useApolloClient();
    const [login] = useLoginMutation({ errorPolicy: 'all' });
    const router = useRouter();
    
    return (
        <Formik
            initialValues={{ email: "", password: "" }}
            onSubmit={async (values, { setErrors }) => {
               
                const { data, errors } = await login({
                    variables: values,
                    // update: (cache, { data }) => {
                    //     if (!data) return;
                    //     const me = {...data.login.user};
                    //     cache.writeQuery<MeQuery>({
                    //         query: MeDocument,
                    //         data: {
                    //             __typename: "Query",
                    //             me
                    //         }    
                    //     });
                    // }
                });
                
                if (data) { 
                    const strToken = data?.login.token as string;              
                    afterLogin(client, strToken, router);
                } else {
                    const objError = JSON.parse(errors[0].message);
                    setErrors(objError);
                }                    
            }}
        >
            {({ isSubmitting }) => (
                 <Container h="90vh" maxW="400px" mt={8} centerContent >
                    <Box mt='20%' border='2px solid blue' p='20px' borderRadius='md'> 
                        <Form >
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
                            <Flex direction='column' alignItems='center'>
                                <Button 
                                    mt={8} 
                                    type="submit" 
                                    colorScheme="blue"
                                    isLoading={isSubmitting}
                                    mx='auto'                            
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
                            <Button bg='black' color='white' leftIcon={<FaGithub />} 
                                onClick={ e => { e.preventDefault(); gitHubLogin() }}
                            >
                                Github
                            </Button>
                            <Button bg='#df4930' color='white' leftIcon={<FaGoogle />} 
                                onClick={ e => { e.preventDefault(); googleLogin() }}
                            >
                                Google
                            </Button>
                        </HStack>
                    </Box>
                </Container>
               
            )}
        </Formik>
    );
};
export default withApollo(Login);