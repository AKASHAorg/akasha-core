import React from 'react';
import { tw } from '@twind/core';
import Text from '@akashaorg/design-system-core/lib/components/Text';

export type TLabelProps = {
  title: string;
  isRequired?: boolean;
};

const Label: React.FC<TLabelProps> = props => {
  const { title, isRequired = false } = props;

  const asteriskStyle = tw(`-top-0.5 left-1 text-base text(errorLight dark:errorDark)`);

  return (
    <Text variant="h6">
      {title} {isRequired && <span className={asteriskStyle}>*</span>}
    </Text>
  );
};

export default Label;
