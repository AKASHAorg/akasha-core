import * as React from 'react';
import { Box, Text } from 'grommet';
import styled from 'styled-components';

import Icon from '../Icon';
import Avatar from '../Avatar';
import { MainAreaCardBox } from '../EntryCard/basic-card-box';
import { ITransparencyLogMiniCardProps } from '../TransparencyLogMiniCard';

import { StyledText } from '../ListModal/styled-modal';
import { formatRelativeTime } from '../../utils/time';

export interface ITransparencyLogDetailCardProps
  extends Omit<ITransparencyLogMiniCardProps, 'isSelected'> {
  moderator: string;
  reportedTimesLabel: string;
  viewItemLabel: string;
  reasonsLabel: string;
  reasons: string[];
  explanationLabel: string;
  contactModeratorsLabel: string;
  onClickViewItem: () => void;
  onClickContactModerators: () => void;
}

const StyledBox = styled(Box)`
  background-color: ${props => props.theme.colors.accentLight};
`;

const TransparencyLogDetailCard: React.FC<ITransparencyLogDetailCardProps> = props => {
  const {
    title,
    locale,
    content,
    reasons,
    moderator,
    isDelisted,
    viewItemLabel,
    reasonsLabel,
    explanationLabel,
    contactModeratorsLabel,
    moderatorAvatarUrl,
    reportedTimesLabel,
    moderatedTimestamp,
    moderatorEthAddress,
    onClickViewItem,
    onClickAvatar,
    onClickContactModerators,
  } = props;

  return (
    <MainAreaCardBox pad={{ vertical: 'medium', left: 'medium' }} noBorderRadius={true}>
      <Box
        pad={{ bottom: 'large', right: 'medium' }}
        border={{ color: 'border', side: 'bottom', style: 'solid' }}
      >
        <Box direction="row" margin={{ top: 'small' }} justify="between">
          <Text size="large" weight="bold">
            {reportedTimesLabel}
          </Text>
          {!isDelisted && (
            <Box direction="row" onClick={onClickViewItem}>
              <Icon type="quote" accentColor={true} clickable={true} />
              <Text color="accentText" margin={{ left: '0.25rem' }}>
                {viewItemLabel}
              </Text>
            </Box>
          )}
        </Box>
        <StyledText margin={{ top: 'small' }} weight="normal" color="secondaryText" size="small">
          {reasonsLabel}
        </StyledText>
        <Box direction="row" wrap={true} align="center">
          {reasons.map((reason, idx) => (
            <StyledBox
              key={idx}
              margin={{ left: idx === 0 ? '0rem' : '0.2rem', bottom: '0.2rem' }}
              pad="0.2rem"
              round={'0.125rem'}
            >
              <Text as="span" color="accentText" size="large" weight={600}>
                {reason}
              </Text>
            </StyledBox>
          ))}
        </Box>
      </Box>
      <Box
        pad={{ bottom: 'large', right: 'medium' }}
        border={{ color: 'border', side: 'bottom', style: 'solid' }}
      >
        <Box margin={{ top: 'large' }} direction="row" justify="between" align="start">
          <Box direction="row">
            <Avatar
              src={moderatorAvatarUrl}
              ethAddress={moderatorEthAddress}
              onClick={onClickAvatar}
            />
            <Box margin={{ left: 'xsmall' }}>
              <Box direction="row" align="center" pad={{ right: 'small' }}>
                <Box
                  width="8px"
                  height="8px"
                  margin={{ right: 'xxsmall' }}
                  round="50%"
                  background={isDelisted ? 'red' : 'green'}
                />
                <Text size="medium">{title}</Text>
              </Box>
              <Text size="large" weight="bold">
                {moderator}
              </Text>
            </Box>
          </Box>
          <Box pad={{ left: 'small' }} flex={{ shrink: 0 }}>
            <Text color="secondaryText" style={{ textAlign: 'right' }}>
              {formatRelativeTime(moderatedTimestamp, locale)}
            </Text>
          </Box>
        </Box>
        <StyledText margin={{ top: 'small' }} weight="normal" color="secondaryText" size="small">
          {explanationLabel}
        </StyledText>
        <Text size="large" margin={{ top: 'xsmall' }} style={{ letterSpacing: '0.025em' }}>
          {content}
        </Text>
      </Box>
      <Box
        direction="row"
        margin={{ top: 'large' }}
        pad={{ bottom: 'large', right: 'medium' }}
        onClick={onClickContactModerators}
      >
        <Icon type="feedback" accentColor={true} clickable={true} />
        <Text color="accentText" margin={{ top: '0.25rem', left: '0.25rem' }}>
          {contactModeratorsLabel}
        </Text>
      </Box>
    </MainAreaCardBox>
  );
};

export default TransparencyLogDetailCard;
