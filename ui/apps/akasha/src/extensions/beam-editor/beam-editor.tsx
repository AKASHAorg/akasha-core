import * as React from 'react';
import { useRootComponentProps } from '@akashaorg/ui-awf-hooks';
import Extension from '@akashaorg/design-system-components/lib/components/Extension';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Dropdown from '@akashaorg/design-system-core/lib/components/Dropdown';
import { useBlocksPublishing } from './use-blocks-publishing';
import { useCreateBeamMutation } from '@akashaorg/ui-awf-hooks/lib/generated/hooks-new';
import { AkashaBeamInput } from '@akashaorg/typings/lib/sdk/graphql-types-new';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Card from '@akashaorg/design-system-core/lib/components/Card';

export const BeamEditor: React.FC = () => {
  const { getEditorBlocksPlugin, uiEvents, logger } = useRootComponentProps();
  const createBeam = useCreateBeamMutation();
  const availableBlocks = getEditorBlocksPlugin().getAll();

  const { createContentBlocks, isPublishing, setIsPublishing, blocksInUse, addBlockToList } =
    useBlocksPublishing({
      uiEvents,
      availableBlocks,
      onBeamPublish: async blockResponseData => {
        const beamContent: AkashaBeamInput = {
          active: true,
          content: blockResponseData.map(blockData => ({
            blockID: blockData.response.blockID,
            order: blockData.block.idx,
          })),
          createdAt: new Date().toISOString(),
        };
        try {
          const resp = await createBeam.mutateAsync({
            i: {
              content: beamContent,
            },
          });
          logger.info(`Beam successfuly created ${JSON.stringify(resp)}`);
          return;
        } catch (err) {
          logger.error(`Error in beam publishing: ${err.message}`);
          throw err;
        }
      },
    });

  const onBlockSelectAfter = (after: number) => newSelection => {
    if (!newSelection.id) {
      return;
    }
    const block = availableBlocks.find(bl => bl.name === newSelection.id);
    if (!block) {
      return;
    }
    addBlockToList(block, after);
  };

  const handleBeamPublish = () => {
    createContentBlocks();
  };

  return (
    <Card>
      {blocksInUse.map((block, idx) => (
        <div key={`${block.propertyType}-${idx}`}>
          <Extension
            name={`${block.propertyType}_${idx}`}
            data={{ readOnly: false, action: 'post', block }}
            uiEvents={uiEvents}
          />
          <Dropdown
            placeholderLabel={'Add Block'}
            menuItems={availableBlocks.map(eb => ({
              id: eb.name,
              iconName: eb.icon,
              title: eb.displayName,
            }))}
            setSelected={onBlockSelectAfter(idx)}
          />
        </div>
      ))}
      <Stack justify={'end'}>
        <Button disabled={isPublishing} label={'Publish'} onClick={handleBeamPublish} />
      </Stack>
    </Card>
  );
};
