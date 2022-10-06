import React, { forwardRef } from "react";

type InputProps = {
    setFileSrc: React.Dispatch<React.SetStateAction<string>>,
    refToFile: React.MutableRefObject<File | null>,
}

export const SelectFile = forwardRef(
    ({ setFileSrc, refToFile }: InputProps, 
     ref: React.ForwardedRef<HTMLInputElement> ) => {

    const onPhotoSelect = (file: File) => {
        refToFile.current = file;
        const src = URL.createObjectURL(file);
        setFileSrc(src);
    };

    return (
        <input
            hidden
            type='file'
            ref={ref}
            onChange={(e) => {
                const list = e.target.files;
                if (list) onPhotoSelect(list[0])
            }}
        />
    )
});
SelectFile.displayName = 'SelectFile';