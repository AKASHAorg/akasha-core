import * as React from 'react';
import { Box, Text } from 'grommet';

import { BasicCardBox } from '../EntryCard/basic-card-box';
import Icon from '../Icon';

export interface ISelectAddressButtonProps {
  titleLabel: string;
  handleClick: () => void;
}

const SelectAddressButton: React.FC<ISelectAddressButtonProps> = props => {
  const { titleLabel, handleClick } = props;

  return (
    <BasicCardBox pad="medium" callToAction={true} clickHandler={handleClick}>
      <Box pad={{ vertical: 'xxsmall' }} direction="row" justify="between">
        <Text color="accentText" size="1rem">
          {titleLabel}
        </Text>
        <Icon type="arrowRight" size="sm" accentColor={true} clickable={true} />
      </Box>
    </BasicCardBox>
  );
};

export default SelectAddressButton;
