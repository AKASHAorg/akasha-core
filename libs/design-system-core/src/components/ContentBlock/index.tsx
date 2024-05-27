import React, { PropsWithChildren } from 'react';

import Divider from '../Divider';
import Stack from '../Stack';
import Text, { TextProps } from '../Text';
import Button from '../Button';

export type ContentBlockProps = {
  blockTitle: string;
  viewMore?: string;
  onClickViewMore?: () => void;
  blockVariant?: TextProps['variant'];
  showDivider?: boolean;
};

const ContentBlock: React.FC<PropsWithChildren<ContentBlockProps>> = ({
  blockTitle,
  viewMore,
  onClickViewMore,
  blockVariant = 'h6',
  showDivider = true,
  children,
}) => {
  return (
    <Stack direction="column" spacing="gap-y-4">
      <Stack direction="column" spacing="gap-y-2">
        <Stack justify="between" direction="row">
          <Text variant={blockVariant}>{blockTitle}</Text>
          {!!viewMore && (
            <Button size="md" variant="text" label={viewMore} onClick={onClickViewMore} />
          )}
        </Stack>
        {children}
      </Stack>
      {showDivider && <Divider />}
    </Stack>
  );
};

export default ContentBlock;
