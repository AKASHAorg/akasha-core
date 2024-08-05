import React, { PropsWithChildren } from 'react';
import Text from '../../Text';
import { tw } from '@twind/core';
import { LabelProps } from '../types';
import { getColorClasses } from '../../../utils/getColorClasses';

const Label: React.FC<PropsWithChildren<LabelProps>> = ({
  id,
  required,
  disabled,
  requiredFieldAsteriskColor = { light: 'secondaryLight', dark: 'secondaryDark' },
  children,
}) => {
  const labelStyle = disabled ? `text-grey4` : ``;
  return (
    <Text id={id} variant="h6" customStyle={labelStyle} as="label">
      {children}
      {required && (
        <sup
          className={tw(
            `-top-0.5 left-1 text-base ${getColorClasses(requiredFieldAsteriskColor, 'text')}`,
          )}
        >
          *
        </sup>
      )}
    </Text>
  );
};

export default Label;
