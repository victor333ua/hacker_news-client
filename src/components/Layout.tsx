import { Container } from '@chakra-ui/react';
import React from 'react'

interface LayoutProps {}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
        return (
            <Container height="100vh" maxWidth="container.md" my={8}>
                    {children}
            </Container>        
        );
}