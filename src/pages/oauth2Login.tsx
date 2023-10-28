import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

const NotSSRoauth2LoginComponent = dynamic(
    () => import('../components/oauth2LoginComponent'),
    { ssr: false }
);
const Oauth2Login: NextPage = () => {
    return <NotSSRoauth2LoginComponent />
}

export default Oauth2Login;