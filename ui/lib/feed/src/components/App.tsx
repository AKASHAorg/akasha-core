import React from 'react';
import EntryFeed from './entry-feed';
import { NavigateToParams, RootComponentProps } from '@akashaproject/ui-awf-typings';
import { ItemTypes, ModalNavigationOptions } from '@akashaproject/ui-awf-typings/lib/app-loader';
import { I18nextProvider } from 'react-i18next';
import { ILogger } from '@akashaproject/sdk-typings/lib/interfaces/log';
import { BrowserRouter } from 'react-router-dom';
import { IProfileData } from '@akashaproject/ui-awf-typings/lib/profile';
import { LoginState } from '@akashaproject/ui-awf-hooks/lib/use-login';
import { TrackEventData } from '@akashaproject/ui-awf-typings/lib/analytics';

export interface EntryListPage {
  results: string[];
}

export interface IFeedWidgetProps {
  logger: ILogger;
  pages: EntryListPage[];
  itemType: ItemTypes;
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
  trackEvent?: (eventData: Omit<TrackEventData, 'eventType'>) => void;
}

const FeedWidgetRoot: React.FC<IFeedWidgetProps> = props => {
  return (
    <BrowserRouter>
      <I18nextProvider i18n={props.i18n}>
        {props.itemType === ItemTypes.ENTRY && <EntryFeed {...props} />}
        {props.itemType === ItemTypes.COMMENT && <EntryFeed {...props} itemSpacing={0} />}
        {/* {props.itemType === ItemTypes.PROFILE && <ProfileFeed {...props} />} */}
      </I18nextProvider>
    </BrowserRouter>
  );
};

export default FeedWidgetRoot;
