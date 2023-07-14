import React from 'react';
import BasicCardBox from '@akashaorg/design-system-core/lib/components/BasicCardBox';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import Box from '@akashaorg/design-system-core/lib/components/Box';
import Text from '@akashaorg/design-system-core/lib/components/Text';

import { topics } from '../dummy-data';

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
    <BasicCardBox customStyle="mb-2">
      <Box customStyle="flex items-start w-full p-4">
        <Box customStyle="flex flex-row w-full mb-4">
          <button onClick={onClickIcon}>
            <Icon type="ChevronLeftIcon" />
          </button>
          <Text variant="h2">{titleLabel}</Text>
        </Box>
        <Text variant="h6" customStyle="mb-1">
          {textLine1Label}
        </Text>
        <Box customStyle="flex flex-row flex-wrap gap-1 px-6 py-4">
          {topics.map((topic, idx) => (
            <button key={idx} onClick={onClickTopic(topic)}>
              <Box
                customStyle={`flex flex-row rounded-lg gap-0.5 px-1 py-0.5 border(${
                  selectedTopics.includes(topic)
                    ? 'secondaryLight dark:secondaryDark'
                    : 'grey8 dark:grey3'
                })`}
              >
                <Text variant={selectedTopics.includes(topic) ? 'body1' : 'subtitle1'}>
                  {topic}
                </Text>
                {selectedTopics.includes(topic) && <Icon type="XMarkIcon" />}
              </Box>
            </button>
          ))}
        </Box>
        <Box customStyle="flex flex-row w-full justify-end items-center gap-2">
          <Button size="lg" label={readArticleLabel} onClick={onClickReadArticle} />
          <Button
            size="lg"
            variant="primary"
            label={writeFirstArticleLabel}
            onClick={onClickWriteArticle}
          />
        </Box>
      </Box>
    </BasicCardBox>
  );
};

export default StepThree;
