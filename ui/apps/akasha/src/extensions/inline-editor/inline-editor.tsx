import React from 'react';
import { EntityTypes, RootExtensionProps } from '@akashaorg/typings/lib/ui';
import { ReflectionEditor } from './reflection-editor';
import { IDraftStorage } from './utils';

export const InlineEditor = (
  props: Partial<RootExtensionProps> & { draftStorage?: IDraftStorage },
) => {
  const { extensionData } = props;
  const { action, itemId, itemType } = extensionData;

  if (itemType === EntityTypes.REFLECT && itemId && (action === 'reflect' || action === 'edit')) {
    return <ReflectionEditor beamId={itemId} action={action} />;
  }

  throw new Error('Unknown action used');
};
