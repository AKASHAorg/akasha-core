import React from 'react';

import Button from '@akashaorg/design-system-core/lib/components/Button';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';

import Default404Image from '../Default404Image';

export type ProfileNotFoundProps = {
  titleLabel: string;
  buttonLabel: string;
  onClickGoToHomepage: () => void;
};

const ProfileNotFound: React.FC<ProfileNotFoundProps> = ({
  titleLabel,
  buttonLabel,
  onClickGoToHomepage,
}) => {
  const publicImgPath = '/images';

  return (
    <Card customStyle={'flex flex-row'} elevation={'1'} radius={16} padding={'p-2'}>
      <Stack direction="column" spacing="gap-y-4" fullWidth>
        <Stack direction="column">
          <Default404Image url={`${publicImgPath}/new404.webp`} />
          <Text variant={'h6'} align="center">
            {titleLabel}
          </Text>
        </Stack>
        <Stack direction="row" customStyle="pr-2 pb-2" justify="end" fullWidth>
          <Button variant="primary" label={buttonLabel} onClick={onClickGoToHomepage} />
        </Stack>
      </Stack>
    </Card>
  );
};

export default ProfileNotFound;
