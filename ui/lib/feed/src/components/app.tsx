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
import BeamFeed, { BeamFeedProps } from './beam-feed';

export type FeedWidgetProps = Omit<EntryListProps, 'itemCard'> &
  Omit<
    BeamFeedProps,
    | 'replyFragmentItem'
    | 'locale'
    | 'showReplyFragment'
    | 'entryData'
    | 'entryIndex'
    | 'totalEntryCount'
  > & {
    itemType: EntityTypes;
    navigateToModal: (props: ModalNavigationOptions) => void;
    showReplyFragment?: boolean;
    replyFragmentItem?: EntryRendererProps['replyFragmentItem'];
  };

const FeedWidgetRoot: React.FC<FeedWidgetProps> = props => {
  return (
    <I18nextProvider i18n={props.i18n}>
      {props.itemType === EntityTypes.BEAM && <BeamFeed {...props} />}
      {props.itemType === EntityTypes.REPLY && <EntryFeed {...props} itemSpacing={0} />}
      {/* {props.itemType === EntityTypes.PROFILE && <ProfileFeed {...props} />} */}
    </I18nextProvider>
  );
};

export default FeedWidgetRoot;
