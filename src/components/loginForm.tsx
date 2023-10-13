import { useApolloClient } from '@apollo/client';
import { Button, Flex } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/router';
import { InputField } from './inputField';
import { afterLogin } from './../utils/afterLogin';
import { useLoginMutation } from './../generated/graphql';
import * as Yup from 'yup';
import React from 'react';

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
                });
                if (data) { 
                    afterLogin(client, data.login);
                    router.push('/');
                } else if (errors){
                    const err = errors[0].message;
                    if (err) {
                        try {
                            const msg = JSON.parse(err);
                            setErrors(msg);
                        } catch(error: any) {
                            setErrors({ email: err });
                        }
                    }

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
                        </Flex> 
                    </Form> 
            )}                    
        </Formik>    
    )};      