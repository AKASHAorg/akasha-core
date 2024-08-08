import React from 'react';
import Divider from '@akashaorg/design-system-core/lib/components/Divider';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Toggle from '@akashaorg/design-system-core/lib/components/Toggle';
import Label, { TLabelProps } from './label';

export type TSectionProps = TLabelProps & {
  hasToggle?: boolean;
  isToggleChecked?: boolean;
};

const Section: React.FC<React.PropsWithChildren<TSectionProps>> = props => {
  const { children, hasToggle = false, isToggleChecked, title, isRequired } = props;

  return (
    <>
      <Stack spacing="gap-y-2">
        <Stack direction="row" align="center" justify="between">
          <Label title={title} isRequired={isRequired} />
          {hasToggle && <Toggle checked={isToggleChecked} disabled={true} />}
        </Stack>
        {children}
      </Stack>
      <Divider />
    </>
  );
};

export default Section;
