import singleSpa from 'single-spa';
import { RootComponentProps } from './root-component';

export const enum ContentBlockModes {
  EDIT = 'edit-mode',
  READONLY = 'read-only-mode',
  INTERACTIVE = 'interactive-mode',
}

export type BlockInfo = {
  mode: ContentBlockModes;
};
export type ContentBlockExtensionInterface = {
  propertyType: string;
  icon?: string;
  displayName: string;
  loadingFn: (
    blockInfo: BlockInfo,
  ) => () => Promise<singleSpa.ParcelConfigObject<RootComponentProps & BlockInfo>>;
};

export type ContentBlock = ContentBlockExtensionInterface & {
  appName: string;
  propertyType: string;
  order: number;
};

export type ContentBlockRootProps = RootComponentProps & {
  blockInfo: Omit<ContentBlock, 'loadingFn'> & { mode: ContentBlockModes };
};

export const enum ContentBlockEvents {
  RegisterContentBlock = 'register-content-block',
}

export type ContentBlockRegisterEvent = {
  event: ContentBlockEvents.RegisterContentBlock;
  data?: (ContentBlockExtensionInterface & { appName: string })[];
};

export type BlockInstanceMethods = {
  createBlock: () => Promise<{
    response: { blockID?: string; error?: string };
    blockInfo: BlockInfo;
  }>;
};
