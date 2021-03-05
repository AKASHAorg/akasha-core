import React from 'react';
import { IEntryData } from '../Cards/entry-cards/entry-box';
export interface IEditorBox {
  avatar?: string;
  ethAddress: string | null;
  postLabel?: string;
  placeholderLabel?: string;
  uploadFailedLabel?: string;
  uploadingImageLabel?: string;
  onPublish: any;
  embedEntryData?: IEntryData;
  minHeight?: string;
  withMeter?: boolean;
  getMentions: (query: string) => void;
  getTags: (query: string) => void;
  mentions?: {
    name: string;
    userName: string;
    pubKey: string;
    avatar: string;
    ethAddress: string;
    description: string;
    coverImage: string;
  }[];
  tags?: {
    name: string;
    totalPosts: number;
  }[];
  uploadRequest?: (data: string | File, isUrl?: boolean) => any;
  publishingApp?: string;
  editorState: any;
  setEditorState: any;
  ref?: React.Ref<any>;
}
export interface IMetadata {
  app: string;
  version: number;
  quote?: string;
  tags: string[];
  mentions: string[];
}
declare const EditorBox: React.FC<IEditorBox>;
export default EditorBox;
