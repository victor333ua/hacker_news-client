import { useColorMode } from '@chakra-ui/system';
import React from 'react'
import { MeQuery, RegularPostFragment } from '../generated/graphql';
import { Box, Divider, Flex, Text } from '@chakra-ui/react';
import { format } from 'date-fns';
import { MyIconButton } from './MyIconButton';
import { MdDeleteOutline, MdOpenInFull, MdThumbDownOffAlt, MdThumbUpOffAlt } from 'react-icons/md';
import { useDeletePostMutation, useVoteMutation } from './../generated/graphql';
import { modifyCacheDeletePost } from '../utils/cache';

const bgColor = { light: 'gray.50', dark: 'gray.900' }
const color = { light: 'black', dark: 'white' }

interface postProps {
    post: RegularPostFragment,
    data: MeQuery | undefined
};

export const Post: React.FC<postProps> = ({ post, data }) => {
    const { colorMode } = useColorMode();

    const [deletePost] = useDeletePostMutation({
         variables: { postId: post.id },
         errorPolicy: 'all',
         update: (cache, { data }) => {
             if (!data) return;
             const postId = data.deletePost?.id;
             modifyCacheDeletePost(cache, postId);
         }
    });

    const [vote] = useVoteMutation();

    const onVote = (value: number) => {
        if (post.voteValue === value) return;
        vote({
            variables: {
                postId: post.id,
                value
            },
            update: (cache, data) => {
                if (!data) return;
                cache.modify({
                    id:  `Link:${post.id}`,
                    fields: {
                        voteValue() { return value },
                        votesUp(cached) {
                            if (post.voteValue === 1) return cached - 1;
                            return value === 1 ? cached + 1 : cached;
                        },
                        votesDown(cached) {
                            if (post.voteValue === -1) return cached - 1;
                            return value === -1 ? cached + 1 : cached;
                        }
                    }
                })
            }
        })
    };
    
    const isLogged = !!data?.me
    const isMyPost = data?.me?.id === post.postedBy.id;

    let lastTime = post.postedBy.lastTime;
    const isOnline = !lastTime;
    let textIsOnline: string, colorIsOnline: string;
    if (isOnline) {
        colorIsOnline = 'green';
        textIsOnline = 'online';
    } else {
        lastTime = format(new Date(parseInt(lastTime!)), 'dd MMM H:mm'); 
        colorIsOnline = 'red';
        textIsOnline = 'last time was at ' + lastTime;
    }
   
    const date = format(new Date(parseInt(post.createdAt)), 'dd MMM yyyy H:mm');
    const name = post.postedBy.email.split('@')[0];
    return (
        <Box 
          p={5}
          shadow="md"
          borderWidth="1px"
          flex="1"
          borderRadius="md"
          bg={bgColor[colorMode]}
          color={color[colorMode]}
        >
            <Text fontSize="sm" as="i">
                postedBy <b>{name}</b>  &nbsp; &nbsp;{date}
            </Text>
            <Flex alignItems="center" >
                <Text fontStyle="italic" fontSize="sm">
                    {textIsOnline}
                </Text>          
                <Box ml="2" mt="1" width="2" height="2" borderRadius="50%" bgColor={colorIsOnline} border={`1px solid ${colorIsOnline}`}/>               
            </Flex>
            <Text mt={4}>{post.description}</Text>
            <Divider my={2} borderColor="gray.700" />
            <Flex >
                <MyIconButton
                    name='extPost'  
                    icon={<MdOpenInFull />}
                    mr="auto"
                    size="xs"
                    onClick={()=>{}}
                />
                <Flex flexDirection="column" textAlign="center" >             
                    <MyIconButton
                        name='down'  
                        icon={<MdThumbDownOffAlt />}
                        mr="3"
                        size="xs"
                        color={post.voteValue === -1 ? "blue.500" : undefined}
                        onClick={() => onVote(-1)}
                        isDisabled={!isLogged}        
                    />
                    <Text fontSize="sm" as="i"  mr={3} >{post.votesDown}</Text>         
                </Flex>
                <Flex flexDirection="column" textAlign="center" >          
                    <MyIconButton
                        name='up'  
                        icon={<MdThumbUpOffAlt />}
                        mr="3"
                        size="xs"
                        color={post.voteValue === 1 ? "blue.600" : undefined}
                        onClick={()=> onVote(1)} 
                        isDisabled={!isLogged}                     
                    />
                    <Text fontSize="sm" as="i"  mr={3} >{post.votesUp}</Text> 
                </Flex>    
                {isMyPost && <MyIconButton
                    name='delete'
                    icon={<MdDeleteOutline/>}                       
                    mr="2"
                    size="xs"                                        
                    onClick={() => deletePost()}              
                />}                                                    
            </Flex>
        </Box>
    )
}            