import { 
  FormControl,
  FormErrorMessage, 
  FormLabel, 
  Input, 
  InputProps, 
  Textarea, 
  TextareaProps
} from '@chakra-ui/react';
import { useField } from 'formik';
import React from 'react'

type InputFieldProps = 
  {
    label: string;
    name: string;
    textarea?: boolean
  } & (InputProps | TextareaProps);

const TextComponent: React.FC<any> = ({ label, ...props }) => {
  if (Object.keys(props).includes('textarea')) {
    delete props.textarea;
    return <Textarea {...props as TextareaProps} />
  }
  return <Input {...props as InputProps} />
} 

export const InputField: React.FC<InputFieldProps> = ({ ...props }) => {
    const [field, { error, touched }] = useField(props.name);
        return (
            <FormControl isInvalid={Boolean(error)}>
              <FormLabel htmlFor={props.name} >{props.label}</FormLabel>
              <TextComponent 
                {...field} 
                {...props}
                id={props.name}
              />
              {touched && error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
            </FormControl>
        );
}