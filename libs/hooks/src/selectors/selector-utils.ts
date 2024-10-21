export type NotEmpty<T> =
  T extends Record<string, unknown> ? (keyof T extends never ? never : T) : never;

export const isNodeWithId = <T extends { node?: { id?: string } }>(
  data: T,
): data is T & { node: NotEmpty<NonNullable<T['node']>> } => {
  return !!data?.node && typeof data.node === 'object' && 'id' in data.node;
};

export const isNodeWithIsViewer = <T extends { node?: { isViewer?: boolean } }>(
  data: T,
): data is T & { node: NotEmpty<NonNullable<T['node']>> } => {
  return !!data?.node && typeof data.node === 'object' && 'isViewer' in data.node;
};
