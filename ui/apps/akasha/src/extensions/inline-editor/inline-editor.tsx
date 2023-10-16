import React from 'react';
import { EntityTypes, RootExtensionProps } from '@akashaorg/typings/lib/ui';
import { ReflectionEditor } from './reflection-editor';
import { IDraftStorage } from './utils';

export type InlineEditorExtensionData = {
  action: 'reply' | 'edit' | 'reflect' | 'repost';
  itemId: string;
  itemType: EntityTypes;
};

export const InlineEditor = (
  props: Partial<RootExtensionProps<InlineEditorExtensionData>> & { draftStorage?: IDraftStorage },
) => {
  const { extensionData } = props;
  const { action, itemId, itemType } = extensionData;

  if (itemType === EntityTypes.REFLECT && itemId && (action === 'reflect' || action === 'edit')) {
    return <ReflectionEditor beamId={itemId} action={action} />;
  }

  throw new Error('Unknown action used');
};
