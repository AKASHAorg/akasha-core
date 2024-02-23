import React from 'react';
import { type ContentBlockExtensionInterface, ContentBlockModes } from '@akashaorg/typings/lib/ui';
import { GetContentBlockByIdQuery } from '@akashaorg/typings/lib/sdk/graphql-operation-types-new';
import {
  ReadContentBlockExtension,
  ReadContentBlockExtensionProps,
} from './read-content-block-extension';
import {
  EditContentBlockExtension,
  EditContentBlockExtensionProps,
} from './edit-content-block-extension';

export type MatchingBlock = {
  blockInfo: ContentBlockExtensionInterface & {
    appName: string;
  };
  blockData?: GetContentBlockByIdQuery['node'];
  content?: unknown;
};

export type ContentBlockExtensionProps =
  | ({ mode: ContentBlockModes.READONLY } & ReadContentBlockExtensionProps)
  | ({ mode: ContentBlockModes.EDIT } & EditContentBlockExtensionProps);

export const ContentBlockExtension = (props: ContentBlockExtensionProps) => {
  if (props.mode === ContentBlockModes.READONLY) {
    return <ReadContentBlockExtension {...props} />;
  }
  if (props.mode === ContentBlockModes.EDIT) return <EditContentBlockExtension {...props} />;
  return null;
};
