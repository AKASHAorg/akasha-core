import React from 'react';
import { RootExtensionProps } from '@akashaorg/typings/lib/ui';
import { ReflectionEditor, ReflectionEditorProps } from '../../components/reflection-editor';
import { IDraftStorage } from './utils';

export const InlineEditor = (
  props: Partial<RootExtensionProps<ReflectionEditorProps>> & { draftStorage?: IDraftStorage },
) => {
  const { extensionData } = props;
  const { action, beamId, reflectionId, content, showEditorInitialValue } = extensionData;
  const editProps = {
    beamId,
    reflectionId,
    content,
    showEditorInitialValue,
    action: 'edit' as const,
  };
  const reflectProps = { beamId, showEditorInitialValue, action: 'reflect' as const };

  if (beamId) {
    if (action === 'edit') return <ReflectionEditor {...editProps} />;
    if (action === 'reflect') return <ReflectionEditor {...reflectProps} />;
  }

  throw new Error('Unknown action used');
};
