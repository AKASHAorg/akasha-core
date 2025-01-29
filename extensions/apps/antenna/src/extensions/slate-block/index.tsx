import * as React from 'react';
import { I18nextProvider } from 'react-i18next';
import { useRootComponentProps, withProviders } from '@akashaorg/ui-core-hooks';

import {
  BlockInstanceMethods,
  ContentBlockModes,
  ContentBlockRootProps,
} from '@akashaorg/typings/lib/ui';
import { SlateEditorBlock } from './slate-editor-block';
import { SlateReadonlyBlock } from './slate-readonly-block';

const SlateBlockExtension = (
  props: ContentBlockRootProps & { blockRef?: React.RefObject<BlockInstanceMethods> },
) => {
  const { getTranslationPlugin } = useRootComponentProps();
  return (
    <I18nextProvider i18n={getTranslationPlugin().i18n}>
      {props.blockInfo.mode === ContentBlockModes.EDIT && <SlateEditorBlock {...props} />}
      {props.blockInfo.mode === ContentBlockModes.READONLY && <SlateReadonlyBlock {...props} />}
    </I18nextProvider>
  );
};
export default withProviders<ContentBlockRootProps>(SlateBlockExtension);
