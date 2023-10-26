import React, { MouseEventHandler } from 'react';
import Avatar from '@akashaorg/design-system-core/lib/components/Avatar';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import { Profile } from '@akashaorg/typings/lib/ui';

export type EditorPlaceholderType = {
  avatar?: Profile['avatar'];
  profileId: string | null;
  placeholderLabel?: string;
  buttonLabel?: string;
  onClick?: MouseEventHandler<HTMLElement>;
};

const EditorPlaceholder: React.FC<EditorPlaceholderType> = props => {
  const { avatar, profileId, placeholderLabel, buttonLabel, onClick } = props;
  return (
    <Card border={true} padding={0}>
      <Stack direction="row" justify="between" customStyle="px-4 py-2">
        <Button onClick={onClick} plain customStyle="grow">
          <Stack direction="row" align="center" spacing="gap-4">
            <Avatar avatar={avatar} profileId={profileId} size="sm" />
            <Text variant="subtitle2" truncate={true}>
              {placeholderLabel}
            </Text>
          </Stack>
        </Button>
        <Button variant="primary" disabled={true} label={buttonLabel} size="sm" />
      </Stack>
    </Card>
  );
};

export default EditorPlaceholder;
