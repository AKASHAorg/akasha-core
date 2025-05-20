import React from 'react';
import { Button } from '@akashaorg/ui/lib/akasha-components/button';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Link from '@akashaorg/design-system-core/lib/components/Link';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import { Discord } from '@akashaorg/design-system-core/lib/components/Icon/akasha-icons';
import Image from '@akashaorg/design-system-core/lib/components/Image';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
export type ReportItemConfirmationProps = {
  assetName?: string;
  publicImgPath?: string;
  assetExtension?: string;
  titleLabel: string;
  subtitleLabel: string;
  footnoteLabel: string;
  continueLabel: string;
  ctaLabel: string;
  ctaUrl: string;
  onContinueClick: () => void;
};
export const ReportItemConfirmation: React.FC<ReportItemConfirmationProps> = props => {
  const {
    assetName = 'vibe-report',
    publicImgPath = '/images',
    assetExtension = 'webp',
    titleLabel,
    subtitleLabel,
    footnoteLabel,
    continueLabel,
    ctaLabel,
    onContinueClick,
    ctaUrl,
  } = props;
  return (
    <Card className="md:p-4">
      <Stack spacing={4} alignItems="center">
        <Typography variant="h5" className="text-center">
          {titleLabel} 🙌🏽
        </Typography>

        <Stack className="w-45 h-45 my-2 mx-auto">
          <Image
            src={`${publicImgPath}/${assetName}.${assetExtension}`}
            dataTestId={`${assetName}-image`}
          />
        </Stack>

        <Typography variant="sm" className="font-normal text-center text-grey5 dark:text-grey6">
          {subtitleLabel}
        </Typography>

        <Button variant="link" onClick={onContinueClick}>
          {continueLabel}
        </Button>

        <Stack alignItems="center" spacing={2} className="justify-self-end">
          <Typography variant="xs" className="font-medium font-normal text-center">
            {footnoteLabel}
          </Typography>

          <Link to={ctaUrl} target="_blank">
            <Stack direction="row" alignItems="center" spacing={2}>
              <Discord className="h-4 w-4 mx-auto my-0 [&>*]:fill-secondaryLight dark:[&>*]:stroke-secondaryDark" />

              <Typography
                variant="xs"
                className="font-medium font-normal text-center text-secondaryLight dark:text-secondaryDark"
              >
                {ctaLabel}
              </Typography>
            </Stack>
          </Link>
        </Stack>
      </Stack>
    </Card>
  );
};
