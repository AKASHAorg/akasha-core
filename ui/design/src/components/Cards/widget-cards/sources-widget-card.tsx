import { Box, Text } from 'grommet';
import * as React from 'react';
import { WidgetAreaCardBox } from '../common/basic-card-box';
import { Icon } from '../../Icon';

export interface ISourceWidgetCardProps {
  className?: string;
  titleLabel: string;
  tagsNumber: number;
  profilesNumber: number;
  appsNumber: number;
}

const SourcesWidgetCard: React.FC<ISourceWidgetCardProps> = props => {
  const { className, titleLabel, tagsNumber, profilesNumber, appsNumber } = props;

  return (
    <WidgetAreaCardBox className={className}>
      <Box justify="between" pad="medium" direction="row" align="center">
        <Text size="large" weight="bold">
          {titleLabel}
        </Text>

        <Box justify="between" align="center" direction="row" gap="small">
          <Box gap="xxsmall" direction="row">
            <Icon type="hashtag" primaryColor={true} size="xs" />
            <Text color="accentText" size="medium">
              {tagsNumber}
            </Text>
          </Box>
          <Box gap="xxsmall" direction="row">
            <Icon type="following" primaryColor={true} size="xs" />
            <Text color="accentText" size="medium">
              {profilesNumber}
            </Text>
          </Box>
          <Box gap="xxsmall" direction="row">
            <Icon type="ethereum" primaryColor={true} size="xs" />
            <Text color="accentText" size="medium">
              {appsNumber}
            </Text>
          </Box>
        </Box>
      </Box>
    </WidgetAreaCardBox>
  );
};

export default SourcesWidgetCard;
