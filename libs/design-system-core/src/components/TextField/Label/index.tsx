import React, { PropsWithChildren } from 'react';
import Text from '../../Text';
import { tw } from '@twind/core';
import { LabelProps } from '../types';
import { getColorClasses } from '../../../utils/getColorClasses';

const Label: React.FC<PropsWithChildren<LabelProps>> = ({ id, required, disabled, children }) => {
  const labelStyle = disabled ? `text-grey4` : ``;
  return (
    <Text id={id} variant="h6" customStyle={labelStyle} as="label">
      {children}
      {required && (
        <sup
          className={tw(
            `-top-0.5 ${getColorClasses(
              { light: 'secondaryLight', dark: 'secondaryDark' },
              'text',
            )}`,
          )}
        >
          *
        </sup>
      )}
    </Text>
  );
};

export default Label;
