export const enum BlockAction {
  PUBLISH,
  UPDATE,
}

export type EditorBlockInterface = {
  name: string;
  icon?: string;
  displayName: string;
  eventMap: {
    publish: `${string}/${BlockAction}`;
    update: `${string}/${BlockAction}`;
  };
};
