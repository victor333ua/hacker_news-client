import { useApolloClient } from "@apollo/client";
import { Box, Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from "@chakra-ui/react";
import { useRouter } from 'next/router';
import React from "react";
import { afterLogin } from "../utils/afterLogin";
import { isServer } from "../utils/isServer";

const Oauth2Login: React.FC = () => {
    const client = useApolloClient();
    const router = useRouter();
    const { onClose } = useDisclosure();
    
    if (isServer() || !router.isReady) return null;
    
    const { error, token } = router.query;
    if (token) {
      afterLogin(client, { token: token as string, user: undefined });
    }
    if (error) {
        return (
          <Box>
            <Modal isOpen={true} onClose={onClose}>
              <ModalOverlay />
              <ModalContent>
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
export default Oauth2Login
