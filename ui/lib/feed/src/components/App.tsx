import React from 'react';
import { I18nextProvider } from 'react-i18next';
import {
  TrackEventData,
  NavigateToParams,
  RootComponentProps,
  EntityTypes,
  ModalNavigationOptions,
} from '@akashaorg/typings/ui';
import { Logger } from '@akashaorg/awf-sdk';
import EntryFeed from './entry-feed';
import { Profile } from '@akashaorg/typings/ui';

export type FeedWidgetProps = {
  logger: Logger;
  pages: any[];
  itemType: EntityTypes;
  onLoadMore: () => void;
  getShareUrl?: (entryId: string) => string;
  navigateTo?: (args: NavigateToParams) => void;
  navigateToModal: (props: ModalNavigationOptions) => void;
  onLoginModalOpen: (redirectTo?: { modal: ModalNavigationOptions }) => void;
  requestStatus: 'success' | 'loading' | 'error' | 'idle';
  hasNextPage: boolean;
  loggedProfileData?: Profile;
  contentClickable?: boolean;
  onEntryFlag: (entryId: string, itemType: EntityTypes) => () => void;
  onEntryRemove?: (entryId: string) => void;
  parentIsProfilePage?: boolean;
  removeEntryLabel?: string;
  removedByMeLabel?: string;
  removedByAuthorLabel?: string;
  uiEvents: RootComponentProps['uiEvents'];
  itemSpacing?: number;
  i18n: RootComponentProps['i18next'];
  modalSlotId: string;
  accentBorderTop?: boolean;
  replyFragmentItem?: boolean;
  showReplyFragment?: boolean;
  viewAllEntry?: {
    label: string;
    onClick: () => void;
    limit: number;
  };
  trackEvent?: (eventData: Omit<TrackEventData, 'eventType'>) => void;
};

const FeedWidgetRoot: React.FC<FeedWidgetProps> = props => {
  return (
    <I18nextProvider i18n={props.i18n}>
      {props.itemType === EntityTypes.POST && <EntryFeed {...props} />}
      {props.itemType === EntityTypes.REPLY && <EntryFeed {...props} itemSpacing={0} />}
      {/* {props.itemType === EntityTypes.PROFILE && <ProfileFeed {...props} />} */}
    </I18nextProvider>
  );
};

export default FeedWidgetRoot;
