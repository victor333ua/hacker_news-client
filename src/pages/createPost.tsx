import { Box, Button, Container, Flex, IconButton, Textarea, useDisclosure, Image } from '@chakra-ui/react';
import { useRouter } from "next/router";
import React, { useRef, useState } from 'react';
import { modifyCacheAddPost } from '../utils/cache';
import { useCreatePostMutation, useImgurQuery } from './../generated/graphql';
import { useIsAuth } from './../utils/useIsAuth';
import withApollo from '../apolloClient';
import { NextPage } from 'next';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { FcAddImage, FcStart }  from 'react-icons/fc';
import { SelectFileDragNDrop } from '../components/selectFileDragNDrop';
import { SelectMusic } from '../components/selectMusic';
import { uploadImage } from '../services/imageService';
import { SelectMapPlace } from '../components/selectMapPlace';

const CreatePost: NextPage = () => {
    const router = useRouter();

// get Imgur Data from my server
    const { data: imgurData, loading: imgurLoading, error: imgurError } = useImgurQuery();
    
    const [createPost] = useCreatePostMutation({ errorPolicy: 'all' });

    const [isPhoto, setPhoto] = useState(false);
    const refToSelectedFile = useRef<File | null>(null);
    const [musicUrl, setMusicUrl] = useState('');
    const [mapPlace, setMapPlace] = useState<{ lat: number, lng: number }>();
    const [description, setDescription] = useState('');
    const [isSubmitting, setSubmitting] = useState(false);
    const [imgurErr, setImgurError] = useState('');
    const { isOpen: isMusic, onOpen: onMusicOpen, onClose: onMusicClose } = useDisclosure();
    const { isOpen: isMap, onOpen: onMapOpen, onClose: onMapClose } = useDisclosure();

    useIsAuth();

    const onSavePost = async () => {
        let link, deletehash;
        if (refToSelectedFile.current) {
            if (!imgurData || imgurError) { setImgurError('no data for Imgur'); return; }
            ({ link, deletehash } = 
                await uploadImage(
                    refToSelectedFile.current as File, imgurData.imgur));
        }
        setSubmitting(true);
        const variables = {
            description,
            musicUrl,
            imageLink: link,
            deleteHash: deletehash,
            lng: mapPlace?.lng,
            lat: mapPlace?.lat
        };
        const { data, errors } = await createPost({
            variables,
            update: (cache, { data }) => {
                if (!data) return;
                modifyCacheAddPost(cache, data.createPost)
            }
        });
        setSubmitting(false);
        if (errors){
            console.log(errors) 
            setImgurError('error creating new post');
        }
        else if (data) 
            router.push("/");
    };

    return (
        <Container h='100vh' display='flex' justifyContent='center' flexDir='column'>
        <Container
            maxW="xl" 
            border='2px solid blue' p={5} borderRadius='md' 
            bgColor='white' 
        >
{/*---------------------------------------------------------------------------*/}
{/*------------------------------ header------------------------------------- */}

            <Flex justifyContent='center' flexDir='row' alignItems='center'>
                <Box flex='1' textAlign='center' fontSize='xl' fontWeight='bold'>
                    New Post
                </Box>
                <IconButton
                    ml='auto'
                    aria-label='close' 
                    variant='outline'
                    icon={<AiOutlineCloseCircle size='40'/>} 
                    onClick={() => router.push('/')} 
                />
            </Flex> 
            <Box 
                height='20px'
                borderBottom='1px solid black'
                mb={5}
            />
            
{/* --------------------------------------------------------------------------- */}
{/* --------------------Post's data to fill in--------------------------------- */}
            <Textarea 
                value={description}
                placeholder="... What's new ?"
                onChange={(e) => setDescription(e.target.value)}
            />
            {imgurErr && <Box color='red' mt={2}>{imgurErr}</Box> }                
            <br/>                
            { isPhoto && 
                <Box position='relative'  width='100%'  my='3' 
                    overflow='auto'
                >
                    <SelectFileDragNDrop 
                        refToFile={ refToSelectedFile}
                    />
                    <IconButton
                        position='absolute'
                        top='2px'
                        right='2px'
                        zIndex='10'
                        aria-label='close' 
                        variant='outline'
                        icon={<AiOutlineCloseCircle size='30' />}
                        backgroundColor='white' 
                        onClick={() => setPhoto(false)}
                    /> 
                </Box>
            }                
            { isMusic && 
                <SelectMusic 
                    onClose={onMusicClose} setMusicUrl={setMusicUrl}
                />
            } 
            { musicUrl &&
                <Box position='relative'  width='100%'  my='5px' 
                    overflow='auto' maxH='md'
                > 
                    <div dangerouslySetInnerHTML={{ __html: musicUrl }} />
                    <IconButton
                        position='absolute'
                        bottom='2px'
                        right='2px'
                        zIndex='10'
                        aria-label='close' 
                        variant='outline'
                        icon={<AiOutlineCloseCircle size='30' />}
                        backgroundColor='white' 
                        onClick={() => setMusicUrl('')}
                    /> 
                </Box>
            } 
            { isMap && 
                <SelectMapPlace onClose={onMapClose} setPlace={setMapPlace} />
            }                                           
 {/* ------------------------------------------------------------------------------ */}
 {/* ------------------Supplement the post----------------------------------------- */}
            <Box
                 border='1px solid black'
                 borderRadius='md'
                 display='flex'
                 flexDir='row'
                 alignItems='center'
                 p='5px'
                 mt='5px'
             >
                 <Box  fontSize='md' fontWeight='semibold' mr={10} ml={3}>
                     Supplement the publication
                 </Box>
                 <IconButton
                     aria-label='addImage'
                     icon={<FcAddImage size='40'/>}
                     mr={3}
                     onClick={() => setPhoto(!isPhoto)}
                 />
                 <IconButton
                     aria-label='addMusic'
                     icon={<FcStart size='40px'/>}
                     onClick={onMusicOpen}
                     mr={3}
                 />
                 <Image
                    boxSize='30px' 
                    alt='Logo'
                    src='google-map.png'
                    mr='4px'
                    onClick={onMapOpen}
                 /> 
            </Box>                           
{/* ----------------------------------------------------------------------- */}
            <Button 
                 w='100%'
                 mt={8} 
                 colorScheme="blue"
                 isLoading={isSubmitting || imgurLoading}
                 onClick={onSavePost}
            >
                 create post        
            </Button>              
        </Container>
        </Container>
    );     
};
export default withApollo(CreatePost);
