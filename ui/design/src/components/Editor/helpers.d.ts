import { Editor } from 'slate';
declare const CustomEditor: {
  isBlockActive(editor: Editor, format: string): boolean;
  isFormatActive(editor: Editor, format: string): boolean;
  toggleBlock(editor: Editor, format: string): void;
  toggleFormat(editor: Editor, format: string): void;
  insertImage(
    editor: Editor,
    url: string,
    size: {
      width: string;
      height: string;
      naturalWidth: string;
      naturalHeight: string;
    },
  ): void;
  insertText(editor: Editor, text: string): void;
  insertMention(
    editor: Editor,
    mentionData: {
      name: string;
      userName: string;
      pubKey: string;
      avatar: string;
      ethAddress: string;
    },
  ): void;
  insertTag(
    editor: Editor,
    tagData: {
      name: string;
      totalPosts: number;
    },
  ): void;
};
export declare const Portal: ({ children }: any) => import('react').ReactPortal;
export { CustomEditor };
