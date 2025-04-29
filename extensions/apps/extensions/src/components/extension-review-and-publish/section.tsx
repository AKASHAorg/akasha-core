import React from 'react';
import Divider from '@akashaorg/design-system-core/lib/components/Divider';
import Label from '@akashaorg/design-system-core/lib/components/Label';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import Toggle from '@akashaorg/design-system-core/lib/components/Toggle';

export type TSectionProps = {
  title: string;
  required?: boolean;
  hasToggle?: boolean;
  isToggleChecked?: boolean;
};

const Section: React.FC<React.PropsWithChildren<TSectionProps>> = props => {
  const { children, hasToggle = false, isToggleChecked, title, required } = props;

  return (
    <>
      <Stack spacing={2}>
        <Stack direction="row" alignItems="center" justifyContent="between">
          <Label required={required}>{title}</Label>
          {hasToggle && <Toggle checked={isToggleChecked} disabled={true} />}
        </Stack>
        {children}
      </Stack>
      <Divider />
    </>
  );
};

export default Section;
