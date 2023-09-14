import { ModerationStatus } from '@akashaorg/typings/lib/ui';
import { PostResultFragment } from '@akashaorg/typings/lib/sdk/graphql-operation-types';

/**
 * Utility to check whether an entry is active or not
 */
export function checkEntryActive(
  entry: Pick<PostResultFragment, 'content'> & Partial<ModerationStatus>,
) {
  const isRemoved = entry.content.length === 1 && entry.content[0].property === 'removed';
  return !entry.delisted && !isRemoved;
}
