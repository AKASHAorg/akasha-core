import { MatchingBlock } from '@akashaorg/ui-lib-extensions/lib/react/content-block';
import { useState } from 'react';

type WithoutEmpty<T> = T extends T ? (NonNullable<unknown> extends T ? never : T) : never;

export const useBlockData = () => {
  const [nsfw, setNsfw] = useState(false);
  const [appName, setAppName] = useState('');
  const [blockName, setBlockName] = useState('');

  const addBlockData = (blockData?: WithoutEmpty<MatchingBlock['blockData']>) => {
    setNsfw(blockData?.nsfw);
  };

  const addBlockInfo = (blockInfo?: MatchingBlock['blockInfo']) => {
    setAppName(blockInfo?.appName ?? '');
    setBlockName(blockInfo?.displayName ?? '');
  };

  return { nsfw, appName, blockName, addBlockData, addBlockInfo };
};
