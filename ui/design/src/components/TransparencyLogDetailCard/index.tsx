import * as React from 'react';
import { Box, Text } from 'grommet';
import styled from 'styled-components';
import { isMobileOnly } from 'react-device-detect';

import Icon from '../Icon';
import Avatar from '../Avatar';
import { StyledAnchor } from '../EntryCard/basic-card-box';
import { ITransparencyLogMiniCardProps } from '../TransparencyLogMiniCard';

import { StyledText } from '../ListModal/styled-modal';
import { formatRelativeTime } from '../../utils/time';

export interface ITransparencyLogDetailCardProps
  extends Omit<ITransparencyLogMiniCardProps, 'isSelected'> {
  reportedTimesLabel: string;
  viewItemLabel: string;
  viewItemLink: string;
  reasonsLabel: string;
  reasons: string[];
  explanationLabel: string;
  contactModeratorsLabel: string;
  contactModeratorsLink: string;
  onClickArrowLeft: () => void;
  onClickViewItem: () => void;
  onClickAvatar: () => void;
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
    viewItemLink,
    viewItemLabel,
    reasonsLabel,
    explanationLabel,
    contactModeratorsLabel,
    contactModeratorsLink,
    moderatorAvatarUrl,
    reportedTimesLabel,
    moderatedTimestamp,
    moderatorEthAddress,
    onClickArrowLeft,
    onClickViewItem,
    onClickAvatar,
  } = props;

  const handleClickViewItem = (e: React.SyntheticEvent) => {
    e.preventDefault();
    return onClickViewItem();
  };

  return (
    <Box
      pad={{ vertical: 'medium', left: 'medium' }}
      style={{ ...(isMobileOnly && { height: '100vh' }) }} // fills the available height in absolute positioning for mobile
    >
      <Box
        pad={{ bottom: 'large', right: 'medium' }}
        border={{ color: 'border', side: 'bottom', style: 'solid' }}
      >
        {isMobileOnly && (
          <Box direction="row" margin={{ top: 'small', bottom: 'medium' }} align="start">
            <Icon
              type="arrowLeft"
              color="secondaryText"
              clickable={true}
              onClick={onClickArrowLeft}
            />
            <Box direction="row" align="center" margin="0 auto" pad={{ right: 'small' }}>
              <Box
                width="8px"
                height="8px"
                margin={{ right: 'small' }}
                round="50%"
                background={isDelisted ? 'red' : 'green'}
              />
              <Text weight={600} size="large">
                {/* condition: title must always be three-word phrase for this component, pick the first two to show as heading on mobile */}
                {title
                  .split(' ')
                  .slice(0, 2)
                  .map(el => `${el.charAt(0).toUpperCase()}${el.substring(1)}`)
                  .join(' ')}
              </Text>
            </Box>
          </Box>
        )}
        <Box direction="row" margin={{ top: 'small' }} justify="between">
          <Text size="large" weight="bold">
            {reportedTimesLabel}
          </Text>
          {!isDelisted && (
            <StyledAnchor
              href={viewItemLink}
              onClick={handleClickViewItem}
              label={
                <Box direction="row">
                  <Icon type="quote" accentColor={true} clickable={true} />
                  <Text
                    color="accentText"
                    size="medium"
                    weight="normal"
                    margin={{ left: '0.25rem' }}
                  >
                    {viewItemLabel}
                  </Text>
                </Box>
              }
            />
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
                  margin={{ right: 'xsmall' }}
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
      <StyledAnchor
        href={contactModeratorsLink}
        style={{ textDecoration: 'none' }}
        label={
          <Box direction="row" margin={{ top: 'large' }} pad={{ bottom: 'large', right: 'medium' }}>
            <Icon type="feedback" accentColor={true} clickable={true} />
            <Text color="accentText" margin={{ top: '0.15rem', left: '0.25rem' }} weight="normal">
              {contactModeratorsLabel}
            </Text>
          </Box>
        }
      />
    </Box>
  );
};

export default TransparencyLogDetailCard;
