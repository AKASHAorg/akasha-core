import singleSpa from 'single-spa';
import { RootComponentProps } from './root-component';
import { GetContentBlockByIdQuery } from '../sdk/graphql-operation-types-new';
import { AkashaContentBlockLabeledValue } from '../sdk/graphql-types-new';

export const enum ContentBlockModes {
  EDIT = 'edit-mode',
  READONLY = 'read-only-mode',
}

export type BlockInfo = {
  mode: ContentBlockModes;
};
export type ContentBlockExtensionInterface = {
  propertyType: string;
  icon?: React.ReactElement;
  displayName: string;
  externalHandler?: (value: boolean) => void;
  loadingFn: (options: {
    blockInfo: BlockInfo;
    blockData: GetContentBlockByIdQuery['node'];
  }) => () => Promise<singleSpa.ParcelConfigObject<ContentBlockRootProps>>;
};

export type ContentBlock = ContentBlockExtensionInterface & {
  appName: string;
  propertyType: string;
  order: number;
};

export type ContentBlockRootProps = RootComponentProps & {
  blockInfo: Omit<ContentBlock, 'loadingFn'> & { mode: ContentBlockModes };
  blockData: GetContentBlockByIdQuery['node'];
  content: AkashaContentBlockLabeledValue;
};

export const enum ContentBlockEvents {
  RegisterContentBlock = 'register-content-block',
}

export type ContentBlockRegisterEvent = {
  event: ContentBlockEvents.RegisterContentBlock;
  data?: (ContentBlockExtensionInterface & { appName: string })[];
};

export type CreateContentBlock = {
  nsfw: boolean;
};

export type BlockInstanceMethods = {
  createBlock: (arg: CreateContentBlock) => Promise<{
    response: { blockID: string; error?: string };
    blockInfo: BlockInfo;
    retryCount?: number;
  }>;
  retryBlockCreation: (arg: CreateContentBlock) => Promise<{
    response: { blockID: string; error?: string };
    blockInfo: BlockInfo;
    retryCount?: number;
  }>;
};

export interface ContentBlockStorePluginInterface {
  getInfos(): Omit<
    ContentBlockExtensionInterface & {
      appName: string;
    },
    'loadingFn'
  >;

  getMatchingBlocks: (
    blockInfo:
      | {
          appName: string;
          propertyType: string;
        }
      | GetContentBlockByIdQuery['node'],
  ) => {
    blockInfo: ContentBlockExtensionInterface & {
      appName: string;
    };
    blockData?: unknown;
    content?: unknown;
  }[];
}
