import React from 'react';
import { Box, Text } from 'grommet';
import styled from 'styled-components';

import { Button } from '../../Buttons';

import { BasicCardBox } from '../common/basic-card-box';

export interface ICookieWidgetCard {
  titleLabel: string;
  contentLabel: string;
  privacyUrl: string;
  privacyUrlLabel: string;
  acceptLabel: string;
  onClick: () => void;
}

const CookieCardButton = styled(Button)`
  width: 100%;
  height: auto;
  padding: 0.5rem 0.6rem;
  border-width: 0.1rem;
`;

const CookieWidgetCard: React.FC<ICookieWidgetCard> = props => {
  const { titleLabel, contentLabel, acceptLabel, privacyUrl, privacyUrlLabel, onClick } = props;

  return (
    <BasicCardBox elevate="shadow" darkBorder={true}>
      <Box margin="1rem">
        <Text weight={600} textAlign="start" margin={{ bottom: 'medium' }} size="large">
          {titleLabel}
        </Text>
        <Text
          size="medium"
          margin={{ bottom: 'medium' }}
          style={{ lineHeight: '1.4', letterSpacing: '0.05em' }}
        >
          {contentLabel}{' '}
          <Text
            color="accentText"
            size="medium"
            style={{ cursor: 'pointer' }}
            onClick={() => window.open(privacyUrl, privacyUrlLabel, '_blank noopener noreferrer')}
          >
            {privacyUrlLabel}
          </Text>
        </Text>
        <Box width="30%" align="center">
          <CookieCardButton
            fill={true}
            size="large"
            primary={true}
            label={acceptLabel}
            onClick={onClick}
          />
        </Box>
      </Box>
    </BasicCardBox>
  );
};

export default CookieWidgetCard;
