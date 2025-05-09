import { Button } from '@akashaorg/ui/lib/akasha-components/button';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import React from 'react';
import { EyeOffIcon } from 'lucide-react';
import { Card } from '@akashaorg/ui/lib/akasha-components/card';

export type NSFWProps = {
  sensitiveContentLabel: string;
  clickToViewLabel: string;
  onClickToView: (event: React.SyntheticEvent<HTMLButtonElement>) => void;
};

const NSFW: React.FC<NSFWProps> = props => {
  const { sensitiveContentLabel, clickToViewLabel, onClickToView } = props;
  return (
    <Card className="w-full p-4 flex place-content-center bg-muted">
      <Card className={'max-w-min'}>
        <Stack direction={'row'} alignItems="center" spacing={2}>
          <EyeOffIcon className="h-5 w-5 [&>*]:stroke-errorLight dark:[&>*]:stroke-errorDark" />
          <Text
            variant="button-sm"
            color={{ light: 'errorLight', dark: 'errorDark' }}
            customStyle="whitespace-nowrap"
          >
            {sensitiveContentLabel}
          </Text>
        </Stack>
        <Button variant="link" onClick={onClickToView}>
          {clickToViewLabel}
        </Button>
      </Card>
    </Card>
  );
};

export default NSFW;
