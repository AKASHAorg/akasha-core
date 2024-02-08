import React, { useState } from 'react';
import EntryCard, {
  EntryCardProps,
} from '@akashaorg/design-system-components/lib/components/Entry/EntryCard';
import ContentBlock from './content-block';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import ActionButtons from './action-buttons';
import { transformSource, hasOwn, sortByKey, useGetLogin } from '@akashaorg/ui-awf-hooks';
import { EntityTypes, BeamEntryData } from '@akashaorg/typings/lib/ui';
import { useRootComponentProps } from '@akashaorg/ui-awf-hooks';
import { useGetProfileByDidQuery } from '@akashaorg/ui-awf-hooks/lib/generated/apollo';
import { useTranslation } from 'react-i18next';
import { Transition } from '@headlessui/react';

type BeamCardProps = Pick<
  EntryCardProps,
  | 'contentClickable'
  | 'noWrapperCard'
  | 'onContentClick'
  | 'onReflect'
  | 'hidePublishTime'
  | 'hideActionButtons'
  | 'disableActions'
  | 'showHiddenContent'
> & {
  entryData: BeamEntryData;
  showNSFWCard: boolean;
  showLoginModal?: () => void;
};

const BeamCard: React.FC<BeamCardProps> = props => {
  const { t } = useTranslation('ui-lib-feed');
  const { entryData, onReflect, showHiddenContent, showNSFWCard, showLoginModal, ...rest } = props;
  const { getRoutingPlugin } = useRootComponentProps();
  const { getTranslationPlugin } = useRootComponentProps();
  const { data } = useGetLogin();
  const [appName, setAppName] = useState('');
  const [blockNameMap, setBlockNameMap] = useState(new Map());
  const [showBlockName, setShowBlockName] = useState(false);
  const navigateTo = getRoutingPlugin().navigateTo;
  const authenticatedDID = data?.id;

  const {
    data: profileDataReq,
    error,
    loading,
  } = useGetProfileByDidQuery({
    variables: { id: entryData.authorId },
  });

  const { akashaProfile: profileData } =
    profileDataReq?.node && hasOwn(profileDataReq.node, 'akashaProfile')
      ? profileDataReq.node
      : { akashaProfile: null };
  const locale = getTranslationPlugin().i18n?.languages?.[0] || 'en';

  const onAvatarClick = (id: string) => {
    navigateTo({
      appName: '@akashaorg/app-profile',
      getNavigationUrl: routes => `${routes.rootRoute}/${id}`,
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
      authorProfile={{ data: profileData, loading, error }}
      locale={locale}
      repliesAnchorLink="/@akashaorg/app-akasha-integration/beam"
      profileAnchorLink="/@akashaorg/app-profile"
      sortedContents={sortedEntryContent}
      flagAsLabel={t('Report')}
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
      showLoginModal={showLoginModal}
      isLoggedIn={!!authenticatedDID}
      itemType={EntityTypes.BEAM}
      transformSource={transformSource}
      onAvatarClick={onAvatarClick}
      onTagClick={onTagClick}
      onReflect={onReflect}
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
      {({ blockID }) => {
        const blockName = blockNameMap.get(blockID);
        return (
          <React.Suspense fallback={<></>}>
            <Stack spacing="gap-y-0" fullWidth>
              <Transition
                enter="transition-[height] ease-out duration-300"
                enterFrom="h-0"
                enterTo="h-[18px]"
                leave="transition-[height] ease-in duration-300"
                leaveFrom="h-[18px]"
                leaveTo="h-0"
                show={showBlockName && !!blockName}
              >
                <Text
                  variant="footnotes2"
                  weight="normal"
                  color={{ light: 'grey7', dark: 'grey6' }}
                >
                  {t('{{blockName}}', { blockName })}
                </Text>
              </Transition>
              <ContentBlock
                blockID={blockID}
                authenticatedDID={authenticatedDID}
                showHiddenContent={showHiddenContent}
                onBlockInfoChange={blockInfo => {
                  setAppName(blockInfo?.appName);
                  setBlockNameMap(new Map(blockNameMap.set(blockID, blockInfo?.blockName)));
                }}
              />
            </Stack>
          </React.Suspense>
        );
      }}
    </EntryCard>
  );
};

export default BeamCard;
