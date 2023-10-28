import { IconButton, Tooltip, IconButtonProps } from '@chakra-ui/react';
import React from 'react'

type MyIconButtonProps = {
    name: string;
    icon: any;
    ml?: string;
    mr?: string;
    isDisabled?: boolean;
} & Partial<IconButtonProps>;

export const MyIconButton: React.FC<MyIconButtonProps> = ({ name, icon, onClick, ...props }) => {
    return (
            <IconButton
                    {...props}
                    aria-label={name}
                    icon={icon}                  
                    border="2px" 
                    onClick={onClick}                  
            />                                     
    );
}