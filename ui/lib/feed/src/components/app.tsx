import React from 'react';
import { I18nextProvider } from 'react-i18next';
import { EntityTypes, ModalNavigationOptions } from '@akashaorg/typings/ui';
import type { EntryRendererProps } from './entry-renderer';
import BeamFeed, { BeamFeedProps } from './beam-feed';

export type FeedWidgetProps = BeamFeedProps & {
  itemType: EntityTypes;
  navigateToModal: (props: ModalNavigationOptions) => void;
  showReplyFragment?: boolean;
  replyFragmentItem?: EntryRendererProps['replyFragmentItem'];
};

const FeedWidgetRoot: React.FC<FeedWidgetProps> = props => {
  return (
    <I18nextProvider i18n={props.i18n}>
      {props.itemType === EntityTypes.BEAM && <BeamFeed {...props} />}
      {props.itemType === EntityTypes.REPLY && <></>}
      {/* {props.itemType === EntityTypes.PROFILE && <ProfileFeed {...props} />} */}
    </I18nextProvider>
  );
};

export default FeedWidgetRoot;
