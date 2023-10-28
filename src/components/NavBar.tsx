import { useApolloClient } from "@apollo/client";
import { Box, Flex, Image, useColorModeValue } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from 'react';
import { MdEditCalendar, MdHome, MdLogin, MdLogout } from "react-icons/md";
import { modifyCacheUserIsOnline } from "../utils/cache";
import { changeAuth } from '../utils/changeAuth';
import { useMySubscriptions } from "../subscriptions/useMySubscriptions";
import { useLogoutMutation, useLogWithValidTokenMutation, useMeQuery } from '../generated/graphql';
import { MyIconButton } from "./myIconButton";
import { Profile } from "./profile";
import { Menu } from "../pages";

interface NavBarProps {
    setItem:  React.Dispatch<React.SetStateAction<Menu>>
};

export const NavBar: React.FC< NavBarProps> = ({setItem}) => {
    const client = useApolloClient();
    const router = useRouter();
    const [isProfileVisible, setProfileVisible] = useState(false);
    const bg = useColorModeValue('gray.70', 'gray.600');
    const iconsBg = useColorModeValue('gray.100', 'gray.500');

    const { data, loading } = useMeQuery();

    const [logout,  { error: errorLogout, loading: lodingLogout }] =
        useLogoutMutation({ 
            errorPolicy: 'all',
            update: (cache, { data }) => {
                if (!data?.logout) return; 

                localStorage.removeItem('token');
                document.cookie = "token=; expires = Thu, 01 Jan 1970 00:00:00 GMT; path=/;";                
                 
                // change auth in request headers
                changeAuth(client);

                cache.evict({ fieldName: 'me' });
                cache.evict({ id: 'ROOT_QUERY', fieldName: 'feed' });
                cache.gc();
                
                router.replace('/');// re-mount component in withApollo

                // don't work - current allPosts page don't updated, 'cause
                // MeQuery do not renew data in the page
                // router.reload(); // ssr
                // client.clearStore() 
                //     .then(() => {
                //         // router.push('/', undefined, { shallow: false });
                //     }) 
                // client.resetStore(); // refetch all queries  
            }
        });
 
    // const [logWithToken, { error: errorLogWithValidToken }] = 
    //     useLogWithValidTokenMutation({
    //         // in this case rerender will happen only after reply from the backend
    //         // update: (cache, { data }) => {
    //         //     if (!data) return;
    //         //     modifyCacheUserIsOnline(cache, { lastTime: null, userId });
    //         // },
    //         errorPolicy: 'all'
    //     });

    const isLogged = !!data?.me;
    const userId = data?.me?.id;
    // const lastTime = data?.me?.lastTime;

    // const out = (e: Event) => {
    //     if (document.visibilityState == 'hidden') {
    //         console.log('handler');
    //         logout();
    //     }
    // };
    // const cb = useRef(out);
    // useEffect(() => {
    //     cb.current = out;
    // });


    useEffect(() => {
        window.onbeforeunload = (e: BeforeUnloadEvent) => {
            if (isLogged) logout();
            // e.preventDefault();
        };
        return () => {
            window.onbeforeunload = null;
        }
        // if (isLogged) {
        //     console.log('addListener');
        //     const fn = cb.current;
        //     document.addEventListener('visibilitychange', fn);
        //     return () => {
        //         // alert('removeListener');
        //         document.removeEventListener('visibilitychange', fn);
        //     }
        // }
    },[isLogged, logout]);
    
//     useEffect(() => {
// // token was valid & we connected w/o login => 
// // update db lastTime=null & publish 'user is online' 
//         if (lastTime && isLogged) {
//             logWithToken(); // async
//             modifyCacheUserIsOnline(client.cache, { lastTime: null, userId });
//         }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [lastTime, isLogged]);
    
// subscribe/unsubscr when auth has changed 
    useMySubscriptions(userId, client);
    
        if (loading || lodingLogout) return <div>me fetching ...</div>;
        // if (errorLogWithValidToken) return (
        //     <div>`error log with old token: ${errorLogWithValidToken!.message}`</div>
        // );
        if (errorLogout) return <div>error logout</div>;

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
                    {isLogged  
                    ? (<>                          
                        <MyIconButton
                            bg={iconsBg}
                            name='createPost'  
                            icon={<MdEditCalendar />}
                            ml='25px'
                            onClick={() => setItem(Menu.NewPost)}
                        />          
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
                            bg={iconsBg}
                            name='logout'
                            icon={<MdLogout />}                                                              
                            onClick={() => {
                                logout();
                            }}
                        /> </>)      
                    :  
                        <MyIconButton
                            bg={iconsBg}
                            name='login'  
                            icon={<MdLogin />}
                            onClick={() => router.push('/login')} 
                        />                   
                    }    
                </Flex>            
            </Box>
        </>
    );   
}

