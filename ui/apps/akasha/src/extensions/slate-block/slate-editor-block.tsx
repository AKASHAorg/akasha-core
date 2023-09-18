import * as React from 'react';
import EditorBox from '@akashaorg/design-system-components/lib/components/Editor';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import {
  serializeSlateToBase64,
  useEditorBlocks,
  useLoggedIn,
  useRootComponentProps,
} from '@akashaorg/ui-awf-hooks';
import { IEntryData, RootExtensionProps } from '@akashaorg/typings/lib/ui';
import { Draft } from '../inline-editor/utils';
import { useCreateContentBlockMutation } from '@akashaorg/ui-awf-hooks/lib/generated/hooks-new';
import {
  AkashaContentBlockBlockDef,
  AkashaContentBlockLabeledValueInput,
} from '@akashaorg/typings/lib/sdk/graphql-types-new';
import { EditorBlock } from '@akashaorg/typings/lib/ui/editor-blocks';

// @TODO: replace this with actual data
const TEST_APP_VERSION_ID = 'kjzl6kcym7w8y5yp2ew8mc4ryswawpn914fm6qhe6bpoobipgu9r1pcwsu441cf';

export const SlateEditorBlock = () => {
  const { uiEvents, extensionData } = useRootComponentProps<RootExtensionProps>();
  const { loggedInProfileId } = useLoggedIn();
  const createContentBlock = useCreateContentBlockMutation();
  const postDraft = new Draft<IEntryData['slateContent']>({
    storage: localStorage,
    appName: extensionData.block['appName'],
    userId: loggedInProfileId,
    action: 'post',
  });
  const canSaveDraft = !extensionData.readonly; //action === 'post' || action === 'repost';
  const draftPostData = canSaveDraft ? postDraft.get() : null;

  const [editorState, setEditorState] = React.useState(draftPostData);

  const blockData = React.useMemo(() => extensionData.block as EditorBlock, [extensionData]);

  useEditorBlocks({
    uiEvents,
    blockData,
    blockState: editorState,
    onBlockCreate: async blockState => {
      const content = serializeSlateToBase64(blockState);
      const contentBlockValue: AkashaContentBlockLabeledValueInput = {
        label: blockData['appName'],
        propertyType: blockData['name'],
        value: content,
      };
      try {
        const resp = await createContentBlock.mutateAsync({
          i: {
            content: {
              // @TODO: replace this mock appVersionID
              appVersionID: TEST_APP_VERSION_ID,
              createdAt: new Date().toISOString(),
              content: [contentBlockValue],
              active: true,
              kind: AkashaContentBlockBlockDef.Text,
            },
          },
        });
        return { blockID: resp.createAkashaContentBlock.document.id };
      } catch (err) {
        console.error(err);
        return {
          error: err.message,
        };
      }
    },
  });

  return (
    <EditorBox
      // ref={editorRef}
      // avatar={avatar}
      profileId={'profileId'}
      // postLabel={''}
      placeholderLabel={'write here'}
      // disablePublishLabel={disablePublishLabel}
      // disablePublish={disablePublish}
      onPublish={() => {
        // void
      }}
      // handleSaveImagesDraft={handleSaveImagesDraft}
      // handleSaveLinkPreviewDraft={handleSaveLinkPreviewDraft}
      // linkPreview={linkPreview}
      // getLinkPreview={getLinkPreview}
      getMentions={() => {
        //void
      }}
      getTags={() => {
        // void
      }}
      // mentions={mentions}
      // tags={tags}
      // uploadRequest={uploadRequest}
      // uploadedImages={uploadedImages}
      withMeter={false}
      editorState={editorState}
      setEditorState={(value: IEntryData['slateContent']) => {
        // if (canSaveDraft) {
        //   if (isEqual(value, editorDefaultValue)) {
        //     postDraft.clear();
        //     return;
        //   }
        //   postDraft.save({ ...postDraft.get(), slateContent: value });
        // }
        setEditorState(value);
      }}
      // cancelButtonLabel={cancelButtonLabel}
      // onCancelClick={onCancelClick}
      showCancelButton={false}
      showPostButton={false}
      // embedEntryData={embedEntryData}
      // showDraft={showDraft}
      // onClear={onClear}
    />
  );
};
