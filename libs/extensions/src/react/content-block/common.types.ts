import { type ContentBlockConfig } from '@akashaorg/typings/lib/ui';
import { GetContentBlockByIdQuery } from '@akashaorg/typings/lib/sdk/graphql-operation-types-new';

export type MatchingBlock = {
  blockInfo: ContentBlockConfig & {
    appName: string;
  };
  blockData?: GetContentBlockByIdQuery['node'];
  content?: unknown;
};
