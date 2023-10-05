import * as React from 'react';
import { useRootComponentProps } from '@akashaorg/ui-awf-hooks';
import { useTranslation } from 'react-i18next';
import Extension from '@akashaorg/design-system-components/lib/components/Extension';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Dropdown from '@akashaorg/design-system-core/lib/components/Dropdown';
import { useBlocksPublishing } from './use-blocks-publishing';
import { useCreateBeamMutation } from '@akashaorg/ui-awf-hooks/lib/generated/hooks-new';
import { useGetMyProfileQuery } from '@akashaorg/ui-awf-hooks/lib/generated/hooks-new';
import { AkashaBeamInput } from '@akashaorg/typings/lib/sdk/graphql-types-new';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Text from '@akashaorg/design-system-core/lib/components/Text';

import { Header } from './header';
import { Footer } from './footer';

export type uiState = 'editor' | 'tags' | 'blocks' | 'image';

export const BeamEditor: React.FC = () => {
  const { t } = useTranslation('app-akasha-integration');

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

  const profileDataReq = useGetMyProfileQuery(null, {
    select: resp => {
      return resp.viewer?.akashaProfile;
    },
  });
  const loggedProfileData = profileDataReq.data;

  const [uiState, setUiState] = React.useState<uiState>('editor');
  const [isNsfw, setIsNsfw] = React.useState(false);

  const handleNsfwCheckbox = () => {
    setIsNsfw(!isNsfw);
  };

  const handleAddBlockBtn = () => {
    setUiState('blocks');
  };

  const handleTagsBtn = () => {
    setUiState('tags');
  };

  const handleClickCancel = () => {
    setUiState('editor');
  };

  const [selectedBlock, setSelectedBlock] = React.useState(0);

  const handleAddBlock = () => {
    onBlockSelectAfter(selectedBlock);
  };

  const [tagSelection, setTagSelection] = React.useState([]);
  const [editorTags, setEditorTags] = React.useState([]);

  const handleAddTags = () => {
    setEditorTags(tagSelection);
  };

  return (
    <Card customStyle="divide(y grey9 dark:grey3)" padding={0} margin="m-4">
      <Header
        addBlockLabel={t('Add a Block')}
        beamEditorLabel={t('Beam Editor')}
        addTagsLabel={t('Add Tags')}
        addImageLabel={t('Add an Image')}
        isNsfw={isNsfw}
        handleNsfwCheckbox={handleNsfwCheckbox}
        uiState={uiState}
      />
      <Stack>
        {blocksInUse.map((block, idx) => (
          <div key={`${block.name}-${idx}`}>
            <Extension
              name={`${block.name}_${idx}`}
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
      </Stack>
      <Footer
        uiState={uiState}
        handleClickAddBlock={handleAddBlockBtn}
        handleClickTags={handleTagsBtn}
        handleClickCancel={handleClickCancel}
        handleAddBlock={handleAddBlock}
        handleAddTags={handleAddTags}
        handleBeamPublish={handleBeamPublish}
        addBlockLabel={t('Add a Block')}
        addLabel={t('Add')}
        cancelLabel={t('Cancel')}
        blocksLabel={t('Blocks')}
        tagsLabel={t('Tags')}
        publishLabel={t('Beam it')}
      />
    </Card>
  );
};
