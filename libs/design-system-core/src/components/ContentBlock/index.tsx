import React, { PropsWithChildren } from 'react';

import Divider from '../Divider';
import Stack from '../Stack';
import Text, { TextProps } from '../Text';

export type ContentBlockProps = {
  blockTitle: string;
  blockVariant?: TextProps['variant'];
  showDivider?: boolean;
};

const ContentBlock: React.FC<PropsWithChildren<ContentBlockProps>> = ({
  blockTitle,
  blockVariant = 'h6',
  showDivider = true,
  children,
}) => {
  return (
    <Stack direction="column" spacing="gap-y-4">
      <Stack direction="column" spacing="gap-y-2">
        <Text variant={blockVariant}>{blockTitle}</Text>
        {children}
      </Stack>
      {showDivider && <Divider />}
    </Stack>
  );
};

export default ContentBlock;
