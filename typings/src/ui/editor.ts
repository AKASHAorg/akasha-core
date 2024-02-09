import { BaseEditor, Descendant } from 'slate';
import { ReactEditor } from 'slate-react';
import { HistoryEditor } from 'slate-history';
import { Profile } from './profile';

export type EmptyText = {
  text: string;
};

export type LinkElement = {
  type: 'link';
  align?: 'left' | 'center' | 'right';
  url: string;
  children: EmptyText[];
};

export type MentionElement = {
  type: 'mention';
  name?: string;
  id?: string;
  children?: EmptyText[];
  did: Profile['did'];
  align?: 'left' | 'center' | 'right';
};

export type TagElement = {
  type: 'tag';
  name: string;
  totalPosts: number;
  children: EmptyText[];
  align?: 'left' | 'center' | 'right';
};

export type ParagraphElement = {
  type: 'paragraph';
  align?: 'left' | 'center' | 'right';
  children: CustomText[];
};

export type ListItemElement = {
  type: 'list-item';
  align?: 'left' | 'center' | 'right';
  children: CustomText[];
};

export type BulletedListElement = {
  type: 'bulleted-list';
  align?: 'left' | 'center' | 'right';
  children: CustomText[];
};

export type NumberedListElement = {
  type: 'numbered-list';
  align?: 'left' | 'center' | 'right';
  children: CustomText[];
};

export type CustomElement =
  | LinkElement
  | MentionElement
  | TagElement
  | ParagraphElement
  | ListItemElement
  | BulletedListElement
  | NumberedListElement;

export type CustomText = {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  disabled?: boolean;
  text: string;
};

export type CustomEditor = BaseEditor & ReactEditor & HistoryEditor;
export type SlateDescendant = Descendant;

declare module 'slate' {
  interface CustomTypes {
    Editor: CustomEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}
