import React, { PropsWithChildren } from 'react';
import Text from '../../Text';
import { tw } from '@twind/core';
import { LabelProps } from '../types';
import { getColorClasses } from '../../../utils/getColorClasses';

const Label: React.FC<PropsWithChildren<LabelProps>> = ({ required, disabled, children }) => {
  const labelStyle = disabled ? `text-grey4` : ``;
  return (
    <Text variant="h6" customStyle={labelStyle}>
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
