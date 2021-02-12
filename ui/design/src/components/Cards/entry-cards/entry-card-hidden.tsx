import * as React from 'react';
import { Box, Text } from 'grommet';

import { Icon } from '../../Icon';
import { MainAreaCardBox } from '../common/basic-card-box';

export interface IEntryCardHiddenProps {
  awaitingModerationLabel?: string;
  moderatedContentLabel?: string;
  ctaLabel?: string;
  isDelisted?: boolean;
  handleFlipCard?: any;
}

const EntryCardHidden: React.FC<IEntryCardHiddenProps> = props => {
  const {
    awaitingModerationLabel,
    moderatedContentLabel,
    ctaLabel,
    isDelisted,
    handleFlipCard,
  } = props;
  return (
    <MainAreaCardBox dashedBorder={true}>
      <Box direction="row" pad="medium" align="start">
        <Icon type="error" size="md" accentColor={true} />
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
      </Box>
    </MainAreaCardBox>
  );
};

export { EntryCardHidden };
