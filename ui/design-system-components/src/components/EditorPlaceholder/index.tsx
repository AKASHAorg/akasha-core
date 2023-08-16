import * as React from 'react';
import Avatar from '@akashaorg/design-system-core/lib/components/Avatar';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import { Profile } from '@akashaorg/typings/ui';
import { tw } from '@twind/core';

export interface IEditorPlaceholder {
  avatar?: Profile['avatar'];
  profileId: string | null;
  placeholderLabel?: string;
  replyLabel?: string;
  onClick?: React.MouseEventHandler<HTMLElement>;
}

const EditorPlaceholder: React.FC<IEditorPlaceholder> = props => {
  const { avatar, profileId, placeholderLabel, replyLabel, onClick } = props;
  return (
    <Card border={true} padding="none">
      <button onClick={onClick}>
        <div className={tw(`flex justify-between px-4 py-2 `)}>
          <div className={tw(`flex flex-row items-center gap-4`)}>
            <Avatar avatar={avatar} profileId={profileId} size="sm" />
            <Text variant="subtitle2" truncate={true}>
              {placeholderLabel}
            </Text>
          </div>

          <Button variant="primary" disabled={true} label={replyLabel} size="sm" />
        </div>
      </button>
    </Card>
  );
};

EditorPlaceholder.defaultProps = {
  placeholderLabel: 'Share your thoughts',
};

export default EditorPlaceholder;
