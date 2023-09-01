import * as React from 'react';
import { BlockCommandResponse, RootExtensionProps } from '@akashaorg/typings/ui';
import { filterEvents } from './utils/event-utils';
import { BlockAction, BlockActionType, EditorBlock } from '@akashaorg/typings/ui/editor-blocks';

export type UseEditorBlocksProps = {
  uiEvents: RootExtensionProps['uiEvents'];
  blockData: EditorBlock;
  onBlockCreate: (blockState: unknown) => Promise<BlockCommandResponse['data']['response']>;
  blockState: unknown;
};
export const useEditorBlocks = (props: UseEditorBlocksProps) => {
  const { blockData, uiEvents, onBlockCreate, blockState } = props;
  const { appName, eventMap } = blockData;
  const uiEventsRef = React.useRef(uiEvents);

  React.useEffect(() => {
    const publishEvent: `${string}_${string}/${BlockAction.PUBLISH}` = `${appName}_${eventMap.publish}`;
    const validateEvent: `${string}_${string}/${BlockAction.VALIDATE}` = `${blockData['appName']}_${blockData['eventMap'].validate}`;

    const sub = uiEventsRef.current.pipe(filterEvents([publishEvent, validateEvent])).subscribe({
      next: evData => {
        if (evData.event && evData.event === `${appName}_${eventMap.publish}`) {
          onBlockCreate(blockState)
            .then(response => {
              uiEventsRef.current.next({
                event: `${appName}_${eventMap.publish}_${BlockActionType.SUCCESS}`,
                data: {
                  block: blockData,
                  response,
                },
              });
            })
            .catch(err => {
              console.error('error creating block:', err.message);
              uiEventsRef.current.next({
                event: `${appName}_${eventMap.publish}_${BlockActionType.SUCCESS}`,
                data: {
                  block: blockData,
                  response: { error: err.message },
                },
              });
            });
        }
      },
    });
    return () => sub.unsubscribe();
  }, [blockData, onBlockCreate, blockState, appName, eventMap]);
  return [];
};
