import { BaseEditor, Descendant } from 'slate';
import { ReactEditor } from 'slate-react';
import { HistoryEditor } from 'slate-history';
import { Profile } from './profile';

/**
 * Type defining empty text
 * @internal
 */
type EmptyText = {
  text: string;
};

/**
 * Type defining hyperlink element of an editor
 */
export type LinkElement = {
  type: 'link';
  align?: 'left' | 'center' | 'right';
  url: string;
  children: EmptyText[];
};

/**
 * Type defining mention element of an editor
 */
export type MentionElement = {
  type: 'mention';
  name?: string;
  id?: string;
  children?: EmptyText[];
  did: Profile['did'];
  align?: 'left' | 'center' | 'right';
};

/**
 * Type defining tag element of an editor
 */
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

/**
 * Type defining list element of an editor
 */
export type ListItemElement = {
  type: 'list-item';
  align?: 'left' | 'center' | 'right';
  children: CustomText[];
};

/**
 * Type defining bulleted list element of an editor
 */
export type BulletedListElement = {
  type: 'bulleted-list';
  align?: 'left' | 'center' | 'right';
  children: CustomText[];
};

/**
 * Type defining numbered list element of an editor
 */
export type NumberedListElement = {
  type: 'numbered-list';
  align?: 'left' | 'center' | 'right';
  children: CustomText[];
};

/**
 * Type defining custom element of an editor
 */
export type CustomElement =
  | LinkElement
  | MentionElement
  | TagElement
  | ParagraphElement
  | ListItemElement
  | BulletedListElement
  | NumberedListElement;

/**
 * Type defining custom text configuration object of an editor
 */
export type CustomText = {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  disabled?: boolean;
  text: string;
};

/**
 * Type defining custom editor object
 */
export type CustomEditor = BaseEditor & ReactEditor & HistoryEditor;

/**
 * Alias of Descendant type
 */
export type SlateDescendant = Descendant;

declare module 'slate' {
  interface CustomTypes {
    Editor: CustomEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}
