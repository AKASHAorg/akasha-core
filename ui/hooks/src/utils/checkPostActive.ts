import { PostResponse } from '@akashaorg/typings/ui';

export function checkPostActive(entry: Pick<PostResponse, 'content' | 'delisted'>) {
  const isRemoved = entry.content.length === 1 && entry.content[0].property === 'removed';
  return !entry.delisted && !isRemoved;
}
