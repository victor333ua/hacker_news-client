import { useApolloClient } from "@apollo/client";
import { Box, Container, Flex, Image, Button } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from 'react';
import { MdEditCalendar, MdHome, MdLogin, MdLogout } from "react-icons/md";
import { modifyCacheUserIsOnline } from "../utils/cache";
import { changeAuth } from '../utils/changeAuth';
import { useMySubscriptions } from "../utils/useMySubscriptions";
import { useLogoutMutation, useLogWithValidTokenMutation, useMeQuery } from './../generated/graphql';
import { MyIconButton } from "./MyIconButton";
import { Profile } from "./profile";


export const NavBar: React.FC = () => {
    const client = useApolloClient();
    const router = useRouter();
    const [isProfileVisible, setProfileVisible] = useState(false);

    const { data, loading } = useMeQuery();

    const [logout,  { data: logoutData, error: errorLogout, loading: lodingLogout }] =
        useLogoutMutation({ 
            errorPolicy: 'all',
            update: (cache, { data }) => {
                if (!data) return;                  
                localStorage.removeItem('token');
                document.cookie = "token=; expires = Thu, 01 Jan 1970 00:00:00 GMT; path=/;";

                // change auth in request headers
                changeAuth(client);

                cache.evict({ fieldName: 'me' });
                cache.evict({ id: 'ROOT_QUERY', fieldName: 'feed' });
                cache.gc(); 

                // router.reload(); // ssr
                router.replace('/');// re-mount component in withApollo
                 
                // client.clearStore() // don't work
                //     .then(() => {
                //         // router.push('/', undefined, { shallow: false });
                //     }) 
                // client.resetStore(); // refetch all queries  
            }
        });
 
    const [logWithToken, { error: errorLogWithValidToken }] = 
        useLogWithValidTokenMutation({
            // in this case rerender will happen only after reply from the backend
            // update: (cache, { data }) => {
            //     if (!data) return;
            //     modifyCacheUserIsOnline(cache, { lastTime: null, userId });
            // },
            errorPolicy: 'all'
        });

    const isLogged = !!data?.me;
    const userId = data?.me.id;
    const lastTime = data?.me.lastTime;

    useEffect(() => {
        window.onbeforeunload = () => {
            if (isLogged) logout();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[isLogged]);
    
    useEffect(() => {
// token was valid & we connected w/o login => 
// update db & publish 'user is online' 
        if (lastTime && isLogged) {
            logWithToken();
            modifyCacheUserIsOnline(client.cache, { lastTime: null, userId });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lastTime, isLogged]);
    
// subscribe/unsubscr when auth has changed 
    // console.log(`userId=${userId}`);   
    useMySubscriptions(userId, client);
    
    if (loading || lodingLogout) return <div>me fetching ...</div>;
    if (errorLogWithValidToken) return <div>error log with old token</div>;
    if (errorLogout) return <div>error logout</div>;

    return (
        <>
        {isProfileVisible && <Profile setProfileVisible={setProfileVisible}/>}
        <Flex zIndex={1} position="sticky" top={0} p={4}>
             <Box
                mt={-4}            
                p={5}
                shadow="md"
                borderWidth="1px"
                flex="1" 
                bg="gray.200"            
            >
                <Container  maxW='full' >  
                    <Flex mx="auto" alignItems="center">
                        <MyIconButton
                            name='all posts'  
                            icon={<MdHome />}
                            onClick={() => router.push('/')}
                        />                                 
                        {isLogged  
                            ? (<>                          
                            <MyIconButton
                                name='createPost'  
                                icon={<MdEditCalendar />}
                                onClick={() => router.push('/createPost')}
                            />
                            <Box display='flex' flexDirection='row' 
                                 ml="auto"
                                 mr={6} 
                            >
                                <Image src={data.me.imageLink as string} alt='avatar'
                                        boxSize='40px' borderRadius='full'
                                        objectFit='cover' 
                                        objectPosition='top'
                                        fallbackSrc='avatar-default.png'
                                />
                                <Button 
                                    variant='link'
                                    ml={2}
                                    _focus={{}} 
                                    fontSize="lg" 
                                    fontWeight="medium"
                                    bg="gray.200"
                                    color='black'
                                    onClick={() => setProfileVisible(true)}
                                >
                                    {data!.me.name}
                                </Button> 
                            </Box>
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
                                onClick={() => router.push('/login')} 
                            />
                        }    
                    </Flex>
                </Container>
            </Box>
        </Flex>
        </>
    );   
}

