import { Container } from '@chakra-ui/react';
import React from 'react'
import { NavBar } from './NavBar';

interface LayoutProps {

}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
        return (
            <>
                <NavBar />
                <Container height="100vh" maxWidth="container.md" my={8}>
                    {children}
                </Container>
            </>
        );
}