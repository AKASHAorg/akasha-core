import React from 'react';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import Box from '@akashaorg/design-system-core/lib/components/Box';
import Text from '@akashaorg/design-system-core/lib/components/Text';

import { apps } from '../dummy-data';

export interface IStepTwoProps {
  titleLabel: string;
  textLine1Label: string;
  skipLabel: string;
  nextLabel: string;
  onClickIcon: () => void;
  onClickSkip: () => void;
  onClickNext: () => void;
}

const StepTwo: React.FC<IStepTwoProps> = props => {
  const {
    titleLabel,
    textLine1Label,
    skipLabel,
    nextLabel,
    onClickIcon,
    onClickSkip,
    onClickNext,
  } = props;

  return (
    <Card customStyle="mb-4">
      <Box customStyle="flex items-start w-full p-4">
        <Box customStyle="flex flex-row w-full mb-4">
          <button onClick={onClickIcon}>
            <Icon type="ChevronLeftIcon" />{' '}
          </button>
          <Text variant="h2">{titleLabel}</Text>
        </Box>
        <Text variant="h6" customStyle="mb-1">
          {textLine1Label}
        </Text>
        <Box customStyle="flex my-4 gap-4">
          {apps.map((app, idx) => (
            <Box customStyle="flex flex-row items-center gap-1" key={idx}>
              <Box customStyle="flex rounded-sm p-2 bg(grey8 dark:grey3)">
                <Icon size="lg" type="CircleStackIcon" />
              </Box>
              <Box customStyle="flex gap-0.5">
                <Text variant="h2">{app.title}</Text>
                <Text variant="subtitle1">
                  @{app.author} · {app.type}
                </Text>
              </Box>
            </Box>
          ))}
        </Box>
        <Box customStyle="flex flex-row w-full justify-end items-center gap-2">
          <Button size="lg" label={skipLabel} onClick={onClickSkip} />
          <Button size="lg" variant="primary" label={nextLabel} onClick={onClickNext} />
        </Box>
      </Box>
    </Card>
  );
};

export default StepTwo;
