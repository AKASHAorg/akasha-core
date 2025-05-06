import { Button } from '@akashaorg/ui/lib/akasha-components/button';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
import React from 'react';
import { EyeSlashIcon } from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';
export type NSFWProps = {
  sensitiveContentLabel: string;
  descriptionFirstLine: string;
  descriptionSecondLine: string;
  clickToViewLabel: string;
  cancelLabel: string;
  onCancel: (event: React.SyntheticEvent<HTMLButtonElement>) => void;
  onClickToView: (event: React.SyntheticEvent<HTMLButtonElement>) => void;
};
const NSFW: React.FC<NSFWProps> = props => {
  const {
    sensitiveContentLabel,
    clickToViewLabel,
    descriptionFirstLine,
    descriptionSecondLine,
    cancelLabel,
    onCancel,
    onClickToView,
  } = props;
  return (
    <Stack alignItems="center" justifyContent="center" spacing={2}>
      <Stack direction="row" spacing={1}>
        <Icon icon={<EyeSlashIcon />} customStyle="[&>*]:stroke-errorLight" />
        <Typography variant="h6" className="text-errorLight">
          {sensitiveContentLabel}
        </Typography>
      </Stack>
      <Stack>
        <Typography className="text-center">{descriptionFirstLine}</Typography>
        <Typography className="text-center">{descriptionSecondLine}</Typography>
      </Stack>
      <Stack direction="row" spacing={4}>
        <Button variant="outline" onClick={onCancel}>
          {cancelLabel}
        </Button>
        <Button onClick={onClickToView}>{clickToViewLabel}</Button>
      </Stack>
    </Stack>
  );
};
export default NSFW;
