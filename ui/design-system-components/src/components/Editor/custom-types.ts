import { CustomEditor, CustomElement, CustomText } from '@akashaorg/typings/lib/ui';

declare module 'slate' {
  interface CustomTypes {
    Editor: CustomEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}
