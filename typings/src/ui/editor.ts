import { BaseEditor } from 'slate';
import { ReactEditor } from 'slate-react';
import { HistoryEditor } from 'slate-history';
import { Profile } from './profile';

export type EmptyText = {
  text: string;
};

export type LinkElement = { type: 'link'; url: string; children: EmptyText[] };

export type MentionElement = {
  type: 'mention';
  name?: string;
  id?: string;
  children?: EmptyText[];
  did: Profile['did'];
};

export type TagElement = {
  type: 'tag';
  name: string;
  totalPosts: number;
  children: EmptyText[];
};

export type ParagraphElement = {
  type: 'paragraph';
  children: CustomText[];
};

export type ListItemElement = {
  type: 'list-item';
  children: CustomText[];
};

export type NumberedListElement = {
  type: 'numbered-list';
  children: CustomText[];
};

export type CustomElement =
  | LinkElement
  | MentionElement
  | TagElement
  | ParagraphElement
  | ListItemElement
  | NumberedListElement;

export type CustomText = {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  disabled?: boolean;
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
