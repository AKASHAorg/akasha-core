import React, { PropsWithChildren } from 'react';
import { Card } from '@akashaorg/ui/lib/akasha-components/card';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import { Separator } from '@akashaorg/ui/lib/components/separator';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
import { PageButtonsProps, PageButtons } from '../PageButtons';
export type PageHeaderProps = PageButtonsProps & {
  label?: string;
  labelTextVariant?: React.ComponentProps<typeof Typography>['variant'];
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
    <Card className={`p-0 mb-4 ${customStyle}`}>
      {label && (
        <>
          <Stack className="px-4 py-6">
            <Typography variant={labelTextVariant} className="text-center">
              {label}
            </Typography>
          </Stack>

          <Separator />
        </>
      )}

      <Stack spacing={3} className="p-4">
        {children}

        {/* show buttons only when the labels are specified */}
        {(cancelButtonLabel || confirmButtonLabel) && <PageButtons {...props} />}
      </Stack>
    </Card>
  );
};
