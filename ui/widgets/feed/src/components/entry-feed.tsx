import * as React from 'react';
import DS from '@akashaproject/design-system';
import type { IFeedWidgetProps } from './App';

const { VirtualList, ErrorInfoCard, ErrorLoader } = DS;

export interface IEntryFeedProps extends IFeedWidgetProps {}

const EntryFeed = (props: IEntryFeedProps) => {
  const { errors } = props;
  console.log(errors, 'the errors');
  return (
    <ErrorInfoCard errors={errors}>
      {(messages, hasCriticalErrors) => (
        <>
          {messages && (
            <ErrorLoader
              style={{ marginTop: '.5em' }}
              type="script-error"
              title="There are some errors thrown."
              details={messages}
            />
          )}
          {!hasCriticalErrors && (
            <VirtualList
              items={props.itemIds}
              itemsData={props.itemsData}
              loadMore={props.loadMore}
              loadItemData={props.loadItemData}
              listHeader={props.listHeader}
              itemCard={<>Entry Card</>}
            />
          )}
        </>
      )}
    </ErrorInfoCard>
  );
};

export default EntryFeed;
