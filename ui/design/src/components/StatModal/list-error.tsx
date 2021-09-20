import React from 'react';
import { Box, Text } from 'grommet';
import styled from 'styled-components';

import Button from '../Button';

const StyledButton = styled(Button)`
  width: fit-content;
  align-self: center;
`;

interface IListError {
  errorTitleLabel?: string;
  errorSubtitleLabel?: string;
  buttonLabel?: string;
  handleButtonClick: () => void;
}

const ListError: React.FC<IListError> = props => {
  const { errorTitleLabel, errorSubtitleLabel, buttonLabel, handleButtonClick } = props;

  return (
    <Box margin="auto" style={{ textAlign: 'center' }}>
      <Text weight={600} size="xlarge">
        {errorTitleLabel}
      </Text>
      <Text
        color="secondaryText"
        margin={{ top: 'small' }}
        size="large"
        style={{ lineHeight: '1.6' }}
      >
        {errorSubtitleLabel}
      </Text>
      <StyledButton
        margin={{ top: 'large' }}
        primary={true}
        label={buttonLabel}
        onClick={handleButtonClick}
      />
    </Box>
  );
};

export default ListError;
