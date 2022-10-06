import { Box, Button, Container, Flex, Text } from '@chakra-ui/react';
import React, { useState } from 'react';
import { FaGithub, FaGoogle } from 'react-icons/fa';

 export const Oauth2Buttons = () => {
    
    const googleLogin = async () => {
        window.open(
            `http${process.env.NEXT_PUBLIC_API_URL}oauth2/google/login`,
            '_self');
     };
     
     const gitHubLogin = () => {
         window.open(
            `http${process.env.NEXT_PUBLIC_API_URL}oauth2/github/login`,
            '_self');
     };
   
    return (
    <Box>
        <Container m='30px 5px' pos='relative' h='fit-content' centerContent >
            <Box 
                w='fit-content'
                h='fit-content'
                borderRadius='50%'
                border='1px solid black' 
                p='5px'
                fontSize='xx-small'
                fontWeight='semibold'
                bg='white'
                zIndex={2}
            >
                OR
            </Box>
            <Box h='0.5px' bgColor='black' pos='absolute' top='50%' left='0' bottom='0' right='0' zIndex={1}/>
        </Container> 

        <Flex justifyContent='space-between'>
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
        </Flex>
    </Box>)
 }