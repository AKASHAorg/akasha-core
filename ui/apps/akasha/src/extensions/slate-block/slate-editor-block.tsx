import React, { useImperativeHandle } from 'react';
import EditorBox from '@akashaorg/design-system-components/lib/components/Editor';
import {
  serializeSlateToBase64,
  transformSource,
  useGetLogin,
  useRootComponentProps,
} from '@akashaorg/ui-awf-hooks';
import type {
  BlockInstanceMethods,
  ContentBlockRootProps,
  IEntryData,
  RootExtensionProps,
} from '@akashaorg/typings/lib/ui';
import { Draft } from '../../utils';
import {
  AkashaContentBlockBlockDef,
  type AkashaContentBlockLabeledValueInput,
} from '@akashaorg/typings/lib/sdk/graphql-types-new';
import { useCreateContentBlockMutation } from '@akashaorg/ui-awf-hooks/lib/generated/apollo';
import getSDK from '@akashaorg/awf-sdk';

// @TODO: replace this with actual data
const TEST_APP_VERSION_ID = 'kjzl6kcym7w8y8af3kd0lwkkk2m1nxtchlvcikbak748md3m3gplz1ori3s1j5f';

export const SlateEditorBlock = (
  props: ContentBlockRootProps & { blockRef?: React.RefObject<BlockInstanceMethods> },
) => {
  const { name } = useRootComponentProps<RootExtensionProps>();
  const { data } = useGetLogin();
  const authenticatedDID = data?.id;
  const retryCount = React.useRef<number>();
  const sdk = React.useRef(getSDK());

  const [createContentBlock, contentBlockQuery] = useCreateContentBlockMutation();

  const postDraft = new Draft<IEntryData['slateContent']>({
    storage: localStorage,
    appName: name,
    userId: authenticatedDID,
    action: 'post',
  });

  const canSaveDraft = !props.blockInfo.mode; //action === 'post' || action === 'repost';
  const draftPostData = canSaveDraft ? postDraft.get() : null;

  const [editorState, setEditorState] = React.useState(draftPostData);

  const createBlock = React.useCallback(async () => {
    const content = serializeSlateToBase64(editorState);
    const contentBlockValue: AkashaContentBlockLabeledValueInput = {
      label: props.blockInfo.appName,
      propertyType: props.blockInfo.propertyType,
      value: content,
    };
    try {
      const resp = await createContentBlock({
        variables: {
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
        },
        context: { source: sdk.current.services.gql.contextSources.composeDB },
      });
      return {
        response: { blockID: resp.data.createAkashaContentBlock.document.id },
        blockInfo: props.blockInfo,
        retryCount: retryCount.current,
      };
    } catch (err) {
      console.error('error creating content block', err);
      return {
        response: {
          blockID: null,
          error: err.message,
        },
        blockInfo: props.blockInfo,
        retryCount: retryCount.current,
      };
    }
  }, [createContentBlock, editorState, props.blockInfo]);

  const retryCreate = React.useCallback(() => {
    if (contentBlockQuery.called) {
      contentBlockQuery.reset();
    }
    retryCount.current += 1;
    return createBlock();
  }, [contentBlockQuery, createBlock]);

  useImperativeHandle(
    props.blockRef,
    () => ({
      createBlock,
      retryBlockCreation: retryCreate,
    }),
    [createBlock, retryCreate],
  );

  return (
    <EditorBox
      // ref={editorRef}
      showAvatar={false}
      profileId={'profileId'}
      placeholderLabel={'write here'}
      onPublish={() => {
        // void
      }}
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
      withMeter={true}
      withToolbar={true}
      editorState={editorState}
      setEditorState={(value: IEntryData['slateContent']) => {
        setEditorState(value);
      }}
      showCancelButton={false}
      showPostButton={false}
      transformSource={transformSource}
      handleDisablePublish={props.blockInfo?.externalHandler}
    />
  );
};
