import { MdLogin, MdLogout, MdEditCalendar, MdHome  } from "react-icons/md";
import React, { useEffect, useState } from 'react'
import { Box, Flex, Container, Text } from "@chakra-ui/layout";
import { useMeQuery, UserIsOnlineSubscription, useUserIsOnlineSubscription } from "../generated/graphql";
import { MyIconButton } from "./MyIconButton";
import { isServer } from "../utils/isServer";
import { changeWsConnection } from './../utils/changeWsConnection';
import { OnSubscriptionDataOptions } from '@apollo/client';
import { cache } from '../apolloClient';
import { modifyCacheDeletePost, modifyCacheUserIsOnline, modifyCacheVotePost } from '../utils/cache';
import { PostDeletedSubscription, PostVotedSubscription, usePostDeletedSubscription, usePostVotedSubscription, useLogoutMutation } from './../generated/graphql';

const onPostDeleted = 
    ({ subscriptionData }: OnSubscriptionDataOptions<PostDeletedSubscription>) => {
      if (!subscriptionData?.data) return;
      const { postId } = subscriptionData.data?.postDeleted;
      cache.evict({ id: `Link:${postId}`});
      modifyCacheDeletePost(postId);
    };
const onPostVoted = 
    ({ subscriptionData }: OnSubscriptionDataOptions<PostVotedSubscription>) => {
      if (!subscriptionData?.data) return;
      const { postId, value } = subscriptionData.data.postVoted;
      modifyCacheVotePost({ value, postId });
    };
const  onUserIsOnline =  
    ({ subscriptionData }: OnSubscriptionDataOptions<UserIsOnlineSubscription>) => {
        if (!subscriptionData?.data) return;
        const { userId, lastTime } = subscriptionData.data.userIsOnline;
        modifyCacheUserIsOnline({ lastTime, userId });
    };

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
    const { loading, data } = useMeQuery({ skip: isServer(), errorPolicy: 'all' });
    const [logout] = useLogoutMutation({ errorPolicy: 'all' });

    const [isLogged, setLogged] = useState(false);

    usePostDeletedSubscription({ 
        onSubscriptionData: onPostDeleted,
        // fetchPolicy:"cache-only"
       });
    usePostVotedSubscription({
         onSubscriptionData: onPostVoted,
      });
    useUserIsOnlineSubscription({
        onSubscriptionData: onUserIsOnline
    });

    useEffect(() => {
        // console.log('userId : ', data?.me.id);
        if (!loading && data?.me) {       
            cache.evict({ fieldName: 'feed' });
            setLogged(true);
            changeWsConnection();               
        };
    }, [loading, data])

    if (loading) return <div>...loading</div> ;

    const onLogout = async () => {
        const { errors } = await logout();
        if (!errors) {
            localStorage.removeItem('token');
            // cache.evict({ fieldName: 'feed' }); it's not necessary here
            cache.evict({ fieldName: 'me' });
            // await client.clearStore(); refetch queries with token???
            // await client.resetStore();
            changeWsConnection();
            setLogged(false);
        } else {
            console.log(errors);
        }
    };
    
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
                            <Text  ml="auto" mr={6} fontSize="lg" as="u" fontWeight="medium">{data?.me.name}</Text>
                            <MyIconButton
                                name='logout'
                                icon={<MdLogout />}                                                              
                                onClick={() => onLogout()}   
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