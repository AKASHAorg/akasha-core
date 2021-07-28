import * as React from 'react';
import { Box, Text } from 'grommet';

import Icon from '../Icon';
import { MainAreaCardBox } from './basic-card-box';
import { StyledBox } from './styled-entry-box';

export interface IEntryCardHiddenProps {
  awaitingModerationLabel?: string;
  moderatedContentLabel?: string;
  ctaLabel?: string;
  isDelisted?: boolean;
  handleFlipCard?: any;
  // labels for reported account page
  reportedAccount?: boolean;
  reason?: string;
  headerTextLabel?: string;
  footerTextLabel?: string;
}

const EntryCardHidden: React.FC<IEntryCardHiddenProps> = props => {
  const {
    awaitingModerationLabel,
    moderatedContentLabel,
    ctaLabel,
    isDelisted,
    handleFlipCard,
    reportedAccount,
    reason,
    headerTextLabel,
    footerTextLabel,
  } = props;

  return (
    <MainAreaCardBox dashedBorder={true} margin={{ ...(reportedAccount && { bottom: 'xsmall' }) }}>
      <Box direction="row" pad="medium" align="start">
        <Icon type="error" size="md" accentColor={true} />
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
            {!isDelisted ? awaitingModerationLabel : moderatedContentLabel}
            {ctaLabel && (
              <Text
                as="span"
                size="large"
                margin={{ left: '0.2rem' }}
                color="accentText"
                style={{ cursor: 'pointer' }}
                onClick={e => {
                  e.stopPropagation();
                  handleFlipCard();
                }}
              >
                {ctaLabel}
              </Text>
            )}
          </Text>
        )}
      </Box>
    </MainAreaCardBox>
  );
};

export { EntryCardHidden };
