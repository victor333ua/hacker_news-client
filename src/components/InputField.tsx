import { 
  FormControl,
  FormErrorMessage, 
  FormLabel, 
  Icon, 
  Input, 
  InputGroup, 
  InputProps, 
  InputRightElement, 
  Textarea, 
  TextareaProps,
  Text
} from '@chakra-ui/react';
import { useField } from 'formik';
import React from 'react';
import {ViewIcon, ViewOffIcon} from '@chakra-ui/icons'

type InputFieldProps = 
  {
    label: string;
    name: string;
    textarea?: boolean
  } & (InputProps | TextareaProps);

const TextComponent: React.FC<any> = ({ label, ...props }) => {
  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);

  if (Object.keys(props).includes('textarea')) {
    delete props.textarea;
    return <Textarea {...props as TextareaProps} />
  }
  if (props.type === 'password') {
    return (
    <InputGroup>
      <Input {...props} type={show ? 'text' : 'password'} /> 
      <InputRightElement>
        <Icon as={show ? ViewOffIcon : ViewIcon} onClick={handleClick} />      
      </InputRightElement>
    </InputGroup>                               
  )}
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
              {touched && error
               ?  <Text
                    color='red'
                    fontSize='md'
                    fontWeight='bold'
                    border='2px solid red'
                    borderRadius='md'
                    mb='10px'
                    py='5px'
                    px='10px'
                  >{error}
                  </Text> 
                : null}
            </FormControl>
        );
}