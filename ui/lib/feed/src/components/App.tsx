import React from 'react';
import { I18nextProvider } from 'react-i18next';
import {
  TrackEventData,
  IProfileData,
  NavigateToParams,
  RootComponentProps,
  EntityTypes,
  ModalNavigationOptions,
} from '@akashaorg/typings/ui';
import { LoginState } from '@akashaorg/ui-awf-hooks/lib/use-login';
import { Logger } from '@akashaorg/awf-sdk';
import EntryFeed from './entry-feed';

export interface EntryListPage {
  results: string[];
  total: number;
}

export type FeedWidgetProps = {
  logger: Logger;
  pages: EntryListPage[];
  itemType: EntityTypes;
  onLoadMore: () => void;
  getShareUrl?: (entryId: string) => string;
  loginState: LoginState;
  navigateTo?: (args: NavigateToParams) => void;
  navigateToModal: (props: ModalNavigationOptions) => void;
  onLoginModalOpen: (redirectTo?: { modal: ModalNavigationOptions }) => void;
  requestStatus: 'success' | 'loading' | 'error' | 'idle';
  hasNextPage: boolean;
  loggedProfile?: IProfileData;
  contentClickable?: boolean;
  onEntryFlag: (entryId: string, itemType: string) => () => void;
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
  replyFragment?: boolean;
  firstLevelReply?: boolean;
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
      {props.itemType === EntityTypes.ENTRY && <EntryFeed {...props} />}
      {props.itemType === EntityTypes.COMMENT && <EntryFeed {...props} itemSpacing={0} />}
      {/* {props.itemType === EntityTypes.PROFILE && <ProfileFeed {...props} />} */}
    </I18nextProvider>
  );
};

export default FeedWidgetRoot;
