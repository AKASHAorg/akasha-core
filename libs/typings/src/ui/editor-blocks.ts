import singleSpa from 'single-spa';
import { IRootComponentProps } from './root-component';
import { GetContentBlockByIdQuery } from '../sdk/graphql-operation-types-new';
import { BlockLabeledValue } from '../sdk/graphql-types-new';

/**
 * Enum defining content block modes
 **/
export const enum ContentBlockModes {
  EDIT = 'edit-mode',
  READONLY = 'read-only-mode',
}

/**
 * Type defining block info
 * @internal
 **/
type BlockInfo = {
  mode: ContentBlockModes;
};

/**
 * Type defining configuration object for loading content blocks
 */
export type ContentBlockConfig = {
  propertyType: string;
  icon?: React.ReactElement;
  displayName: string;
  externalHandler?: (value: boolean) => void;
  loadingFn: (options: {
    blockInfo: BlockInfo;
    blockData: GetContentBlockByIdQuery['node'];
  }) => () => Promise<singleSpa.ParcelConfigObject<ContentBlockRootProps>>;
};

/**
 * Type defining content block
 */
export type ContentBlock = {
  appName: string;
  propertyType: string;
  order: number;
};

/**
 * Type defining props that will be passed to the content block's root React component.
 */
export type ContentBlockRootProps = IRootComponentProps & {
  blockInfo: Omit<ContentBlock, 'loadingFn'> & ContentBlockConfig & { mode: ContentBlockModes };
  blockData: GetContentBlockByIdQuery['node'];
  content: BlockLabeledValue;
};

/**
 * Enum defining events related to loading and unloading of content blocks
 **/
export const enum ContentBlockEvents {
  RegisterContentBlock = 'register-content-block',
}

/**
 * Type defining content block registration event
 **/
export type ContentBlockRegisterEvent = {
  event: ContentBlockEvents.RegisterContentBlock;
  data?: (ContentBlockConfig & { appName: string })[];
};

/**
 * Type defining params of a function that creates content block
 **/
export type CreateContentBlock = {
  nsfw: boolean;
};

/**
 * Type defining methods of block instance object used by an editor when the content block is in edit mode
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

/**
 * Interface defining content block state store defined as a plugin
 **/
export interface IContentBlockStorePlugin {
  getInfos(): Omit<
    ContentBlockConfig & {
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
    blockInfo: ContentBlockConfig & {
      appName: string;
    };
    blockData?: unknown;
    content?: unknown;
  }[];
}
