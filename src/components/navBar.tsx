import { useApolloClient } from "@apollo/client";
import { Box, Flex, Image, useColorModeValue } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from 'react';
import { MdClose, MdEditCalendar, MdHome, MdLogin, MdLogout } from "react-icons/md";
import { modifyCacheUserIsOnline } from "../utils/cache";
import { changeAuth } from '../utils/changeAuth';
import { useMySubscriptions } from "../subscriptions/useMySubscriptions";
import { useLogoutMutation, useLogWithValidTokenMutation, useMeQuery } from '../generated/graphql';
import { MyIconButton } from "./myIconButton";
import { Profile } from "./profile";
import { Menu } from "../pages";

interface NavBarProps {
    setItem:  React.Dispatch<React.SetStateAction<Menu>>,
};

export const NavBar: React.FC< NavBarProps> = ({ setItem }) => {
    const client = useApolloClient();
    const router = useRouter();
    const [isProfileVisible, setProfileVisible] = useState(false);
    const bg = useColorModeValue('gray.70', 'gray.600');
    const iconsBg = useColorModeValue('gray.100', 'gray.500');

    const refLogout = useRef(false);

    const { data, loading } = useMeQuery();

    const [logout,  { error: errorLogout, loading: loadingLogout, data: dataLogout }] =
        useLogoutMutation({ 
            errorPolicy: 'all',
            // update: (cache, { data: dataLogout }) => {
            //     cache.evict({ id: 'ROOT_QUERY', fieldName: 'feed' });
            // }
        });

    useEffect(() => {
        if (!(dataLogout?.logout && refLogout.current)) return; 
        localStorage.removeItem('token');
        document.cookie = "token=; expires = Thu, 01 Jan 1970 00:00:00 GMT; path=/;";                
        changeAuth(client);  // change auth in request headers
        client.cache.evict({ fieldName: 'me' });
        client.cache.evict({ id: 'ROOT_QUERY', fieldName: 'feed' });
        router.reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dataLogout])

// will be the same during rerendering
    const isLogged = !!data?.me;
    const userId = data?.me?.id;
    const lastTime =  data?.me?.lastTime;

    useEffect(() => {
        window.onbeforeunload = async (e: BeforeUnloadEvent) => {
            if (isLogged) {
                refLogout.current = false;
                await logout();
                e.preventDefault();
            }
        };
        return () => {
            window.onbeforeunload = null;
        }
    },[isLogged, logout]);

    const [logWithToken, { error: errorLogWithValidToken }] = 
        useLogWithValidTokenMutation({
            errorPolicy: 'all'
        });

    useEffect(() => {
// token was valid & we connected w/o login => 
// update db lastTime=null & publish 'user is online' 
        if (lastTime && isLogged) {
            logWithToken(); // async
            modifyCacheUserIsOnline(client.cache, { lastTime: null, userId });
        }
    }, [isLogged, logWithToken, client.cache, userId, lastTime]);
    
// subscribe/unsubscr when auth has changed 
    useMySubscriptions(userId, client);

    return (
        <>
        {isProfileVisible && <Profile setProfileVisible={setProfileVisible}/>}
             <Box
                width='100%'
                // position="sticky" top='0px' 
                py='10px'
                px='25px'
                shadow="md"
                bg={bg} 
            >
                <Flex alignItems="center" justifyContent='space-between'>

                    <MyIconButton
                      bg={iconsBg}
                      name='all posts'  
                      icon={<MdHome />}
                      onClick={() => setItem(Menu.Posts)}
                    /> 
                    { loading &&  <Box textStyle='h3'>Fetching...</Box> }
                    { isLogged  
                    ? (<>                          
                        <MyIconButton
                            bg={iconsBg}
                            name='createPost'  
                            icon={<MdEditCalendar />}
                            mx='25px'
                            onClick={() => setItem(Menu.NewPost)}
                        />  
                        { loadingLogout &&  <Box textStyle='h3'>Fetching...</Box> }
                        { errorLogout &&  <Box textStyle='h3'>error logout</Box> } 
                        { errorLogWithValidToken && 
                            <Box textStyle='h3'>
                                {`error log with old token: ${errorLogWithValidToken!.message}`}
                            </Box> 
                        }     
                        <Box  
                            ml="auto"
                            mr={6} 
                        >
                            <Image 
                                src={data?.me?.imageLink as string} 
                                alt='avatar'
                                boxSize='40px' borderRadius='full'
                                objectFit='cover' 
                                objectPosition='top'
                                fallbackSrc='avatar-default.png'
                                onClick={() => setProfileVisible(true)}
                            />
                        </Box>
                        <MyIconButton
                            mr='10px' 
                            bg={iconsBg}
                            name='logout'
                            icon={<MdLogout />}                                                              
                            onClick={() => { 
                                refLogout.current = true;
                                logout();
                            }}
                        /> </>)      
                    :  
                        <MyIconButton
                            ml="auto"
                            mr='10px' 
                            bg={iconsBg}
                            name='login'  
                            icon={<MdLogin />}
                            onClick={() => router.push('/login')} 
                        />                   
                    }
                    {/* <MyIconButton
                        bg={iconsBg}
                        name='exit'  
                        icon={<MdClose />}
                        onClick={() => {
                            window.open("", "_self");
                            window.close();
                        }} 
                    />       */}
                </Flex>            
            </Box>
        </>
    );   
}

