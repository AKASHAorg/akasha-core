import React, { PropsWithChildren } from 'react';

import Card from '@akashaorg/design-system-core/lib/components/Card';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Divider from '@akashaorg/design-system-core/lib/components/Divider';
import Text, { TextProps } from '@akashaorg/design-system-core/lib/components/Text';
import { PageButtonsProps, PageButtons } from '../PageButtons';

export type PageHeaderProps = PageButtonsProps & {
  label?: string;
  labelTextVariant?: TextProps['variant'];
  customStyle?: string;
};

/**
 * Component used to display a header for each page in the vibes and vibes console apps
 * @param label - title of the header
 * @param labelTextVariant - text style for the title
 * @param customStyle - custom tailwind styles for the wrapper card
 */
export const PageHeader: React.FC<PropsWithChildren<PageHeaderProps>> = props => {
  const {
    labelTextVariant = 'h5',
    label,
    cancelButtonLabel,
    confirmButtonLabel,
    children,
    customStyle,
  } = props;

  return (
    <Card padding={0} margin="mb-4" customStyle={customStyle}>
      {label && (
        <>
          <Stack padding="px-4 py-6">
            <Text variant={labelTextVariant} align="center">
              {label}
            </Text>
          </Stack>

          <Divider />
        </>
      )}

      <Stack padding="p-4" spacing="gap-y-3">
        {children}

        {/* show buttons only when the labels are specified */}
        {(cancelButtonLabel || confirmButtonLabel) && <PageButtons {...props} />}
      </Stack>
    </Card>
  );
};
