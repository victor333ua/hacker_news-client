import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';
// import NotSSRLoginComponent from '../components/loginComponent'

const NotSSRLoginComponent = dynamic(
    () => import('../components/loginComponent'),
    { ssr: false }
);

const Login: NextPage = () => {
    return <NotSSRLoginComponent />
};

export default Login;
