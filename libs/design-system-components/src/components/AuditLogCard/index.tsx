import * as React from 'react';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import Avatar from '@akashaorg/design-system-core/lib/components/Avatar';
import { Image } from '@akashaorg/typings/lib/ui';
import ProfileNameField from '@akashaorg/design-system-core/lib/components/ProfileNameField';

export type AuditLogCardProps = {
  changeAuthorProfileName: string;
  changeAuthorAvatar: Image;
  typeOfChange: string;
  dateOfChange: string;
  changeNotes: string;
};

const AuditLogCard: React.FC<AuditLogCardProps> = ({
  changeAuthorProfileName,
  changeAuthorAvatar,
  typeOfChange,
  dateOfChange,
  changeNotes,
}) => {
  return (
    <Stack spacing={4}>
      <Stack direction="row" alignItems="center" spacing={2}>
        <Avatar profileId={changeAuthorProfileName} avatar={changeAuthorAvatar} />
        <Stack direction="row" alignItems="center" spacing={2}>
          <ProfileNameField
            did="12102010201001"
            profileName={changeAuthorProfileName}
            truncateText={true}
          />
          <Text variant="footnotes2">-</Text>

          <Text variant="footnotes2">{typeOfChange}</Text>
        </Stack>
      </Stack>
      <Text variant="footnotes2">{changeNotes}</Text>
      <Text variant="footnotes2" color={{ light: 'grey4', dark: 'grey7' }}>
        {dateOfChange}
      </Text>
    </Stack>
  );
};

export default AuditLogCard;
