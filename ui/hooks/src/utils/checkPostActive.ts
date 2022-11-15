import { PostResultFragment } from '@akashaorg/typings/sdk/graphql-operation-types';
import { ModerationStatus } from '../moderation-requests';

/**
 * Utility to check whether a post is active or not
 */
export function checkPostActive(entry: PostResultFragment & Partial<ModerationStatus>) {
  const isRemoved = entry.content.length === 1 && entry.content[0].property === 'removed';
  return !entry.delisted && !isRemoved;
}
