import React, { FC } from "react";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Text,
    Container,
    Box,
    Image,
    Flex,
    useColorModeValue
  } from '@chakra-ui/react';
import { PostVotesFragment } from "../generated/graphql";
import { GoogleMapBase } from "./googleMapBase";
import { Marker } from "./googleMarker";
import { format } from "date-fns";

type InputProps = {
  onClose: () => void,
  post: PostVotesFragment,
};

export const ExtPost: FC<InputProps> = ({ onClose, post }) => {
  const bg = useColorModeValue('gray.50', 'gray.600');
  const color = useColorModeValue('black', 'white');

  const musicUrl = post.musicUrl ;
  const imageSrc = post.imageLink ?? undefined;
  const avatarSrc = post.postedBy.imageLink ?? undefined;

  let latLngPlace: google.maps.LatLngLiteral | undefined;
  if (post.lat && post.lng) latLngPlace = { lat: post.lat, lng: post.lng };

  return (
      <Modal isOpen onClose={onClose} >
        <ModalOverlay />
        <ModalContent maxW='2xl' bg={bg} color={color}>
          <ModalHeader>
            <Flex alignItems='center'>
              <Image  m={3} boxSize='3rem' src={avatarSrc}
                      objectFit='contain' alt='Photo' 
                      fallbackSrc='200.png'
              /> 
              <Box>
                <Text fontWeight='semibold' fontSize='md' >
                    {post.postedBy.email.split('@')[0]}
                </Text>
                <Text fontWeight='thin' fontSize='sm'>
                  {format(new Date(parseInt(post.createdAt)), 'dd MMM yyyy H:mm')}
                </Text>
              </Box>
            </Flex>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
              <Container w='xl' >
                <Text fontWeight='normal' fontSize='md' w='100%' mb='10px'>
                  {post.description}
                </Text>
                { musicUrl && 
                  <Box width='100%' maxH='md' overflow='auto'>
                    <div dangerouslySetInnerHTML={{ __html: musicUrl }} style={{maxWidth:'xl'}}/>
                  </Box>
                }
                { imageSrc &&
                  <Box width='100%' my='6px' border='1px' borderRadius='md'>
                      <Image 
                        src={imageSrc} alt='image'
                        fit='contain' 
                      />
                  </Box>
                }
                { latLngPlace &&
                  <Box width='100%' my='6px'>
                    <GoogleMapBase 
                      style={{ width: '100%', height: '300px'}}
                      center={latLngPlace}
                      zoom={10}
                      libraries={['places']}
                    >
                      <Marker position={latLngPlace} />
                    </GoogleMapBase>
                  </Box>
                }
              </Container>
          </ModalBody>
          <ModalFooter>
          </ModalFooter>
        </ModalContent>
      </Modal>
  )
}