import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
  } from '@chakra-ui/react'
import React, { FC, useState } from 'react'
import { GoogleMapBase } from "./googleMapBase";
import { Marker } from "./googleMarker";
import { AutoComplete } from './googleAutoComplete';

const latLngKyiv = { lat: 50.45116111387887, lng: 30.37778728402943 };

type InputProps = {
    onClose: () => void,
    setPlace: React.Dispatch<React.SetStateAction<any>>
  };
  
export const SelectMapPlace: FC<InputProps> = ({ onClose, setPlace }) => {
    const onSave = () => {
        setPlace(position);
        onClose();
    }
    const [position, setPosition] = useState<google.maps.LatLngLiteral>(latLngKyiv);
    const [zoom, setZoom] = useState(10);

    const onClick = (e: google.maps.MapMouseEvent) => {
        const cord: google.maps.LatLngLiteral | undefined = e.latLng?.toJSON();
        if (cord) setPosition(cord);
        setZoom(15);
    }

    return (
        <Modal isOpen onClose={onClose} size='full'>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Find place you visited</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <GoogleMapBase 
                        style={{ width: '100%', height: '65rem' }}
                        center={position}
                        zoom={zoom}
                        libraries={['places']}
                        onClick={onClick}
                    >
                        <AutoComplete />
                        <Marker position={position} />
                    </GoogleMapBase>     
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme='blue' onClick={onSave}>
                        Save Place
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}