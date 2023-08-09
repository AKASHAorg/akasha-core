import React from 'react';
import Default404Image from '../Default404Image';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';

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
    <Stack direction="column" spacing="gap-y-4" fullWidth>
      <Card direction="row" elevation={'1'} radius={16} padding={8}>
        <Stack direction="column" customStyle="mb-32">
          <Default404Image url={`${publicImgPath}/new404.webp`} />
          <Text variant={'h6'} align="center">
            {titleLabel}
          </Text>
        </Stack>
        <Stack direction="row" customStyle="pr-2 pb-2" justify="end" fullWidth>
          <Button variant="primary" label={buttonLabel} onClick={onClickGoToHomepage} />
        </Stack>
      </Card>
    </Stack>
  );
};

export default ProfileNotFound;
