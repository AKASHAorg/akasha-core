import React, { PropsWithChildren } from 'react';

import BasicCardBox from '@akashaorg/design-system-core/lib/components/BasicCardBox';
import Box from '@akashaorg/design-system-core/lib/components/Box';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Divider from '@akashaorg/design-system-core/lib/components/Divider';
import Text from '@akashaorg/design-system-core/lib/components/Text';

export interface IPageHeaderProps {
  label: string;
  cancelButtonLabel: string;
  confirmButtonLabel: string;
  showButtons?: boolean;
  onCancelButtonClick: () => void;
  onConfirmButtonClick: () => void;
}

const PageHeader: React.FC<PropsWithChildren<IPageHeaderProps>> = props => {
  const {
    label,
    cancelButtonLabel,
    confirmButtonLabel,
    showButtons = true,
    children,
    onCancelButtonClick,
    onConfirmButtonClick,
  } = props;
  return (
    <BasicCardBox pad="p-0">
      <Box customStyle="px-4 py-6">
        <Text variant="h5" align="center">
          {label}
        </Text>
      </Box>

      <Divider />

      <Box customStyle="p-4">
        <>{children}</>
      </Box>

      {showButtons && (
        <Box customStyle="flex space-x-6 items-center justify-end p-4 my-2">
          <Button plain={true} onClick={onCancelButtonClick}>
            <Text weight="bold" color={{ light: 'secondaryLight', dark: 'secondaryDark' }}>
              {cancelButtonLabel}
            </Text>
          </Button>

          <Button
            size="md"
            variant="primary"
            label={confirmButtonLabel}
            onClick={onConfirmButtonClick}
          />
        </Box>
      )}
    </BasicCardBox>
  );
};

export default PageHeader;
