import * as React from 'react';
import DS from '@akashaproject/design-system';
import type { TFunction } from 'i18next';
import type { ILocale } from '@akashaproject/design-system/lib/utils/time';

const { EditorPlaceholder } = DS;

export interface IGetCustomEntitiesProps {
  isMobile: boolean;
  feedItems: string[];
  loggedEthAddress: string | null;
  t: TFunction;
  locale: ILocale;
  onAvatarClick: (ev: React.MouseEvent<HTMLDivElement>, authorEth: string) => void;
  onContentClick?: any;
  handleEditorPlaceholderClick?: () => void;
}

export const getFeedCustomEntities = (props: IGetCustomEntitiesProps) => {
  const { isMobile, feedItems, loggedEthAddress, handleEditorPlaceholderClick } = props;

  const customEntities = [];

  if (!isMobile && loggedEthAddress) {
    customEntities.push({
      position: 'before',
      // itemIndex: 0,
      itemId: feedItems.length ? feedItems[0] : null,
      getComponent: ({ key, style }: { key: string; style: any }) => (
        <EditorPlaceholder
          key={key}
          ethAddress={loggedEthAddress}
          onClick={handleEditorPlaceholderClick}
          style={style}
        />
      ),
    });
  }
  if (customEntities.length) {
    return customEntities;
  }
  return;
};
