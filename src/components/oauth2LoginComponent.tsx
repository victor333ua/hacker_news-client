import { useApolloClient } from "@apollo/client";
import { Box, Button, Flex, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useColorModeValue, useDisclosure } from "@chakra-ui/react";
import { useRouter } from 'next/router';
import React, {useEffect } from "react";
import { afterLogin } from "../utils/afterLogin";
import { isServer } from "../utils/isServer";

const Oauth2LoginComponent: React.FC = () => {
  const bg = useColorModeValue('gray.70', 'gray.600');
  const color = useColorModeValue('black', 'white');

    const client = useApolloClient();
    const router = useRouter();
    const { onClose } = useDisclosure();

    useEffect(() => {
      if (!router.isReady) return;
    }, [router?.isReady]);

    if (!router?.query) return null;
    const { token, error } = router.query;
    
    if (isServer()) return null;
    
    if (token) {
      afterLogin(client, { token: token as string, user: undefined });
      router.push('/');
    }
    if (error) {
        return (
          <Box>
            <Modal isOpen={true} onClose={onClose}>
              <ModalOverlay />
              <ModalContent bg={bg} color={color}>
                <ModalHeader>Authorization Error</ModalHeader>
                {/* <ModalCloseButton /> */}
                <ModalBody>
                  {error}
                </ModalBody>      
                <ModalFooter>
                  <Button 
                    colorScheme='blue' 
                    mr={3} 
                    onClick={ () => { onClose(); router.push('/login') }}
                  >
                    Login
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </Box>
        );
    }
    return null;
};
export default Oauth2LoginComponent
