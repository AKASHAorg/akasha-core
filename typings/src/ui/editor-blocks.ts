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
