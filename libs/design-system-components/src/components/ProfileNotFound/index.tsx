import React from 'react';

import { Button } from '@akashaorg/ui/lib/akasha-components/button';
import { Card } from '@akashaorg/ui/lib/akasha-components/card';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';

import Default404Image from '../Default404Image';

export type ProfileNotFoundProps = {
  titleLabel: string;
  buttonLabel: string;
  onClickGoToHomepage: () => void;
};

/**
 * Component used in the profile app when a profile associated witha  specific DID is not found
 * @param titleLabel - text for the title
 * @param buttonLabel - text for the button to navigate the user to homepage
 * @param onClickGoToHomepage - handler for homepage navigation
 */
const ProfileNotFound: React.FC<ProfileNotFoundProps> = ({
  titleLabel,
  buttonLabel,
  onClickGoToHomepage,
}) => {
  const publicImgPath = '/images';

  return (
    <Card className="p-2">
      <Stack direction="column" spacing="gap-y-4" fullWidth>
        <Stack direction="column">
          <Default404Image url={`${publicImgPath}/new404.webp`} />
          <Text variant={'h6'} align="center">
            {titleLabel}
          </Text>
        </Stack>
        <Stack direction="row" customStyle="pr-2 pb-2" justify="end" fullWidth>
          <Button onClick={onClickGoToHomepage}>{buttonLabel}</Button>
        </Stack>
      </Stack>
    </Card>
  );
};

export default ProfileNotFound;
