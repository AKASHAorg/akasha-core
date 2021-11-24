import * as React from 'react';
import { Box, Text } from 'grommet';
import styled from 'styled-components';

import { BasicCardBox } from '../EntryCard/basic-card-box';
import Icon from '../Icon';

export interface IVariableIconButtonProps {
  titleLabel: string;
  errorLabel: string;
  isLoading: boolean;
  isError: boolean;
  onClick: () => void;
}

export const StyledIcon = styled(Box)`
  display: flex;
  min-width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
`;

const VariableIconButton: React.FC<IVariableIconButtonProps> = props => {
  const { titleLabel, errorLabel, isLoading, isError, onClick } = props;

  return (
    <>
      <BasicCardBox pad="medium" callToAction={true} onClick={onClick}>
        <Box pad={{ vertical: 'xxsmall' }} direction="row" justify="between" align="center">
          <Text color="accentText" size="1rem">
            {titleLabel}
          </Text>
          <Icon
            type={isLoading ? 'loading' : 'arrowRight'}
            size="sm"
            accentColor={true}
            clickable={true}
          />
        </Box>
      </BasicCardBox>
      {isError && (
        <Box direction="row" alignSelf="start" margin={{ top: 'xxsmall' }}>
          <Icon type="error" size="sm" />
          <Text margin={{ left: 'xxsmall' }} color="errorText">
            {errorLabel}
          </Text>
        </Box>
      )}
    </>
  );
};

export default VariableIconButton;
