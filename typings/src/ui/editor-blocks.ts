import { AppName } from './apps';

export const enum BlockAction {
  PUBLISH = 'publish',
  UPDATE = 'update',
  VALIDATE = 'validate',
}

export const enum BlockActionType {
  SUCCESS = 'success',
  ERROR = 'error',
}

export type EditorBlockInterface = {
  name: string;
  icon?: string;
  displayName: string;
  eventMap: {
    publish: `${string}/${BlockAction.PUBLISH}`;
    update: `${string}/${BlockAction.UPDATE}`;
    validate: `${string}/${BlockAction.VALIDATE}`;
  };
};
export type BlockName = string;
export type EditorBlock = EditorBlockInterface & {
  appName: string;
  idx: number;
};

export const enum EditorBlockEvents {
  RegisterEditorBlock = 'register-editor-block',
}

export type EditorBlockRegisterEvent = {
  event: EditorBlockEvents.RegisterEditorBlock;
  data?: (EditorBlockInterface & { appName: string })[];
};

export type BlockCommandRequest = {
  event: `${AppName}_${BlockName}/${BlockAction}`;
  data: EditorBlock;
};

export type BlockCommandResponse = {
  event: `${AppName}_${BlockName}/${BlockAction}_${BlockActionType}`;
  data: {
    block: EditorBlock;
    // @TODO: this response must contain published content block id ??
    response: { error?: string; blockID?: string };
  };
};
