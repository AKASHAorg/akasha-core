import * as React from 'react';
import Avatar from '@akashaorg/design-system-core/lib/components/Avatar';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import { Profile } from '@akashaorg/typings/lib/ui';
import { tw } from '@twind/core';

export interface IEditorPlaceholder {
  avatar?: Profile['avatar'];
  profileId: string | null;
  placeholderLabel?: string;
  actionLabel?: string;
  onClick?: React.MouseEventHandler<HTMLElement>;
}

const EditorPlaceholder: React.FC<IEditorPlaceholder> = props => {
  const { avatar, profileId, placeholderLabel, actionLabel, onClick } = props;
  return (
    <Card border={true} padding={0} background={{ light: 'grey9', dark: 'grey3' }}>
      <div className={tw(`flex justify-between p-4 `)}>
        <div className={tw(`flex flex-row items-center gap-4`)}>
          <Avatar avatar={avatar} profileId={profileId} size="sm" />
          <Text variant="subtitle2" truncate={true}>
            {placeholderLabel}
          </Text>
        </div>

        <Button variant="primary" label={actionLabel} size="sm" onClick={onClick} />
      </div>
    </Card>
  );
};

EditorPlaceholder.defaultProps = {
  placeholderLabel: 'From Your Mind to the World 🧠 🌏 ✨',
};

export default EditorPlaceholder;
