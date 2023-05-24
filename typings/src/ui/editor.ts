import { BaseEditor } from 'slate';
import { ReactEditor } from 'slate-react';
import { HistoryEditor } from 'slate-history';
import { Profile } from './profile';

export type EmptyText = {
  text: string;
};

export type ImageElement = {
  type: 'image';
  url: string;
  fallbackUrl?: string;
  size: {
    width: string;
    height: string;
    naturalWidth: string;
    naturalHeight: string;
  };
  children: EmptyText[];
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

export type CustomElement =
  | ImageElement
  | LinkElement
  | MentionElement
  | TagElement
  | ParagraphElement;

export type CustomText = {
  bold?: boolean;
  italic?: boolean;
  code?: boolean;
  underlined?: boolean;
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
