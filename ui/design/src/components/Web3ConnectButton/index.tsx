import * as React from 'react';
import { Box, Text } from 'grommet';

import { BasicCardBox } from '../EntryCard/basic-card-box';
import Icon from '../Icon';

export interface IWeb3ConnectButtonProps {
  titleLabel: string;
  subtitleLabel: string;
  leftIconType: string;
  handleClick: () => void;
}

const Web3ConnectButton: React.FC<IWeb3ConnectButtonProps> = props => {
  const { titleLabel, subtitleLabel, leftIconType, handleClick } = props;

  return (
    <BasicCardBox pad="medium" callToAction={true} clickHandler={handleClick}>
      <Box direction="row" justify="between" align="center">
        <Box direction="row" align="center">
          {leftIconType && (
            <Box pad="xxsmall" round={true} background="accentText" margin={{ right: 'xsmall' }}>
              <Icon type={leftIconType} color="white" size="xs" />
            </Box>
          )}
          <Text weight="bold" size="1rem">
            {titleLabel}
          </Text>
        </Box>
        <Icon type="arrowRight" size="sm" accentColor={true} clickable={true} />
      </Box>
      <Text margin={{ top: 'xsmall' }} color="secondaryText">
        {subtitleLabel}
      </Text>
    </BasicCardBox>
  );
};

export default Web3ConnectButton;
