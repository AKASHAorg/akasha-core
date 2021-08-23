import * as React from 'react';
import { Box, Text } from 'grommet';

import Icon from '../Icon';
import { MainAreaCardBox } from './basic-card-box';
import { StyledBox } from './styled-entry-box';

export interface IEntryCardHiddenProps {
  moderatedContentLabel?: string;
  ctaLabel?: string;
  isDelisted?: boolean;
  handleFlipCard?: () => void;
  // labels for reported account page
  delistedAccount?: boolean;
  reportedAccount?: boolean;
  // generic labels
  ctaUrl?: string;
  reason?: string;
  headerTextLabel?: string;
  footerTextLabel?: string;
}

const EntryCardHidden: React.FC<IEntryCardHiddenProps> = props => {
  const {
    moderatedContentLabel,
    ctaLabel,
    isDelisted,
    handleFlipCard,
    delistedAccount,
    reportedAccount,
    ctaUrl,
    reason,
    headerTextLabel,
    footerTextLabel,
  } = props;

  return (
    <MainAreaCardBox
      dashedBorder={true}
      redDashedBorder={delistedAccount}
      margin={{ ...((reportedAccount || delistedAccount) && { bottom: 'xsmall' }) }}
    >
      <Box direction="row" pad="medium" align="start">
        <Icon type={delistedAccount ? 'block' : 'error'} size="md" accentColor={!delistedAccount} />
        {reportedAccount && (
          <Text size="large" margin={{ left: 'medium' }}>
            {`${headerTextLabel}:`}
            {reason.length > 0 && (
              <StyledBox
                width="fit-content"
                margin={{ bottom: '0.5rem' }}
                pad={{ horizontal: '0.2rem' }}
                round="0.125rem"
              >
                <Text as="span" color="accentText" style={{ fontSize: '1rem', fontWeight: 600 }}>
                  {reason}
                </Text>
              </StyledBox>
            )}
            {footerTextLabel}
          </Text>
        )}
        {!reportedAccount && (
          <Text size="large" margin={{ left: 'medium' }}>
            {isDelisted && moderatedContentLabel}
            {!isDelisted && (
              <>
                {headerTextLabel && `${headerTextLabel}:`}
                {reason.length > 0 && (
                  <StyledBox
                    width="fit-content"
                    margin={{ bottom: '0.5rem' }}
                    pad={{ horizontal: '0.2rem' }}
                    round="0.125rem"
                  >
                    <Text
                      as="span"
                      color="accentText"
                      style={{ fontSize: '1rem', fontWeight: 600 }}
                    >
                      {reason}
                    </Text>
                  </StyledBox>
                )}
                {footerTextLabel}
                {ctaLabel && (
                  <Text
                    as="span"
                    size="large"
                    margin={{ left: '0.2rem' }}
                    color="accentText"
                    style={{ cursor: 'pointer' }}
                    onClick={e => {
                      e.stopPropagation();
                      // open call to action url if specified
                      ctaUrl
                        ? window.open(ctaUrl, ctaLabel, '_blank noopener noreferrer')
                        : handleFlipCard();
                    }}
                  >
                    {ctaLabel}
                  </Text>
                )}
              </>
            )}
          </Text>
        )}
      </Box>
    </MainAreaCardBox>
  );
};

export { EntryCardHidden };
