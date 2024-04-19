import React, {
  RefObject,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
  useMemo,
} from 'react';
import EditorBox from '@akashaorg/design-system-components/lib/components/Editor';
import {
  encodeSlateToBase64,
  transformSource,
  useGetLogin,
  useRootComponentProps,
  useMentions,
} from '@akashaorg/ui-awf-hooks';
import { useTranslation } from 'react-i18next';
import type {
  BlockInstanceMethods,
  ContentBlockRootProps,
  CreateContentBlock,
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
const TEST_APP_VERSION_ID = 'k2t6wzhkhabz5ja6dy72fezemlrdc5akqebksfpjyxkyap6g4fqqimcpuf7bix';

export const SlateEditorBlock = (
  props: ContentBlockRootProps & { blockRef?: RefObject<BlockInstanceMethods> },
) => {
  const { name, logger } = useRootComponentProps<RootExtensionProps>();
  const { data } = useGetLogin();
  const authenticatedDID = data?.id;
  const retryCount = useRef<number>();
  const sdk = useRef(getSDK());

  const { t } = useTranslation('app-akasha-integration');

  const [createContentBlock, contentBlockQuery] = useCreateContentBlockMutation();

  const postDraft = new Draft<IEntryData['slateContent']>({
    storage: localStorage,
    appName: name,
    userId: authenticatedDID,
    action: 'post',
  });

  const canSaveDraft = !props.blockInfo.mode; //action === 'post' || action === 'repost';
  const draftPostData = canSaveDraft ? postDraft.get() : null;

  const [editorState, setEditorState] = useState(draftPostData);

  const createBlock = useCallback(
    async ({ nsfw }: CreateContentBlock) => {
      const content = encodeSlateToBase64(editorState);
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
                nsfw,
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
        logger.error('error creating content block', err);
        return {
          response: {
            blockID: null,
            error: err.message,
          },
          blockInfo: props.blockInfo,
          retryCount: retryCount.current,
        };
      }
    },
    [createContentBlock, editorState, props.blockInfo, logger],
  );

  const retryCreate = useCallback(
    (arg: CreateContentBlock) => {
      if (contentBlockQuery.called) {
        contentBlockQuery.reset();
      }
      retryCount.current += 1;
      return createBlock(arg);
    },
    [contentBlockQuery, createBlock],
  );

  useImperativeHandle(
    props.blockRef,
    () => ({
      createBlock,
      retryBlockCreation: retryCreate,
      handleFocusBlock,
    }),
    [createBlock, retryCreate],
  );

  const { setMentionQuery, mentions } = useMentions(authenticatedDID);
  const handleGetMentions = (query: string) => {
    setMentionQuery(query);
  };

  const [isFocusedEditor, setIsFocusedEditor] = useState(false);
  /**
   * this is used to display/hide elements only when a block instance is focused
   * must be exposed to outer components through useImperativeHandle
   * the logic for updating the currently focused block is in beam-editor
   */
  const handleFocusBlock = (focus: boolean) => {
    setIsFocusedEditor(focus);
  };

  return (
    <EditorBox
      showAvatar={false}
      profileId={'profileId'}
      placeholderLabel={'write here'}
      maxEncodedLengthErrLabel={t('Text block exceeds line limit, please review!')}
      noMentionsLabel={t('You are not following someone with that name')}
      getMentions={handleGetMentions}
      mentions={mentions}
      withMeter={isFocusedEditor}
      withToolbar={isFocusedEditor}
      editorState={editorState}
      setEditorState={(value: IEntryData['slateContent']) => {
        setEditorState(value);
      }}
      showCancelButton={false}
      showPostButton={false}
      transformSource={transformSource}
      handleDisablePublish={props.blockInfo?.externalHandler}
      encodingFunction={encodeSlateToBase64}
    />
  );
};
