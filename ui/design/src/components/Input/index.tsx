import { TextInput, TextInputProps } from 'grommet';
import React from 'react';

export interface ITextInputProps extends TextInputProps {
  onChange?: () => {};
}

const AkashaTextInput: React.FC<TextInputProps> = props => {
  return <TextInput {...props} />;
};

export default AkashaTextInput;
