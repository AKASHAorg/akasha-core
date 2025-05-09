import { Button } from '@akashaorg/ui/lib/akasha-components/button';

import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import React from 'react';
import { EyeOffIcon } from 'lucide-react';

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
        <EyeOffIcon className="h-5 w-5 [&>*]:stroke-errorLight dark:[&>*]:stroke-errorDark" />
        <Text variant="h6" color="errorLight">
          {sensitiveContentLabel}
        </Text>
      </Stack>
      <Stack>
        <Text variant="body1" align="center">
          {descriptionFirstLine}
        </Text>
        <Text variant="body1" align="center">
          {descriptionSecondLine}
        </Text>
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
