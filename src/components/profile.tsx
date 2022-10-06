import React, { createRef, FC, Ref, useEffect, useRef, useState } from "react";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Button,
    Flex,
    Text,
    Image,
    Container,
    Box,
  } from '@chakra-ui/react';
import { useMeQuery } from "../generated/graphql";
import { useImgurQuery } from '../generated/graphql';
import { deleteImage, uploadImage } from '../services/imageService'
import { useApolloClient } from "@apollo/client";
import { modifyCacheChangeAvatar } from "../utils/cache";
import { useChangeAvatarMutation } from './../generated/graphql';
import { SelectFile } from "./selectFile";

type InputProps = {
    setProfileVisible: React.Dispatch<React.SetStateAction<boolean>>
};

export const Profile: FC<InputProps> = ({setProfileVisible}: InputProps) => {

  const { onClose } = useDisclosure();
  const onCloseModal = () => {
    if(loading) return;
    onClose();
    setProfileVisible(false);
  };

  const client = useApolloClient();

  const refToSelectedFile = useRef<File | null>(null);
  const [srcFile, setFileSrc] = useState('avatar-default.png');
  const hiddenInputRef: Ref<HTMLInputElement> = createRef();

  const [loading, setLoading] = useState(false);
  const [errorAvatar, setErrorAvatar] = useState('');

  const { data } = useMeQuery();
  const imageLink = data?.me.imageLink;
  useEffect(() => {
    if (imageLink) setFileSrc(imageLink);
  },[imageLink])
 
  const [changeAvatar] = useChangeAvatarMutation();

  // get Imgur Data from my server
  const { data: imgurData, loading: imgurLoading, error: imgurError } = useImgurQuery();
  if (imgurLoading) return <div>imgur fetching</div>;
  if (imgurError) return <div> imgur error</div>;

  const onSave = async () => {
    if (!imgurData) { setErrorAvatar('no data for imgur'); return; }
    setLoading(true);

    try {
      if (imageLink) await deleteImage(
        { link: imageLink, deletehash: data.me.deletehash as string },
        imgurData.imgur
      ); 
      const { link, deletehash } = 
        await uploadImage(refToSelectedFile.current as File, imgurData.imgur);

      const res = modifyCacheChangeAvatar({
          cache: client.cache, userId: data!.me.id, link, deletehash
        });
      if (!res) throw new Error('error modifying cache');

      const { errors } = await changeAvatar({
        variables: { imageLink: link, deletehash }
      });
      if (errors) throw new Error(errors[0].message);
      
    } catch(err) {
        setErrorAvatar(`${err.message}`);
    } finally {
        setLoading(false);
    }
  }

  return (
    <>
      <Modal isOpen={true} onClose={onCloseModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize='2xl' fontWeight='bold'>Edit Profile</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
              <Container borderWidth='1px' >
                <Flex justifyContent='space-between' alignItems='center'>
                    <Text fontSize='xl' fontWeight='semibold' >
                        {"Profile's Photo"}
                    </Text>
                    <Button 
                        variant='link' _focus={{}}  
                        color='blue' fontStyle='italic' bg='white'
                        onClick={() => hiddenInputRef.current?.click()}
                    >
                        Change
                    </Button>
                    <SelectFile 
                      ref={hiddenInputRef}
                      setFileSrc={setFileSrc} 
                      refToFile={refToSelectedFile}
                    />
                </Flex>
                <Flex justifyContent='center' direction='column'>           
                    <Image  m={3} boxSize='200px' src={srcFile}
                            objectFit='contain' alt='Photo' 
                            fallbackSrc='200.png'
                    /> 
                    {errorAvatar && <Box color='red' mt={2}>{errorAvatar}</Box> }                
                </Flex>
              </Container>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onCloseModal}>
              Close
            </Button>
            <Button colorScheme='blue' onClick={onSave} isLoading={loading}>
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
