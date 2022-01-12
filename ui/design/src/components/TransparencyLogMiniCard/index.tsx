import * as React from 'react';
import styled from 'styled-components';
import { Box, Text } from 'grommet';

import Avatar from '../Avatar';
import { MainAreaCardBox } from '../EntryCard/basic-card-box';
import { formatRelativeTime, ILocale } from '../../utils/time';
import Tooltip from '../Tooltip';

export interface ITransparencyLogMiniCardProps {
  locale: ILocale;
  title: string;
  content: string;
  isSelected: boolean;
  isDelisted: boolean;
  moderatedTimestamp: string;
  moderatorAvatarUrl: string;
  moderatorEthAddress: string;
  moderator: string;
  onClickAvatar?: () => void;
  onClickCard?: () => void;
}

const ClampBox = styled(Box)`
  max-height: 3.2em;
  width: 100%;
  overflow: hidden;
  position: relative;
  ::before {
    position: absolute;
  }
`;

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
    moderator,
    onClickAvatar,
    onClickCard,
  } = props;
  return (
    <MainAreaCardBox
      noBorderRadius={true}
      isSelected={isSelected}
      style={{ minHeight: 'min-content' }} // allows cards to adjust in a y-scrollable container
    >
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
            <Tooltip
              dropProps={{ align: { right: 'left' } }}
              message={moderator}
              plain={true}
              caretPosition={'right'}
            >
              <span>
                <Avatar
                  size="xs"
                  src={moderatorAvatarUrl}
                  ethAddress={moderatorEthAddress}
                  onClick={onClickAvatar}
                />
              </span>
            </Tooltip>
          </Box>
        </Box>
        <Box direction="row" justify="between" align="start">
          <ClampBox>
            <Text margin={{ top: 'small' }} color="secondaryText">
              {content}
            </Text>
          </ClampBox>
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
