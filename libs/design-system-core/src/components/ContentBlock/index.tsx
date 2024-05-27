import React, { PropsWithChildren } from 'react';
import Divider from '../Divider';
import Stack from '../Stack';
import Text, { TextProps } from '../Text';
import Button from '../Button';
import Icon from '../Icon';

export type ContentBlockProps = {
  blockTitle: string;
  viewMoreLabel?: string;
  viewMoreIcon?: React.ReactElement; //only speficy either viewMoreLabel or viewMoreIcon, not both
  onClickviewMoreLabel?: () => void;
  blockVariant?: TextProps['variant'];
  showDivider?: boolean;
};

const ContentBlock: React.FC<PropsWithChildren<ContentBlockProps>> = ({
  blockTitle,
  viewMoreLabel,
  viewMoreIcon,
  onClickviewMoreLabel,
  blockVariant = 'h6',
  showDivider = true,
  children,
}) => {
  return (
    <Stack direction="column" spacing="gap-y-4">
      <Stack direction="column" spacing="gap-y-2">
        <Stack justify="between" direction="row">
          <Text variant={blockVariant}>{blockTitle}</Text>
          {!!viewMoreLabel && (
            <Button size="md" variant="text" label={viewMoreLabel} onClick={onClickviewMoreLabel} />
          )}
          {!!viewMoreIcon && (
            <Button plain onClick={onClickviewMoreLabel}>
              <Icon
                icon={viewMoreIcon}
                size="sm"
                color={{ light: 'secondaryLight', dark: 'secondaryDark' }}
                customStyle="ml-auto"
              />
            </Button>
          )}
        </Stack>
        {children}
      </Stack>
      {showDivider && <Divider />}
    </Stack>
  );
};

export default ContentBlock;
