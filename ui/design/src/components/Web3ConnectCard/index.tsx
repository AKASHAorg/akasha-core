import * as React from 'react';
import { Box, Text } from 'grommet';
import { MarginType } from 'grommet/utils';

import { BasicCardBox } from '../EntryCard/basic-card-box';
import Icon from '../Icon';

export interface IWeb3ConnectCardProps {
  boxMargin?: MarginType;
  titleLabel: string;
  subtitleLabel?: string;
  leftIconType: string;
  iconBackground?: string;
  handleClick: () => void;
}

const Web3ConnectCard: React.FC<IWeb3ConnectCardProps> = props => {
  const { boxMargin, titleLabel, subtitleLabel, leftIconType, iconBackground, handleClick } = props;

  // indicates when to show a larger size of specified icon
  const largerIcon = !['key'].includes(leftIconType);

  return (
    <BasicCardBox pad="medium" callToAction={true} onClick={handleClick} margin={boxMargin}>
      <Box direction="row" justify="start" align="center">
        {leftIconType && (
          <Box
            pad="0.25rem"
            background={iconBackground}
            margin={{ right: 'xsmall' }}
            style={{ borderRadius: '10%' }}
          >
            <Icon
              type={leftIconType}
              color={largerIcon ? 'initial' : 'white'}
              size={'xl'}
              plain={true}
            />
          </Box>
        )}
        <Box direction="column" justify="between" align="start">
          <Text weight={600} size="1rem">
            {titleLabel}
          </Text>
          {subtitleLabel && (
            <Text margin={{ top: 'xsmall' }} color="secondaryText">
              {subtitleLabel}
            </Text>
          )}
        </Box>
      </Box>
    </BasicCardBox>
  );
};

export default Web3ConnectCard;
