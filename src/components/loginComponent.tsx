import { Box, Button, Container, Flex } from '@chakra-ui/react';
import React, { useEffect, useRef, useState } from 'react';
import { LoginForm } from './loginForm';
import { Oauth2Buttons } from './oauth2Buttons';
import { RegisterForm } from './registerForm';
import styles from './login.module.css';
import { Image } from '@chakra-ui/react';
import { isServer } from '../utils/isServer';

const loginButtonStyles = {
    w:'130px', borderBottom:'1px solid', fontWeight:'semibold',
    borderRadius:'none', bg:'white',
    _hover: { bg: 'white' },
    _focus: { border: 'none'},
    _active: {  bg:'white' },
    position:'relative',
}

const LoginComponent: React.FC = () => {

    const isFirstRenderRef = useRef<boolean>(true);
    const [isLogin, setLogin] = useState(true);
    useEffect(() => { isFirstRenderRef.current = false },[]);

    const BgImage = ({ isAnimate }) => {
        return (
            <Box w='inherit' h='inherit' position='absolute' zIndex={-1}>
                <Image src='Ukraine-Flag.png' alt='bg' 
                        className={isAnimate ? styles.bg : ''} />
            </Box>
        )
    };

    if (isServer()) console.log('Login on server');
           
    return (
        <Container  w='100%' maxH='100vh' p={1} centerContent>
            <BgImage isAnimate={!isFirstRenderRef.current} />
            <Container
                 maxW="300px" mt='15%'
                 border='2px solid blue' p='20px' borderRadius='md' 
                 bgColor='white' 
            >
                <Flex direction='row' justifyContent='space-around' >
                    <Button 
                        sx={loginButtonStyles}  
                        // onClick={() => router.push({ hash: 'log' })}
                        onClick={() => setLogin(true)}
                    >  
                        login
                        <div className={ isLogin ? 
                            [styles.underline, !isFirstRenderRef.current ? styles.animLeft : ''].join(' ')  : '' } />
                        {/* eslint-disable-next-line react/no-unknown-property */}
                        <style jsx>{`
                        `}</style>
                    </Button>
                    <Button 
                        sx={loginButtonStyles}  
                        onClick={() => setLogin(false)}
                    >
                        register
                        <div className={ !isLogin ? 
                            [styles.underline, !isFirstRenderRef.current ? styles.animRight : ''].join(' ') : ''} /> 
                    </Button>                        
                </Flex>
                <Box mt={8}> 
                    { isLogin ? <LoginForm /> : <RegisterForm /> } 
                    <Oauth2Buttons />  
                </Box>     
            </Container>
        </Container>
    ) 
};
export default LoginComponent