import { AppName } from './apps';
import singleSpa from 'single-spa';
import { RootComponentProps } from './root-component';

export const enum BlockAction {
  PUBLISH = 'publish',
  UPDATE = 'update',
  VALIDATE = 'validate',
}

export const enum BlockActionType {
  SUCCESS = 'success',
  ERROR = 'error',
}

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
  eventMap: {
    publish: `${string}/${BlockAction.PUBLISH}`;
    update: `${string}/${BlockAction.UPDATE}`;
    validate: `${string}/${BlockAction.VALIDATE}`;
  };
  loadingFn: (
    blockInfo: BlockInfo,
  ) => () => Promise<singleSpa.ParcelConfigObject<RootComponentProps & BlockInfo>>;
};
export type BlockName = string;

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

export type BlockCommandRequest = {
  event: `${AppName}_${BlockName}/${BlockAction}`;
  data: Omit<ContentBlock, 'loadingFn'> & { mode: ContentBlockModes };
};

export type BlockCommandResponse = {
  event: `${AppName}_${BlockName}/${BlockAction}_${BlockActionType}`;
  data: {
    block: Omit<ContentBlock, 'loadingFn'> & { mode: ContentBlockModes };
    // @TODO: this response must contain published content block id ??
    response: { error?: string; blockID?: string };
  };
};
