import { BaseEditor } from 'slate';
import { ReactEditor } from 'slate-react';
import { HistoryEditor } from 'slate-history';

export type ImageElement = {
  type: 'image';
  url: string;
  size: {
    width: string;
    height: string;
    naturalWidth: string;
    naturalHeight: string;
  };
  children: EmptyText[];
};

export type LinkElement = { type: 'link'; url: string; metadata?: any; children: EmptyText[] };

export type MentionElement = {
  type: 'mention';
  name: string;
  userName: string;
  pubKey: string;
  avatar: string;
  ethAddress: string;
  children: EmptyText[];
};

export type TagElement = {
  type: 'tag';
  name: string;
  totalPosts: number;
  children: EmptyText[];
};
type CustomElement =
  | ImageElement
  | LinkElement
  | MentionElement
  | TagElement
  | { type: 'paragraph'; children: CustomText[] };

export type CustomText = {
  bold?: boolean;
  italic?: boolean;
  code?: boolean;
  underlined?: boolean;
  disabled?: boolean;
  text: string;
};

export type EmptyText = {
  text: string;
};

export type CustomEditor = BaseEditor & ReactEditor & HistoryEditor;

declare module 'slate' {
  interface CustomTypes {
    Editor: CustomEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}
