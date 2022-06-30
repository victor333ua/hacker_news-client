import { useApolloClient } from '@apollo/client';
import { Button, Flex } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/router';
import { InputField } from '../components/InputField';
import { afterLogin } from '../utils/afterLogin';
import { useLoginMutation } from './../generated/graphql';
import * as Yup from 'yup';

export const LoginForm = () => {
    const client = useApolloClient();
    const [login] = useLoginMutation({ errorPolicy: 'all' });
    const router = useRouter();

    return (     
        <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={Yup.object({
                password: Yup.string()
                    .min(3, 'Must be 3 characters or more')
                    .max(6, 'Must be 6 characters or less')
                    .required('Required'),
                email: Yup.string()
                    .email('Invalid email')
                    .required('Required')
            })}
            onSubmit={async (values, { setErrors }) => {
            
                const { data, errors } = await login({
                    variables: values,
                    errorPolicy: 'all'
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
                } else if (errors){
                    const objError = JSON.parse(errors[0].message);
                    setErrors(objError);
                }                    
            }}
        >
            {({ isSubmitting }) => (                
                    <Form >
                        <InputField 
                                name="email"
                                placeholder="...@..."
                                label="Email"
                                bg='rgb(232, 240, 254)'
                                mb={4}
                                _placeholder={{ opacity: 1, fontWeight: 'bold', color: 'black', letterSpacing: '0.05rem'}}
                        /> 
                        <InputField 
                            name="password"
                            label="Password"
                            type="password"
                            bg='rgb(232, 240, 254)'                               
                        />                              
                        <Flex justifyContent='center'>
                            <Button 
                                mt={8} 
                                type="submit" 
                                colorScheme="blue"
                                isLoading={isSubmitting}
                            >
                                login
                            </Button>
                            {/* <Flex mt={4} >
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
                            </Flex> */}
                        </Flex> 
                    </Form> 
            )}                    
        </Formik>    
    )};      