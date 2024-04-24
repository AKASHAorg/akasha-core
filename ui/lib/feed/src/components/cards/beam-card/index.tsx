import React, { useState } from 'react';
import EntryCard, {
  EntryCardProps,
} from '@akashaorg/design-system-components/lib/components/Entry/EntryCard';
import ContentBlockRenderer from './content-block-renderer';
import ActionButtons from './action-buttons';
import AuthorProfileAvatar from '../author-profile-avatar';
import { sortByKey, useGetLogin } from '@akashaorg/ui-awf-hooks';
import { EntityTypes, BeamEntryData } from '@akashaorg/typings/lib/ui';
import { useRootComponentProps, useNsfwToggling } from '@akashaorg/ui-awf-hooks';
import { useTranslation } from 'react-i18next';

type BeamCardProps = Pick<
  EntryCardProps,
  | 'contentClickable'
  | 'noWrapperCard'
  | 'onContentClick'
  | 'onReflect'
  | 'hideActionButtons'
  | 'disableActions'
  | 'showHiddenContent'
> & {
  entryData: BeamEntryData;
  hidePublishTime?: boolean;
  showNSFWCard: boolean;
  showLoginModal?: () => void;
};

const BeamCard: React.FC<BeamCardProps> = props => {
  const { t } = useTranslation('ui-lib-feed');
  const {
    entryData,
    hidePublishTime,
    onReflect,
    showHiddenContent,
    showNSFWCard,
    showLoginModal,
    onContentClick,
    ...rest
  } = props;

  const { getRoutingPlugin } = useRootComponentProps();
  const { data } = useGetLogin();
  const [appName, setAppName] = useState('');
  const [blockNameMap, setBlockNameMap] = useState(new Map());
  const [showBlockName, setShowBlockName] = useState(false);
  const navigateTo = getRoutingPlugin().navigateTo;
  const authenticatedDID = data?.id;

  const { showNsfw } = useNsfwToggling();

  const handleFlagBeam = () => {
    navigateTo({
      appName: '@akashaorg/app-vibes',
      getNavigationUrl: () => `/report/beam/${entryData.id}`,
    });
  };

  const onTagClick = (tag: string) => {
    navigateTo({
      appName: '@akashaorg/app-akasha-integration',
      getNavigationUrl: routes => `${routes.Tags}/${tag}`,
    });
  };

  const sortedEntryContent = React.useMemo(() => {
    return sortByKey(entryData.content, 'order');
  }, [entryData.content]);

  return (
    <EntryCard
      entryData={entryData}
      reflectionsCount={entryData?.reflectionsCount}
      reflectAnchorLink="/@akashaorg/app-akasha-integration/beam"
      sortedContents={sortedEntryContent}
      flagAsLabel={t('Flag')}
      editLabel={t('Edit')}
      isViewer={authenticatedDID === entryData.authorId}
      removed={{
        author: {
          firstPart: t('AKASHA world members won’t be able to see the content '),
          secondPart: t('of your beam because you have violated the following '),
          thirdPart: { url: '' /*@TODO */, content: t('Code of Conduct.') },
          tapToViewLabel: t('Tap to view'),
        },
        others: {
          firstLine: t('This beam has been delisted for the violation of our Code of Conduct.'),
          secondLine: t('All reflections are disabled.'),
        },
      }}
      nsfw={{
        sensitiveContentLabel: t('Sensitive Content!'),
        clickToViewLabel: t('Click to View'),
      }}
      showHiddenContent={showHiddenContent}
      showNSFWCard={showNSFWCard}
      nsfwUserSetting={showNsfw}
      showLoginModal={showLoginModal}
      isLoggedIn={!!authenticatedDID}
      itemType={EntityTypes.BEAM}
      onTagClick={onTagClick}
      onReflect={() => {
        if (!authenticatedDID) {
          showLoginModal?.();
          return;
        }
        onReflect();
      }}
      onEntryFlag={handleFlagBeam}
      profileAvatarExt={
        <AuthorProfileAvatar
          authorId={entryData.authorId}
          hidePublishTime={hidePublishTime}
          createdAt={entryData?.createdAt}
        />
      }
      actionsRight={
        <ActionButtons
          appName={appName}
          showBlockName={showBlockName}
          showHiddenContent={showHiddenContent}
          onShowBlockName={() => {
            setShowBlockName(!showBlockName);
          }}
        />
      }
      {...rest}
    >
      {({ blockID }) => (
        <React.Suspense fallback={<></>}>
          <ContentBlockRenderer
            blockID={blockID}
            authenticatedDID={authenticatedDID}
            showHiddenContent={showHiddenContent}
            beamIsNsfw={showNSFWCard}
            showBlockName={showBlockName}
            onBlockInfoChange={blockInfo => {
              setAppName(blockInfo?.appName);
              setBlockNameMap(new Map(blockNameMap.set(blockID, blockInfo?.blockName)));
            }}
            onContentClick={onContentClick}
          />
        </React.Suspense>
      )}
    </EntryCard>
  );
};

export default BeamCard;
