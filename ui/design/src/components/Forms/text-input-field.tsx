import * as React from 'react';
import { FormField, TextInput } from 'grommet';
import { StyledText } from '../Cards/form-cards/styled-form-card';
export interface ITextInputFieldProps {
  label: string;
  id: string;
  labelColor?: string;
  defaultValue?: string;
  placeholder?: string;
  onChange?: React.EventHandler<React.ChangeEvent<HTMLInputElement>>;
}
const TextInputField = React.forwardRef(
  (props: ITextInputFieldProps, ref: React.RefObject<any>) => {
    const { id, label, labelColor = 'secondaryText', defaultValue, placeholder, onChange } = props;
    return (
      <FormField
        name="name"
        htmlFor={id}
        label={
          <StyledText color={labelColor} size="small">
            {label}
          </StyledText>
        }
      >
        <TextInput
          id={id}
          defaultValue={defaultValue}
          placeholder={placeholder}
          onChange={onChange}
          ref={ref}
        />
      </FormField>
    );
  },
);

export default TextInputField;
