import * as React from 'react';
import { Box } from 'grommet';

import { useViewportSize } from '../../Providers/viewport-dimension';

import { IEntryData } from './entry-box';
import { TextIcon } from '../../TextIcon';

export interface CardActionModProps {
  entryData: IEntryData;
  repostsLabel: string;
  repliesLabel: string;
  handleRepliesClick: () => void;
}

const CardActions: React.FC<CardActionModProps> = props => {
  const { entryData, repostsLabel, repliesLabel, handleRepliesClick } = props;

  const { size } = useViewportSize();

  const repostsBtnText =
    size === 'small' ? `${entryData.reposts || 0}` : `${entryData.reposts || 0} ${repostsLabel}`;
  const repliesBtnText =
    size === 'small'
      ? `${entryData.replies?.length || 0}`
      : `${entryData.replies?.length || 0} ${repliesLabel}`;

  return (
    <Box
      width="75%"
      alignSelf="center"
      pad={{ vertical: 'medium' }}
      direction="row"
      justify="between"
    >
      <TextIcon
        label={repostsBtnText}
        iconType="transfer"
        iconSize="md"
        clickable={true}
        onClick={() => null}
      />
      <TextIcon
        label={repliesBtnText}
        iconType="comments"
        iconSize="md"
        clickable={true}
        onClick={handleRepliesClick}
      />
    </Box>
  );
};

export default CardActions;
