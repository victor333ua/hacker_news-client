import { IconButton, Tooltip, IconButtonProps } from '@chakra-ui/react';
import React from 'react'
import NextLink from 'next/link'

type MyIconButtonProps = {
    name: string;
    icon: any;
    ml?: string;
    mr?: string;
    isDisabled?: boolean;
} & Partial<IconButtonProps>;

export const MyIconButton: React.FC<MyIconButtonProps> = ({ name, icon, onClick, ...props }) => {
    let href = '/';
    if (name !== 'all posts') href = href.concat(name);
    if (onClick) href = '';
    return (
        <NextLink href={href}>         
            <IconButton
                    mr={10}
                    bg="gray.300"
                    // borderColor="gray.600"
                    color="gray.600"
                    {...props}
                    aria-label={name}
                    icon={icon}                  
                    border="2px" 
                    onClick={onClick}                  
            />                                     
        </NextLink>
    );
}