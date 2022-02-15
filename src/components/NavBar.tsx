import { Box, Container, Flex, Text } from "@chakra-ui/layout";
import React, { useEffect } from 'react';
import { MdEditCalendar, MdHome, MdLogin, MdLogout } from "react-icons/md";
import { modifyCacheUserIsOnline } from "../utils/cache";
import { isServer } from "../utils/isServer";
import { useMySubscriptions } from "../utils/useMySubscriptions";
import { useLogoutMutation, useLogWithValidTokenMutation, useMeQuery } from './../generated/graphql';
import { changeWsConnection } from './../utils/changeWsConnection';
import { isTokenExist } from './../utils/isTokenExist';
import { MyIconButton } from "./MyIconButton";

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
    const { data, loading } = useMeQuery({ 
        skip: isServer() || !isTokenExist(), 
        errorPolicy: 'all' 
    });

    const [logout,  { error: errorLogout }] =
        useLogoutMutation({ 
            errorPolicy: 'all',
            update: (cache, { data }) => {
                if (!data) return;
                cache.evict({ fieldName: 'me'});
                cache.evict({ fieldName: 'feed'});
                localStorage.removeItem('token');
                changeWsConnection();// change userId in ws context to null     
            }
        });

    const [logWithToken, { error: errorLogWithValidToken }] = 
        useLogWithValidTokenMutation({
            update: (_, { data }) => {
                if (!data) return;
                modifyCacheUserIsOnline({ lastTime: null, userId });
            },
            errorPolicy: 'all'
        });

    const isLogged = !!data?.me;
    const userId = data?.me.id;
    const lastTime = data?.me.lastTime;

// subscribe/unsubscr when user changed (or logout)    
    useMySubscriptions(userId);

    useEffect(() => {
        window.onbeforeunload = async () => {
            if (isLogged) await logout();
        }
    }, [isLogged]);
  
    useEffect(() => {
// token was valid & we connect w/o login, update db & publish 
        if (lastTime && isLogged) logWithToken();
    }, [lastTime, isLogged]); 
    
    if (loading) return <div>me fetching ...</div>
    if (errorLogWithValidToken) return <div>error log with old token</div>
    if (errorLogout) return <div>error logout</div>

    return (
        <Flex zIndex={1} position="sticky" top={0} p={4}>
             <Box
                mt={-4}            
                p={5}
                shadow="md"
                borderWidth="1px"
                flex="1" 
                bg="gray.200"            
            >
                <Container  maxW="1000px" >  
                    <Flex mx="auto" alignItems="center">
                        <MyIconButton
                            name='all posts'  
                            icon={<MdHome />}
                        />                                 
                        {isLogged  
                            ? (<>                          
                            <MyIconButton
                                name='createPost'  
                                icon={<MdEditCalendar />}
                            />
                           <Text  
                                ml="auto"
                                mr={6} 
                                fontSize="lg" 
                                as="u" 
                                fontWeight="medium"
                            >
                               {data!.me.name}
                            </Text> 
                            <MyIconButton
                                name='logout'
                                icon={<MdLogout />}                                                              
                                onClick={() => logout()}   
                            /> </>)      
                            :  
                            <MyIconButton
                                name='login'  
                                icon={<MdLogin />}
                                ml="auto" 
                            />
                        }    
                    </Flex>
                </Container>
            </Box>
        </Flex>
    );   
}

