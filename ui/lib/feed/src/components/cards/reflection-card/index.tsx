import React from 'react';
import EntryCard, {
  EntryCardProps,
} from '@akashaorg/design-system-components/lib/components/Entry/EntryCard';
import { transformSource, hasOwn, useGetLogin } from '@akashaorg/ui-awf-hooks';
import { EntityTypes, ReflectEntryData } from '@akashaorg/typings/lib/ui';
import { decodeb64SlateContent, useRootComponentProps } from '@akashaorg/ui-awf-hooks';
import { useGetProfileByDidQuery } from '@akashaorg/ui-awf-hooks/lib/generated/apollo';
import { useTranslation } from 'react-i18next';

export type ReflectCardProps = Pick<
  EntryCardProps,
  | 'contentClickable'
  | 'noWrapperCard'
  | 'onContentClick'
  | 'onEdit'
  | 'onReflect'
  | 'editable'
  | 'notEditableLabel'
  | 'hidePublishTime'
  | 'hideActionButtons'
  | 'disableActions'
  | 'hover'
  | 'lastEntry'
> & {
  entryData: ReflectEntryData;
};

const ReflectionCard: React.FC<ReflectCardProps> = props => {
  const { t } = useTranslation('ui-lib-feed');
  const { entryData, onReflect, ...rest } = props;
  const { getRoutingPlugin, getTranslationPlugin } = useRootComponentProps();
  const { data } = useGetLogin();
  const locale = getTranslationPlugin().i18n?.languages?.[0] || 'en';
  const authenticatedDID = data?.id;
  const isLoggedIn = !!data?.id;

  const {
    data: profileDataReq,
    loading,
    error,
  } = useGetProfileByDidQuery({
    variables: { id: entryData.authorId },
  });
  const { akashaProfile: profileData } =
    profileDataReq?.node && hasOwn(profileDataReq.node, 'akashaProfile')
      ? profileDataReq.node
      : { akashaProfile: null };

  const navigateTo = getRoutingPlugin().navigateTo;

  const onAvatarClick = (id: string) => {
    navigateTo({
      appName: '@akashaorg/app-profile',
      getNavigationUrl: routes => `${routes.rootRoute}/${id}`,
    });
  };

  const handleFlagReflection = () => {
    navigateTo({
      appName: '@akashaorg/app-vibes',
      getNavigationUrl: () => `/report/reflection/${entryData.id}`,
    });
  };

  return (
    <EntryCard
      entryData={entryData}
      authorProfile={{ data: profileData, loading, error }}
      locale={locale}
      profileAnchorLink="/@akashaorg/app-profile"
      reflectAnchorLink="/@akashaorg/app-akasha-integration/reflection"
      slateContent={entryData.content.flatMap(item => decodeb64SlateContent(item.value))}
      noWrapperCard={true}
      flagAsLabel={t('Flag')}
      editLabel={t('Edit')}
      isViewer={authenticatedDID === entryData.authorId}
      isLoggedIn={isLoggedIn}
      removed={{
        author: {
          firstPart: t("AKASHA world members won't be able to see the content "),
          secondPart: t('of your reflection because you have violated the following '),
          thirdPart: { url: '' /*@TODO */, content: t('Code of Conduct.') },
          tapToViewLabel: t('Tap to view'),
        },
        others: {
          firstLine: t(
            'This reflection has been delisted for the violation of our Code of Conduct.',
          ),
          secondLine: t('All reflections are disabled.'),
        },
      }}
      itemType={EntityTypes.REFLECT}
      transformSource={transformSource}
      onReflect={onReflect}
      onEntryFlag={handleFlagReflection}
      onAvatarClick={onAvatarClick}
      {...rest}
    />
  );
};

export default ReflectionCard;
