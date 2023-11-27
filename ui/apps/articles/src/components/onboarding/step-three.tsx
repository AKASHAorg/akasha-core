import React from 'react';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import {
  ChevronLeftIcon,
  XMarkIcon,
} from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
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
    <Card customStyle="mb-2">
      <Stack fullWidth={true} align="start" customStyle="p-4">
        <Stack direction="row" fullWidth={true} customStyle="mb-4">
          <button onClick={onClickIcon}>
            <Icon icon={<ChevronLeftIcon />} />
          </button>
          <Text variant="h2">{titleLabel}</Text>
        </Stack>
        <Text variant="h6" customStyle="mb-1">
          {textLine1Label}
        </Text>
        <Stack direction="row" spacing="gap-1" customStyle="flex-wrap px-6 py-4">
          {topics.map((topic, idx) => (
            <button key={idx} onClick={onClickTopic(topic)}>
              <Stack
                direction="row"
                spacing="gap-0.5"
                customStyle={`rounded-lg px-1 py-0.5 border(${
                  selectedTopics.includes(topic)
                    ? 'secondaryLight dark:secondaryDark'
                    : 'grey8 dark:grey3'
                })`}
              >
                <Text variant={selectedTopics.includes(topic) ? 'body1' : 'subtitle1'}>
                  {topic}
                </Text>
                {selectedTopics.includes(topic) && <Icon icon={<XMarkIcon />} />}
              </Stack>
            </button>
          ))}
        </Stack>
        <Stack direction="row" fullWidth={true} align="center" justify="end" spacing="gap-2">
          <Button size="lg" label={readArticleLabel} onClick={onClickReadArticle} />
          <Button
            size="lg"
            variant="primary"
            label={writeFirstArticleLabel}
            onClick={onClickWriteArticle}
          />
        </Stack>
      </Stack>
    </Card>
  );
};

export default StepThree;
