import * as React from 'react';
import { Box, Text } from 'grommet';

import Avatar from '../Avatar';
import { MainAreaCardBox } from '../EntryCard/basic-card-box';
import { formatRelativeTime, ILocale } from '../../utils/time';

export interface ITransparencyLogMiniCardProps {
  locale: ILocale;
  title: string;
  content: string;
  isSelected: boolean;
  isDelisted: boolean;
  moderatedTimestamp: string;
  moderatorAvatarUrl: string;
  moderatorEthAddress: string;
  onClickAvatar?: () => void;
  onClickCard?: () => void;
}

const TransparencyLogMiniCard: React.FC<ITransparencyLogMiniCardProps> = props => {
  const {
    locale,
    title,
    content,
    isSelected,
    isDelisted,
    moderatedTimestamp,
    moderatorAvatarUrl,
    moderatorEthAddress,
    onClickAvatar,
    onClickCard,
  } = props;
  return (
    <MainAreaCardBox noBorderRadius={true} isSelected={isSelected}>
      <Box pad="medium" onClick={onClickCard} style={{ cursor: 'pointer' }}>
        <Box direction="row" justify="between" align="center">
          <Box direction="row" align="center" pad={{ right: 'small' }}>
            <Box
              width="8px"
              height="8px"
              margin={{ right: 'xsmall' }}
              round="50%"
              background={isDelisted ? 'red' : 'green'}
            />
            <Text size="large" weight="bold">
              {title}
            </Text>
          </Box>
          <Box margin={{ left: 'xsmall' }} flex={{ shrink: 0 }}>
            <Avatar
              size="xs"
              src={moderatorAvatarUrl}
              ethAddress={moderatorEthAddress}
              onClick={onClickAvatar}
            />
          </Box>
        </Box>
        <Box direction="row" justify="between" align="start">
          <Box>
            <Text margin={{ top: 'small' }} color="secondaryText">
              {content.length > 95 ? `${content.substring(0, 95)}...` : content}
            </Text>
          </Box>
          <Box pad={{ left: 'small' }} flex={{ shrink: 0 }}>
            <Text
              size="small"
              margin={{ top: 'small' }}
              color="secondaryText"
              style={{ textAlign: 'right' }}
            >
              {formatRelativeTime(moderatedTimestamp, locale)}
            </Text>
          </Box>
        </Box>
      </Box>
    </MainAreaCardBox>
  );
};

export default TransparencyLogMiniCard;
