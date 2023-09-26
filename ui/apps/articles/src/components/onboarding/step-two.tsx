import React from 'react';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
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
      <Stack align="start" fullWidth={true} customStyle="p-4">
        <Stack direction="row" fullWidth={true} customStyle="mb-4">
          <button onClick={onClickIcon}>
            <Icon type="ChevronLeftIcon" />{' '}
          </button>
          <Text variant="h2">{titleLabel}</Text>
        </Stack>
        <Text variant="h6" customStyle="mb-1">
          {textLine1Label}
        </Text>
        <Stack spacing="gap-4" customStyle="my-4">
          {apps.map((app, idx) => (
            <Stack direction="row" align="center" spacing="gap-1" key={idx}>
              <Stack customStyle="flex rounded-sm p-2 bg(grey8 dark:grey3)">
                <Icon size="lg" type="CircleStackIcon" />
              </Stack>
              <Stack spacing="gap-0.5">
                <Text variant="h2">{app.title}</Text>
                <Text variant="subtitle1">
                  @{app.author} · {app.type}
                </Text>
              </Stack>
            </Stack>
          ))}
        </Stack>
        <Stack direction="row" fullWidth={true} align="center" justify="end" spacing="gap-2">
          <Button size="lg" label={skipLabel} onClick={onClickSkip} />
          <Button size="lg" variant="primary" label={nextLabel} onClick={onClickNext} />
        </Stack>
      </Stack>
    </Card>
  );
};

export default StepTwo;
