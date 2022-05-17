import { CustomEditor, CustomElement, CustomText } from '@akashaorg/ui-awf-typings/lib/editor';

declare module 'slate' {
  interface CustomTypes {
    Editor: CustomEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}
