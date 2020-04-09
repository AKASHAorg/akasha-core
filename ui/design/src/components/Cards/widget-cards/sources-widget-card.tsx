import { Box, Text } from 'grommet';
import * as React from 'react';
import { WidgetAreaCardBox } from '../common/basic-card-box';
import { IconLink } from '../../Buttons';

export interface ISourceWidgetCardProps {
  className?: string;
  titleLabel: string;
  seeAllLabel: string;
  hashtagsLabel: string;
  profilesLabel: string;
  totalLabel: string;
  tagsNumber: number;
  profilesNumber: number;
  totalNumber: number;
  onClickSeeAll: React.EventHandler<React.SyntheticEvent>;
}

const SourcesWidgetCard: React.FC<ISourceWidgetCardProps> = props => {
  const {
    className,
    titleLabel,
    seeAllLabel,
    hashtagsLabel,
    profilesLabel,
    totalLabel,
    onClickSeeAll,
    tagsNumber,
    profilesNumber,
    totalNumber,
  } = props;

  return (
    <WidgetAreaCardBox className={className}>
      <Box justify="between" pad="medium" direction="row" align="center">
        <Text weight="bold">{titleLabel}</Text>
        <IconLink label={seeAllLabel} onClick={onClickSeeAll} />
      </Box>

      <Box pad="medium" justify="evenly" align="center" direction="row">
        <Box align="start" gap="xsmall">
          <Text weight="bold" color="accentText" size="xxlarge">
            {tagsNumber}
          </Text>
          <Text> {hashtagsLabel}</Text>
        </Box>
        <Box align="start" gap="xsmall">
          <Text weight="bold" color="accentText" size="xxlarge">
            {profilesNumber}
          </Text>
          <Text> {profilesLabel}</Text>
        </Box>

        <Box align="start" gap="xsmall">
          <Text weight="bold" color="accentText" size="xxlarge">
            {totalNumber}
          </Text>
          <Text> {totalLabel}</Text>
        </Box>
      </Box>
    </WidgetAreaCardBox>
  );
};

export default SourcesWidgetCard;
