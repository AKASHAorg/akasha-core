import React from 'react';
import { I18nextProvider } from 'react-i18next';
import { EntityTypes } from '@akashaorg/typings/lib/ui';
import BeamFeed, { BeamFeedProps } from './beam-feed';
import { ILocale } from '@akashaorg/design-system-components/lib/utils/time';
import { useRootComponentProps } from '@akashaorg/ui-awf-hooks';
import { VirtualizerProps } from '../virtual-list';

/**
 * Scroll restoration:
 * start from the first item that was visible in the viewport (firstItemCursor)
 *  - if first time visitor - start from most recent item
 * fetch \{ overscan \} number of items that were published \{ before \} the first item in the list
 *  - first item in the list (startItemCursor) is different from the (firstItemCursor)
 *  - if there are items in the response, show the "New items" pill
 *    - on click - reset the list including the new items
 */

export type FeedWidgetProps<T> = {
  queryKey: string;
  itemType: EntityTypes;
  itemSpacing: VirtualizerProps<unknown>['itemSpacing'];
  contentClickable?: boolean;
  trackEvent?: BeamFeedProps['trackEvent'];
  scrollerOptions?: { overscan: number };
  newItemsPublishedLabel?: string;
  filters?: BeamFeedProps['filters'];
  sorting?: BeamFeedProps['sorting'];
  scrollTopIndicator: VirtualizerProps<unknown>['scrollTopIndicator'];
  renderItem: VirtualizerProps<T>['renderItem'];
  estimatedHeight: VirtualizerProps<unknown>['estimatedHeight'];
  header?: VirtualizerProps<unknown>['header'];
};

const FeedWidgetRoot = <T,>(props: FeedWidgetProps<T>) => {
  const { getTranslationPlugin } = useRootComponentProps();
  const { i18n } = getTranslationPlugin();

  return (
    <I18nextProvider i18n={i18n}>
      {props.itemType === EntityTypes.BEAM && (
        <BeamFeed {...props} locale={i18n.languages[0].toLowerCase() as ILocale} />
      )}
      {/*{props.itemType === EntityTypes.REFLECT && (*/}
      {/*  <ReflectFeed*/}
      {/*    {...props}*/}
      {/*    beamId={props.beamId}*/}
      {/*    i18n={i18n}*/}
      {/*    modalSlotId={layoutConfig.modalSlotId}*/}
      {/*    locale={i18n.languages[0].toLowerCase() as ILocale}*/}
      {/*    db={db}*/}
      {/*  />*/}
      {/*)}*/}
    </I18nextProvider>
  );
};

export default FeedWidgetRoot;
