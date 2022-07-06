import React from 'react';
import { Box, Text } from 'grommet';
import { CSSProperties } from 'styled-components';

import { ReleaseInfo } from '@akashaorg/ui-awf-typings';

import Icon from '../Icon';
import { MainAreaCardBox } from '../EntryCard/basic-card-box';
import { BackgroundDiv } from '../SubtitleTextIcon/styled-subtitle-text-icon';

export interface IProfileSubCardProps {
  className?: string;
  titleLabel: string;
  ctaLabel: string;
  apps: ReleaseInfo[];
  onCTAClick?: () => void;
  onAppClick?: (appId: string) => void;
}

const textStyles: CSSProperties = {
  width: '190px',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  letterSpacing: '0.02rem',
};

const ProfileSubCard: React.FC<IProfileSubCardProps> = props => {
  const { className, titleLabel, ctaLabel, apps, onCTAClick, onAppClick } = props;

  const handleCTAClick = () => {
    if (onCTAClick) {
      onCTAClick();
    }
  };

  const handleAppClick = (appId: string) => () => {
    if (onAppClick) {
      onAppClick(appId);
    }
  };

  return (
    <MainAreaCardBox className={className}>
      <Box>
        <Box
          direction="row"
          justify="between"
          pad="medium"
          border={{ side: 'bottom', color: 'border' }}
        >
          <Box direction="row" gap="small" align="center">
            <Text size="large" weight="bold" color="primaryText">
              {titleLabel}
            </Text>
            <Text color="secondaryText" style={{ fontSize: '1rem' }}>
              {apps.length}
            </Text>
          </Box>
          <Text
            size="large"
            color="accentText"
            style={{ cursor: 'pointer' }}
            onClick={handleCTAClick}
          >
            {ctaLabel}
          </Text>
        </Box>
        {apps.length > 0 &&
          apps.slice(0, 2).map((app, id) => (
            <Box
              key={id}
              direction="row"
              border={id !== apps.length - 1 ? { side: 'bottom' } : null}
              pad={{ horizontal: 'medium', vertical: 'small' }}
              onClick={handleAppClick(app.integrationID)}
            >
              <Box direction="row" width="100%" pad="none" align="center">
                <BackgroundDiv backgroundColor={true}>
                  <Icon size="lg" type="integrationAppLarge" plain={true} />
                </BackgroundDiv>
                <Box>
                  <Text size="large" weight={600} style={textStyles}>
                    {app.name}
                  </Text>
                  <Text size="large" color="secondaryText" style={textStyles}>
                    {app.integrationID}
                  </Text>
                </Box>
              </Box>
            </Box>
          ))}
      </Box>
    </MainAreaCardBox>
  );
};

export default ProfileSubCard;
