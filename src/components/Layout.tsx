import { Container } from '@chakra-ui/react';
import React from 'react'

export const Layout: React.FC = ({ children }) => {
    return (
        <Container 
            maxWidth="container.md" 
            overflow='auto'
            mt='15px'
        >
            {children}
        </Container>        
    );
}