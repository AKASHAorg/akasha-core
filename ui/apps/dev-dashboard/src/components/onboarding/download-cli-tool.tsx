import React from 'react';

import Box from '@akashaorg/design-system-core/lib/components/Box';
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

  return (
    <SteppedActionWrapper {...props}>
      <Box>
        {introLabel && <Text weight="bold">{introLabel}</Text>}

        {subtitleLabel && (
          <Text variant="body2" color={{ light: 'grey4', dark: 'grey6' }}>
            {subtitleLabel}
          </Text>
        )}

        {ctaListItem && (
          <Box customStyle="flex space-x-2 mt-3">
            <Text>•</Text>

            <Text>
              {ctaListItem[0]}{' '}
              <Button plain={true} onClick={onCTAClick}>
                <Text color={{ light: 'secondaryLight', dark: 'secondaryDark' }} weight="bold">
                  {ctaListItem[1]}{' '}
                </Text>
              </Button>{' '}
              {ctaListItem[2]}
            </Text>
          </Box>
        )}

        <Box customStyle="space-y-4">
          {paragraphs.map((paragraph: string, idx: number) => (
            <React.Fragment key={idx}>
              <ListItem listElementText="•" item={paragraph} />
              {/* re-enable this, if we need to show the console image */}

              {/* {idx === 0 && (
              <Box customStyle="h-[3rem] my-2">
                <img className={tw('object-contain')} src={`${publicImgPath}/${assetName}.webp`} />
              </Box>
            )} */}
            </React.Fragment>
          ))}
        </Box>
      </Box>
    </SteppedActionWrapper>
  );
};
