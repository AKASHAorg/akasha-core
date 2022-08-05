import React from 'react';
import DS from '@akashaorg/design-system';

import { topics } from './dummy-data';

const { Box, Button, Text, MainAreaCardBox, Icon } = DS;

export interface IStepThreeProps {
  titleLabel: string;
  textLine1Label: string;
  readArticleLabel: string;
  writeFirstArticleLabel: string;
  selectedTopics: string[];
  onClickIcon: () => void;
  onClickTopic: (topic: string) => () => void;
  onClickReadArticle: () => void;
  onClickWriteArticle: () => void;
}

const StepThree: React.FC<IStepThreeProps> = props => {
  const {
    titleLabel,
    textLine1Label,
    readArticleLabel,
    writeFirstArticleLabel,
    selectedTopics,
    onClickIcon,
    onClickTopic,
    onClickReadArticle,
    onClickWriteArticle,
  } = props;

  return (
    <MainAreaCardBox margin={{ bottom: '1rem' }}>
      <Box align="start" fill="horizontal" pad="medium">
        <Box direction="row" fill="horizontal" margin={{ bottom: 'medium' }}>
          <Icon type="chevronLeft" style={{ cursor: 'pointer' }} onClick={onClickIcon} />
          <Text size="xlarge" weight="bold">
            {titleLabel}
          </Text>
        </Box>
        <Text size="large" margin={{ bottom: 'xsmall' }}>
          {textLine1Label}
        </Text>
        <Box
          direction="row"
          wrap={true}
          gap="xsmall"
          pad={{ horizontal: 'large', vertical: 'medium' }}
        >
          {topics.map((topic, idx) => (
            <Box
              key={idx}
              direction="row"
              round="1rem"
              gap="xxsmall"
              margin={{ bottom: 'small' }}
              pad={{
                horizontal: selectedTopics.includes(topic) ? 'xxsmall' : 'xsmall',
                vertical: '1.5px',
              }}
              border={{ color: selectedTopics.includes(topic) ? 'accentText' : 'secondaryText' }}
              style={{ cursor: 'pointer' }}
              onClick={onClickTopic(topic)}
            >
              <Text color={selectedTopics.includes(topic) ? 'primaryText' : 'secondaryText'}>
                {topic}
              </Text>
              {selectedTopics.includes(topic) && <Icon type="close" />}
            </Box>
          ))}
        </Box>
        <Box direction="row" fill="horizontal" justify="end" align="center" gap="small">
          <Button size="large" height={2.5} label={readArticleLabel} onClick={onClickReadArticle} />
          <Button
            size="large"
            height={2.5}
            primary={true}
            label={writeFirstArticleLabel}
            onClick={onClickWriteArticle}
          />
        </Box>
      </Box>
    </MainAreaCardBox>
  );
};

export default StepThree;
