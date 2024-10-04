import { GetBeamByIdQuery } from '@akashaorg/typings/lib/sdk/graphql-operation-types-new';
import { isNodeWithId } from './selector-utils';

export const selectBeamActive = (data: GetBeamByIdQuery) => {
  if (isNodeWithId(data)) {
    return data.node.active;
  }
  return null;
};

export const selectBeamId = (data: GetBeamByIdQuery) => {
  if (isNodeWithId(data)) {
    return data.node.id;
  }
};

export const selectBeamContent = (data: GetBeamByIdQuery) => {
  if (isNodeWithId(data)) {
    return data.node.content;
  }
  return null;
};

export const selectReflectionsCount = (data: GetBeamByIdQuery) => {
  if (isNodeWithId(data)) {
    return data.node.reflectionsCount;
  }
};

export const selectBeamAuthor = (data: GetBeamByIdQuery) => {
  if (isNodeWithId(data)) {
    return data.node.author;
  }
};

export const selectCreatedAt = (data: GetBeamByIdQuery) => {
  if (isNodeWithId(data)) {
    return data.node.createdAt;
  }
};

export const selectBeamTags = (data: GetBeamByIdQuery) => {
  if (isNodeWithId(data)) {
    return data.node.tags;
  }
};

export const selectNsfw = (data: GetBeamByIdQuery) => {
  if (isNodeWithId(data)) {
    return data.node.nsfw;
  }
};

export const selectMentions = (data: GetBeamByIdQuery): { id: string }[] | null => {
  if (isNodeWithId(data)) {
    return data.node.mentions;
  }
};

export const selectAppId = (data: GetBeamByIdQuery) => {
  if (isNodeWithId(data)) {
    return data.node.appID;
  }
};
