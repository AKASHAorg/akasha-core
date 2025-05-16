import React from 'react';
import Link from '@akashaorg/design-system-core/lib/components/Link';
import { Card } from '@akashaorg/ui/lib/akasha-components/card';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import { cn } from '@akashaorg/ui/lib/library/utils';
export type VibesValueCardProps = {
  publicImgPath?: string;
  assetExtension?: string;
  assetName: string;
  label: string;
  description?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  isMini?: boolean;
  onClick?: () => void;
};
const VibesValueCard: React.FC<VibesValueCardProps> = props => {
  const {
    publicImgPath = '/images',
    assetExtension = 'webp',
    assetName,
    label,
    description,
    ctaLabel,
    ctaUrl,
    isMini = false,
    onClick,
  } = props;
  return (
    <button onClick={onClick}>
      <Card className="p-0 rounded-2xl cursor-pointer">
        <Stack
          justifyContent={isMini ? 'between' : 'evenly'}
          className={cn(isMini ? 'p-3 h-32' : 'p-4')}
        >
          <Stack className={cn('self-center', isMini ? 'h-16 w-16' : 'h-72 w-72')}>
            <img
              loading="lazy"
              decoding="async"
              alt={assetName}
              className="object-contain"
              src={`${publicImgPath}/${assetName}.${assetExtension}`}
            />
          </Stack>

          <Typography
            variant={isMini ? 'xs' : 'h5'}
            bold
            {...(isMini && {
              customStyle: 'px-4',
            })}
          >
            {label}
          </Typography>

          {!isMini && (
            <Stack spacing={4}>
              {description && <Typography className="font-light">{description}</Typography>}

              {ctaLabel && (
                <Link
                  to={ctaUrl}
                  customStyle="text-sm self-end font-bold no-underline text-secondaryLight dark:text-secondaryDark"
                  target="_blank"
                >
                  {ctaLabel}
                </Link>
              )}
            </Stack>
          )}
        </Stack>
      </Card>
    </button>
  );
};
export default VibesValueCard;
