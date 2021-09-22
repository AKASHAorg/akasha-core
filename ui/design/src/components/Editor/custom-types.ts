import { CustomEditor, CustomElement, CustomText } from '@akashaproject/ui-awf-typings/lib/editor';

declare module 'slate' {
  interface CustomTypes {
    Editor: CustomEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}
