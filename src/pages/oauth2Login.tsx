import { useApolloClient } from "@apollo/client";
import { Box, Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from "@chakra-ui/react";
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from "react";
import withApollo from '../apolloClient';
import { afterLogin } from "../utils/afterLogin";

const Oauth2Login: NextPage = () => {
    const client = useApolloClient();
    const router = useRouter();
    const { onClose } = useDisclosure();

    let token = '';
    useEffect(() => {
        // Cookies.remove('tokenOauth');
        if (token && router.isReady) {
            afterLogin(client, token, router);
            // console.log(router);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[token, router]);

// on server side & on client during hydration nothing to render
    // const hasMounted = useHasMounted();
    // if (!hasMounted) return null;
    
    if (!router.isReady) return null;
    
    const { error } = router.query;
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
   
    token = router.query.token as string;    
    // token = Cookies.get('tokenOauth'); // from backend
    return null;
}
export default withApollo(Oauth2Login);
