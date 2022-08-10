import React from 'react';

import DS from '@akashaorg/design-system';
import { StyledButton } from './styled';

const { Box, Icon, MainAreaCardBox, Text } = DS;

export interface IArticlesSettingsProps {
  titleLabel: string;
  subscribedTopicsTitleLabel: string;
  subscribedTopicsSubtitleLabel: string;
  subscribedTopics: string[];
  uninstallLabel: string;
  onClickCloseSettings: () => void;
  onClickTopic: (topic: string) => () => void;
  onClickUninstall: () => void;
}

const ArticlesSettings: React.FC<IArticlesSettingsProps> = props => {
  const {
    titleLabel,
    subscribedTopicsTitleLabel,
    subscribedTopicsSubtitleLabel,
    subscribedTopics,
    uninstallLabel,
    onClickCloseSettings,
    onClickTopic,
    onClickUninstall,
  } = props;
  return (
    <MainAreaCardBox>
      <Box
        direction="row"
        fill="horizontal"
        pad="medium"
        border={{ color: 'border', side: 'bottom' }}
      >
        <Icon type="close" style={{ cursor: 'pointer' }} onClick={onClickCloseSettings} />
        <Text size="xlarge" weight="bold" margin={{ vertical: '0', horizontal: 'auto' }}>
          {titleLabel}
        </Text>
      </Box>
      <Box pad="medium" border={{ color: 'border', side: 'bottom' }} gap="xsmall">
        <Text size="large" weight="bold">
          {subscribedTopicsTitleLabel}:
        </Text>
        <Text size="medium" color="secondaryText">
          {subscribedTopicsSubtitleLabel}
        </Text>
        <Box direction="row" wrap={true} gap="xsmall">
          {subscribedTopics.map((topic, idx) => (
            <Box
              key={idx}
              direction="row"
              round="1rem"
              gap="xxsmall"
              margin={{ bottom: 'small' }}
              pad={{
                horizontal: 'xxsmall',
                vertical: '1.5px',
              }}
              border={{ color: 'accentText' }}
              style={{ cursor: 'pointer' }}
              onClick={onClickTopic(topic)}
            >
              <Text color={'primaryText'}>{topic}</Text>
              <Icon type="close" />
            </Box>
          ))}
        </Box>
      </Box>
      <Box direction="row" fill="horizontal" justify="end" align="center" pad="medium">
        <StyledButton
          size="large"
          height={2.5}
          label={
            <Box direction="row" gap="xsmall">
              <Icon type="close" accentColor={true} />
              <Text size="large">{uninstallLabel}</Text>
            </Box>
          }
          onClick={onClickUninstall}
        />
      </Box>
    </MainAreaCardBox>
  );
};

export default ArticlesSettings;
