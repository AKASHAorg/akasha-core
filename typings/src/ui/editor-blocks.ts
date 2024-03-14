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

/**
 * Content Block's register function should return an object with this shape.
 */
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
/**
 * Props that will be passed to the contentBlock's root React component.
 */
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

/**
 * When the contentBlock is in edit mode (user is inserting data),
 * the block should expose an api that will be called by the editor.
 */
export type BlockInstanceMethods = {
  /**
   * createBlock is called when the user submits (publish) a Beam.
   * It returns a promise that when resolved, should contain the following properties:
   * response - an object containing the blockID and optionally an error message;
   * blockInfo - the block's information (received as React props);
   * retryCount - optional number (retry counter)
   */
  createBlock: (arg: CreateContentBlock) => Promise<{
    response: { blockID: string; error?: string };
    blockInfo: BlockInfo;
    retryCount?: number;
  }>;
  /**
   * If the createBlock fails, or returns an error message, the editor
   * will show a button to manually retry block creation.
   * This method has the same signature as `createBlock`
   */
  retryBlockCreation: (arg: CreateContentBlock) => Promise<{
    response: { blockID: string; error?: string };
    blockInfo: BlockInfo;
    retryCount?: number;
  }>;
  /**
   * Function that will be called on focus and blur events.
   * These events are handled by the editor and passed down to the block via this method.
   * Useful to show additional controls like a wysiwyg editor's text formatting tools.
   */
  handleFocusBlock?: (focus: boolean) => void;
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
