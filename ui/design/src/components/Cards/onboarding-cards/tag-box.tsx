import * as React from 'react';
import { ITag } from '../widget-cards/trending-widget-card';
import { SubtitleTextIcon } from '../../TextIcon';
import { Box } from 'grommet';
import { Button } from '../../Buttons';

export interface ITagBox {
  tag: ITag;
  mentionsLabel?: string;
  subscribeLabel?: string;
  subscribedLabel?: string;
  unsubscribelabel?: string;
  handleSubscribe: (tagName: string) => void;
}

const TagBox: React.FC<ITagBox> = props => {
  const { tag, mentionsLabel, subscribeLabel, handleSubscribe } = props;
  return (
    <Box direction="row" justify="evenly" pad="medium" align="center">
      <SubtitleTextIcon label={tag.tagName} subtitle={`${tag.postsNumber} ${mentionsLabel}`} />
      <Button label={subscribeLabel} onClick={handleSubscribe} />
    </Box>
  );
};

TagBox.defaultProps = {
  mentionsLabel: 'mentions',
  subscribeLabel: 'Subscribe',
  subscribedLabel: 'Subscribed',
  unsubscribelabel: 'Unsubscribe',
};

export { TagBox };
