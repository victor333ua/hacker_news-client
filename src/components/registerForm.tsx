import { Flex } from '@chakra-ui/layout';
import { Button } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import router from 'next/router';
import React from 'react'
import { InputField } from './inputField';
import {useSignupMutation } from './../generated/graphql';
import * as Yup from 'yup';
import { useApolloClient } from '@apollo/client';
import { afterLogin } from './../utils/afterLogin';

export const RegisterForm = () => {
    const client = useApolloClient();
    const [signup] = useSignupMutation({ errorPolicy: 'all'});
    return (
        <Formik
            initialValues={{ email: "", password: "", password2: "" }}
            validationSchema={Yup.object({
                password: Yup.string()
                    .min(3, 'Must be 3 characters or more')
                    .max(6, 'Must be 6 characters or less')
                    .required('Required'),
                email: Yup.string()
                    .email('Invalid email')
                    .required('Required'),
                password2: Yup.string()
                    .required('Required')
                    .oneOf([Yup.ref('password')], 'passwords do not match')
            })}
            onSubmit={async (values, { setErrors }) => {
                const { data, errors } = await signup({
                    variables: values,
                }); 
                if (data) { 
                    afterLogin(client, data.signup);
                    router.push('/');                                     
                } else if (errors) {
                    const err = errors[0].message;
                    if (typeof err === 'string')
                        setErrors({ email: err });
                    else 
                        setErrors(JSON.parse(err));
                } 
            }}   
        >
            {({ isSubmitting }) => (
            <Form>
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
                    mb={4}
                /> 
                <InputField 
                    name="password2"
                    label="Confirm password"
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
                        register
                    </Button>
                </Flex>
            </Form>                        
            )}
        </Formik>
    );
};

