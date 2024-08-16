import React from 'react';
import Text from '../Text';
import { tw } from '@twind/core';

export type LabelProps = React.PropsWithChildren<{
  id?: string;
  required?: boolean;
  disabled?: JSX.IntrinsicElements['input']['disabled'];
}>;

/**
 * The Label component is a semantic label tag utilized in TextField and other components.
 * @param id - unique id of the label
 * @param required -  specifies if the label is to be used for a required field by adding sn asterisk
 * @param disabled - for disabled fields
 */
const Label: React.FC<LabelProps> = props => {
  const { id, required, disabled, children } = props;

  return (
    <Text
      as="label"
      id={id}
      variant="h6"
      {...(disabled && { customStyle: 'text(grey4 dark:grey6)' })}
    >
      {children}
      {required && (
        <sup className={tw('-top-0.5 left-1 text-base  text(errorLight dark:errorDark)')}>*</sup>
      )}
    </Text>
  );
};

export default Label;
