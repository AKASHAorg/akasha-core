import { Button } from '@akashaorg/ui/lib/akasha-components/button';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
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
          <Typography
            variant="xs"
            bold
            className="text-errorLight dark:text-errorDark whitespace-nowrap"
          >
            {sensitiveContentLabel}
          </Typography>
        </Stack>
        <Button variant="link" onClick={onClickToView}>
          {clickToViewLabel}
        </Button>
      </Card>
    </Card>
  );
};
export default NSFW;
