import React, { useState } from 'react';
import EntryCard, {
  EntryCardProps,
} from '@akashaorg/design-system-components/lib/components/Entry/EntryCard';
import ContentBlockRenderer from './content-block-renderer';
import ActionButtons from './action-buttons';
import AuthorProfileAvatar from '../author-profile-avatar';
import { sortByKey, useAkashaStore } from '@akashaorg/ui-awf-hooks';
import { EntityTypes, BeamData } from '@akashaorg/typings/lib/ui';
import { useRootComponentProps, useNsfwToggling } from '@akashaorg/ui-awf-hooks';
import { Trans, useTranslation } from 'react-i18next';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import Link from '@akashaorg/design-system-core/lib/components/Link';
import Button from '@akashaorg/design-system-core/lib/components/Button';

type BeamCardProps = Pick<
  EntryCardProps,
  | 'contentClickable'
  | 'noWrapperCard'
  | 'onContentClick'
  | 'onReflect'
  | 'hideActionButtons'
  | 'disableActions'
  | 'showHiddenContent'
  | 'customStyle'
> & {
  entryData: BeamData;
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

  const { getRoutingPlugin, navigateToModal } = useRootComponentProps();
  const {
    data: { authenticatedDID },
  } = useAkashaStore();
  const [appName, setAppName] = useState('');
  const [blockNameMap, setBlockNameMap] = useState(new Map());
  const [showBlockName, setShowBlockName] = useState(false);
  const navigateTo = getRoutingPlugin().navigateTo;

  const { showNsfw } = useNsfwToggling();

  const handleFlagBeam = () => {
    navigateTo({
      appName: '@akashaorg/app-vibes',
      getNavigationUrl: () => `/report/beam/${entryData.id}`,
    });
  };

  const handleTagClick = (tag: string) => {
    navigateTo({
      appName: '@akashaorg/app-antenna',
      getNavigationUrl: routes => `${routes.Tags}/${tag}`,
    });
  };

  const handleEntryRemove = () => {
    navigateToModal({
      name: `remove-beam-confirmation`,
      beamId: entryData.id,
    });
  };

  const sortedEntryContent = React.useMemo(() => {
    return sortByKey(entryData.content, 'order');
  }, [entryData.content]);

  return (
    <EntryCard
      dataTestId="beam-card"
      entryData={entryData}
      reflectionsCount={entryData?.reflectionsCount}
      reflectAnchorLink="/@akashaorg/app-antenna/beam"
      sortedContents={sortedEntryContent}
      flagAsLabel={t('Flag')}
      removeEntryLabel={t('Remove')}
      onEntryRemove={handleEntryRemove}
      isViewer={authenticatedDID === entryData.authorId}
      removed={{
        author: (
          <Trans
            defaults={`
              <txt>You have delisted this beam.</txt>
              <txt>Some users may still be able to see it in the antenna.</txt>
            `}
            components={{
              txt: <Text variant="button-sm" />,
            }}
          />
        ),
        others: (
          <Trans
            defaults={`
              <txt>This beam was delisted by the author.</txt>
              <txt>All reflections are disabled.</txt>
            `}
            components={{
              txt: <Text variant="button-sm" />,
            }}
          />
        ),
      }}
      moderated={{
        author: (
          <Trans
            defaults={`
              <txt>AKASHA world members won’t be able to see the content </txt>
              <txt>of your beam because you have violated the following <lnk>Code of Conduct</lnk></txt>
              <btn></btn>
            `}
            components={{
              txt: <Text variant="button-sm" />,
              lnk: <Link to={''} />,
              btn: (
                <Button
                  variant="text"
                  onClick={() => console.log('tap to view')}
                  label={t('Tap to view')}
                />
              ),
            }}
          />
        ),
        others: (
          <Trans
            defaults={`
              <txt>This beam has been delisted for the violation of our <lnk>Code of Conduct</lnk>.</txt>
              <txt>All reflections are disabled.</txt>
            `}
            components={{
              txt: <Text variant="button-sm" />,
              lnk: <Link to={''} />,
            }}
          />
        ),
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
      onTagClick={handleTagClick}
      onReflect={() => {
        if (!authenticatedDID) {
          showLoginModal?.();
          return;
        }
        onReflect();
      }}
      onContentClick={onContentClick}
      onEntryFlag={handleFlagBeam}
      profileAvatar={
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
          />
        </React.Suspense>
      )}
    </EntryCard>
  );
};

export default BeamCard;
