import { AppName } from './apps';
import { ExtensionLoaderFn } from './app-loader';

export const enum BlockAction {
  PUBLISH = 'publish',
  UPDATE = 'update',
  VALIDATE = 'validate',
}

export const enum BlockActionType {
  SUCCESS = 'success',
  ERROR = 'error',
}

export type ContentBlockExtensionInterface = {
  propertyType: string;
  icon?: string;
  displayName: string;
  eventMap: {
    publish: `${string}/${BlockAction.PUBLISH}`;
    update: `${string}/${BlockAction.UPDATE}`;
    validate: `${string}/${BlockAction.VALIDATE}`;
  };
  loadingFn: (blockInfo: unknown, loader: ExtensionLoaderFn) => ReturnType<ExtensionLoaderFn>;
};
export type BlockName = string;
export type ContentBlock = ContentBlockExtensionInterface & {
  appName: string;
  idx: number;
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
  data: ContentBlock;
};

export type BlockCommandResponse = {
  event: `${AppName}_${BlockName}/${BlockAction}_${BlockActionType}`;
  data: {
    block: ContentBlock;
    // @TODO: this response must contain published content block id ??
    response: { error?: string; blockID?: string };
  };
};
