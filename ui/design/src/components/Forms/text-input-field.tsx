import * as React from 'react';
import { FormField, TextInput } from 'grommet';
import { StyledText } from '../BoxFormCard/styled-form-card';
export interface ITextInputFieldProps {
  label: string;
  id: string;
  name: string;
  labelColor?: string;
  value?: string;
  placeholder?: string;
  onChange?: React.EventHandler<React.ChangeEvent<HTMLInputElement>>;
}
const TextInputField = React.forwardRef(
  (props: ITextInputFieldProps, ref: React.RefObject<any>) => {
    const {
      id,
      label,
      name,
      labelColor = 'secondaryText',
      value = '',
      placeholder,
      onChange,
    } = props;
    return (
      <FormField
        name={name}
        htmlFor={id}
        label={
          <StyledText color={labelColor} size="small">
            {label}
          </StyledText>
        }
      >
        <TextInput id={id} value={value} placeholder={placeholder} onChange={onChange} ref={ref} />
      </FormField>
    );
  },
);

export default TextInputField;
