import React from 'react';
import { I18nextProvider } from 'react-i18next';
import {
  TrackEventData,
  NavigateToParams,
  RootComponentProps,
  EntityTypes,
  ModalNavigationOptions,
} from '@akashaorg/typings/ui';
import EntryFeed from './entry-feed';
import type { EntryListProps } from '@akashaorg/design-system-components/lib/components/EntryList';
import type { EntryRendererProps } from './entry-renderer';

export type FeedWidgetProps = Omit<EntryListProps, 'itemCard'> &
  Omit<
    EntryRendererProps,
    | 'replyFragmentItem'
    | 'sharePostUrl'
    | 'locale'
    | 'onRepost'
    | 'onEntryNavigate'
    | 'showReplyFragment'
  > & {
    navigateToModal: (props: ModalNavigationOptions) => void;
    showReplyFragment?: boolean;
    replyFragmentItem?: EntryRendererProps['replyFragmentItem'];
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
