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
import EditorPlaceholder from '@akashaorg/design-system-components/lib/components/EditorPlaceholder';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import Checkbox from '@akashaorg/design-system-core/lib/components/Checkbox';

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

  const [showPlaceholder, setShowPlaceholder] = React.useState(true);
  const [isNsfw, setIsNsfw] = React.useState(false);

  const handleNsfwCheckbox = () => {
    setIsNsfw(!isNsfw);
  };

  const handleAddBlockBtn = () => {
    return;
  };

  const handleTagsBtn = () => {
    return;
  };

  if (showPlaceholder) {
    return (
      <Stack customStyle="mb-4">
        <EditorPlaceholder
          profileId={loggedProfileData.did.id}
          avatar={loggedProfileData.avatar}
          actionLabel={t(`Start Beaming`)}
          placeholderLabel={t(`From Your Mind to the World 🧠 🌏 ✨`)}
          onClick={() => setShowPlaceholder(false)}
        />
      </Stack>
    );
  }

  return (
    <Card customStyle="divide(y grey9 dark:grey3)" padding={0} margin="m-4">
      <Stack justify="between" direction="row" align="center">
        <Text>{t(`Beam Editor`)}</Text>

        <Checkbox
          id="nsfw"
          label={'NSFW'}
          name="nsfw"
          value="nsfw"
          handleChange={handleNsfwCheckbox}
          isSelected={isNsfw}
        />
      </Stack>
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
      <Stack justify={'between'} direction="row">
        <Button
          onClick={handleAddBlockBtn}
          icon="PlusIcon"
          variant="text"
          greyBg={true}
          label={t('Add a Block')}
        />
        <Stack direction="row">
          <Button variant="text" label={t('Tags')} onClick={handleTagsBtn} />
          <Button
            variant="primary"
            disabled={isPublishing}
            label={t('Beam it')}
            onClick={handleBeamPublish}
          />
        </Stack>
      </Stack>
    </Card>
  );
};
