import { useApolloClient } from "@apollo/client";
import { Box, Container, Flex, Text } from "@chakra-ui/layout";
import { useRouter } from "next/router";
import React from 'react';
import { MdEditCalendar, MdHome, MdLogin, MdLogout } from "react-icons/md";
import { modifyCacheUserIsOnline } from "../utils/cache";
import { changeAuth } from '../utils/changeAuth';
import { useMySubscriptions } from "../utils/useMySubscriptions";
import { useLogoutMutation, useLogWithValidTokenMutation, useMeQuery } from './../generated/graphql';
import { MyIconButton } from "./MyIconButton";


export const NavBar: React.FC = (props: any) => {
    const client = useApolloClient();
    const router = useRouter();

    // const [, forceUpdate] = useState(0);
    // useEffect(() =>  forceUpdate(x => x + 1 ), [props.apolloState]);
   
    const { data, loading } = useMeQuery({ 
        errorPolicy: 'all',
    });

    const [logout,  { data: logoutData, error: errorLogout, loading: lodingLogout }] =
        useLogoutMutation({ 
            errorPolicy: 'all',
            update: (cache, { data }) => {
                if (!data) return;                  
                localStorage.removeItem('token');
                document.cookie = "token=; max-age=-1";

                // change auth in request headers, here only for web socket
                changeAuth(client);

                // client.clearStore()
                //     .then(() => {
                //         router.push('/', undefined, { shallow: false });
                //     }) 
                // client.resetStore(); 
                cache.evict({ fieldName: 'me' });
                cache.evict({ id: 'ROOT_QUERY', fieldName: 'feed' });
                cache.gc();      
            }
        });

    const [logWithToken, { error: errorLogWithValidToken }] = 
        useLogWithValidTokenMutation({
            update: (cache, { data }) => {
                if (!data) return;
                modifyCacheUserIsOnline(cache, { lastTime: null, userId });
            },
            errorPolicy: 'all'
        });

    const isLogged = !!data?.me;
    const userId = data?.me.id;
    const lastTime = data?.me.lastTime;

    // useEffect(() => {
    //     window.onbeforeunload = async () => {
    //         if (isLogged) await logout();
    //     }
    // }, [isLogged, logout]);
  
//     useEffect(() => {
// // token was valid & we connect w/o login, update db & publish 
//         if (lastTime && isLogged) logWithToken();
//     }, [lastTime, isLogged, logWithToken]);
    
// subscribe/unsubscr when user changed (or logout)    
    useMySubscriptions(userId, client);
    
    if (loading || lodingLogout) return <div>me fetching ...</div>;
    if (errorLogWithValidToken) return <div>error log with old token</div>;
    if (errorLogout) return <div>error logout</div>;

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
                                onClick={ async (e) => {
                                    e.preventDefault();
                                    await logout();
                                }}
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

