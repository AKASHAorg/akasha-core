import * as React from 'react';
import { Box, Text } from 'grommet';

import { Icon } from '../../Icon';
import { MainAreaCardBox } from '../common/basic-card-box';

export interface IEntryCardHiddenProps {
  descriptionLabel: string;
  ctaLabel: string;
  handleFlipCard: any;
}

const EntryCardHidden: React.FC<IEntryCardHiddenProps> = props => {
  const { descriptionLabel, ctaLabel, handleFlipCard } = props;
  return (
    <MainAreaCardBox dashedBorder={true}>
      <Box direction="row" pad="medium" align="start">
        <Icon type="error" size="md" accentColor={true} />
        <Text size="medium" margin={{ left: 'medium' }}>
          {descriptionLabel}
          <Text
            as="span"
            size="medium"
            margin={{ left: '0.2rem' }}
            color="accentText"
            style={{ cursor: 'pointer' }}
            onClick={handleFlipCard}
          >
            {ctaLabel}
          </Text>
        </Text>
      </Box>
    </MainAreaCardBox>
  );
};

export { EntryCardHidden };
