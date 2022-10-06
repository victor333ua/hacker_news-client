import { ExternalLinkIcon } from '@chakra-ui/icons';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    Input,
    Image,
    Link,
    HStack,
    Text,
  } from '@chakra-ui/react'
import React, { FC } from 'react'

type InputProps = {
    onClose: () => void,
    setMusicUrl: React.Dispatch<React.SetStateAction<string>>
  };
  
export const SelectMusic: FC<InputProps> = ({ onClose, setMusicUrl }) => {
    const [value, setValue] = React.useState('');
    const handleChange = (event) => setValue(event.target.value);
    const onClick = () => {
        let url = value;
// modify url for youtube music
        if (value.indexOf('<iframe') === -1) {
            const src = value
                .replace('watch?v=','embed/')
                .replace('&feature=share', '')
                .replace('https://music.', 'https://');

            url = `<iframe src=${src} width="100%" height="400px" frameBorder="0"
             allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media;
             fullscreen; picture-in-picture" loading="lazy"></iframe>` 
        }
        setMusicUrl(url);
        onClose();
    };

    const selectMusicArr = [
        { 
            name: 'Internet Archive',  
            src: 'https://cdn.cdnlogo.com/logos/i/73/internet-archive.svg',
            href: 'https://archive.org/search.php?query=music',
            text: 'Select the song, push the Share button, copy text from Embed article '
        },
        {   
            name: 'SoundCloud',  
            src: 'soundcloud_icon.png',
            href: 'https://soundcloud.com/',
            text: `Select the song, push the ..., select Share, then Embed tab
                   and copy text from Code window`
        },
        {   
            name: 'Spotify',  
            src: 'icons8-spotify-48.png',
            href: 'https://open.spotify.com/',
            text: `Select the song, push the ..., select Share, Emded track
                   and Copy` 
        },
        {   
            name: 'YouTube Music',  
            src: 'icons8-youtube-music-48.png',
            href: 'https://music.youtube.com/',
            text: 'Select the song, push the ..., select Share and push Copy'
        }
    ];

    return (
        <Modal isOpen onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Select your favourite song</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    { selectMusicArr.map((elem, i) => 
                        <div key={10*i}>
                            <HStack>
                                <Image
                                    boxSize='48px' 
                                    alt='Logo'
                                    src={elem.src}
                                    borderRadius='full'
                                    mr='4px'
                                />
                                <Link 
                                    href={elem.href}
                                    isExternal 
                                    color='blue'
                                >
                                {elem.name} <ExternalLinkIcon mx='4px' />
                                </Link>
                            </HStack>
                            <Text ml='60px' mr='5px' mb='15px'>
                                {elem.text}
                            </Text>
                        </div>
                    )}
                </ModalBody>
                <ModalFooter>
                    <Input
                        value={value}
                        onChange={handleChange}
                        placeholder='Enter copied music url'
                        mr={5}
                    />
                    <Button colorScheme='blue' onClick={onClick}>
                        OK
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}