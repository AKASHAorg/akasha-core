import React from 'react';

import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import {
  SteppedActionWrapper,
  SteppedActionWrapperProps,
} from '@akashaorg/design-system-components/lib/components/SteppedActionWrapper';

import { ListItem } from './list-item';
import { BaseStepsProps } from './terms-and-conditions';

export type DownloadCLIToolProps = BaseStepsProps &
  SteppedActionWrapperProps & {
    ctaListItem: string[];
    paragraphs: string[];
    onCTAClick: () => void;
  };

export const DownloadCLITool: React.FC<DownloadCLIToolProps> = props => {
  const { introLabel, subtitleLabel, ctaListItem, paragraphs, onCTAClick } = props;

  const [listStart, listCTA, listCompletion] = ctaListItem;

  return (
    <SteppedActionWrapper {...props}>
      <Stack>
        {introLabel && <Text weight="bold">{introLabel}</Text>}

        {subtitleLabel && (
          <Text variant="body2" color={{ light: 'grey4', dark: 'grey6' }}>
            {subtitleLabel}
          </Text>
        )}

        {ctaListItem && (
          <Stack direction="row" spacing="gap-x-2" customStyle="mt-3">
            <Text>•</Text>

            <Text>
              {listStart}{' '}
              <Button plain={true} onClick={onCTAClick}>
                <Text color={{ light: 'secondaryLight', dark: 'secondaryDark' }} weight="bold">
                  {listCTA}
                </Text>
              </Button>{' '}
              {listCompletion}
            </Text>
          </Stack>
        )}

        <Stack spacing="gap-y-4">
          {paragraphs.map((paragraph: string, idx: number) => (
            <React.Fragment key={idx}>
              <ListItem listElementText="•" item={paragraph} />
              {/* re-enable this, if we need to show the console image */}

              {/* <Stack customStyle="h-[3rem] my-2">
                <Image
                  assetName={assetName}
                  assetExtension={assetExtension}
                  publicImgPath={publicImgPath}
                />
              </Stack> */}
            </React.Fragment>
          ))}
        </Stack>
      </Stack>
    </SteppedActionWrapper>
  );
};
