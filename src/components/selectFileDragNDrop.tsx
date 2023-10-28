import { Box, IconButton, Text, Image } from "@chakra-ui/react";
import React, { useRef, useState } from "react";
import { MdAddTask } from "react-icons/md";

type InputProps = {
    refToFile: React.MutableRefObject<File | null>,
};

export const SelectFileDragNDrop = ({ refToFile }: InputProps) => {
    const [fileSrc, setFileSrc] = useState<string>('');

    const hiddenInputRef =  useRef<HTMLInputElement>(null);

    const onPhotoSelect = (file: File) => {
        refToFile.current = file;
        const src = URL.createObjectURL(file);
        setFileSrc(src);
    };
    const dropHandler = (ev: React.DragEvent<HTMLDivElement>) => {
        ev.preventDefault();
        const list = ev.dataTransfer.items;
        let file: File | undefined | null;
        if (list) {
            if (list[0].kind === 'file') {
                file = list[0].getAsFile();
            }
        } else { 
            file = ev.dataTransfer.files[0];
        }
        if (file) onPhotoSelect(file);
    };
    return (<>
        { fileSrc   
          ? <Image 
                width='100%'
                src={fileSrc} alt='image'
                fit='contain'  
            />
          : <Box
                // height='0'
                py='10%'
                border='1px solid black'
                borderRadius='md'
                backgroundColor='gray.300'
                color='black'
                display='flex'
                flexDir='column'
                justifyContent='center'
                alignItems='center'
                onDrop={ ev => dropHandler(ev) }
                onDragOver={ ev => ev.preventDefault() }
            >
                <input
                    hidden
                    type='file'
                    ref={hiddenInputRef}
                    onChange={(e) => {
                        const list = e.target.files;
                        if (list) onPhotoSelect(list[0])
                    }}
                />
                <IconButton
                    icon={<MdAddTask size='30'/>}
                    aria-label='addFile'
                    onClick={() => hiddenInputRef.current!.click()}
                />
                <Text
                    fontWeight='semibold'
                    fontSize='md'
                >
                    Add file with photo
                </Text>
                <Text
                    fontWeight='normal'
                    fontSize='sm'
                >
                    or drag&#39;n&#39;drop
                </Text>
            </Box>
        }</>
    )}