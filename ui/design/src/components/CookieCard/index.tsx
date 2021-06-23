import React from 'react';
import { Box, Text } from 'grommet';
import styled from 'styled-components';
import { isMobileOnly } from 'react-device-detect';

import Button from '../Button';

import { BasicCardBox } from '../EntryCard/basic-card-box';

export interface ICookieWidgetCard {
  titleLabel: string;
  contentLabel: string | React.ReactElement;
  privacyUrl: string;
  privacyUrlLabel: string;
  onlyEssentialLabel: string;
  acceptAllLabel: string;
  onClickAcceptAll: () => void;
  onClickOnlyEssential: () => void;
}

const CookieCardButton = styled(Button)`
  width: 100%;
  height: auto;
  padding: 0.5rem 0.6rem;
  border-width: 0.1rem;
`;

const CookieWidgetCard: React.FC<ICookieWidgetCard> = props => {
  const {
    titleLabel,
    contentLabel,
    onlyEssentialLabel,
    acceptAllLabel,
    privacyUrl,
    privacyUrlLabel,
    onClickAcceptAll,
    onClickOnlyEssential,
  } = props;

  return (
    <BasicCardBox darkBorder={true} noBorderRadius={isMobileOnly}>
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
        <Box width="100%" direction="row" align="center">
          <CookieCardButton
            size="large"
            label={onlyEssentialLabel}
            margin={{ right: '0.5rem' }}
            onClick={onClickOnlyEssential}
          />
          <CookieCardButton
            size="large"
            primary={true}
            label={acceptAllLabel}
            onClick={onClickAcceptAll}
          />
        </Box>
      </Box>
    </BasicCardBox>
  );
};

export default CookieWidgetCard;
