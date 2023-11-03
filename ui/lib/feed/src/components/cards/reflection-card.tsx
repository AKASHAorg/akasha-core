import React from 'react';
import EntryCard, {
  EntryCardProps,
} from '@akashaorg/design-system-components/lib/components/Entry/EntryCard';
import { hasOwn } from '@akashaorg/ui-awf-hooks';
import { ILocale } from '@akashaorg/design-system-core/lib/utils';
import { AkashaReflect } from '@akashaorg/typings/lib/sdk/graphql-types-new';
import { EntityTypes } from '@akashaorg/typings/lib/ui';
import { decodeb64SlateContent, useRootComponentProps } from '@akashaorg/ui-awf-hooks';
import { useGetProfileByDidQuery } from '@akashaorg/ui-awf-hooks/lib/generated/hooks-new';
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
  entryData: AkashaReflect;
};

const ReflectionCard: React.FC<ReflectCardProps> = props => {
  const { entryData, onReflect, ...rest } = props;
  const { getRoutingPlugin, getTranslationPlugin } = useRootComponentProps();
  const { t } = useTranslation('ui-lib-feed');
  const locale =
    /*TODO: fix typing in translation plugin and avoid type assertion*/ (getTranslationPlugin().i18n
      ?.languages?.[0] as ILocale) || 'en';

  const profileDataReq = useGetProfileByDidQuery(
    { id: entryData.author.id },
    { select: response => response.node },
  );
  const { akashaProfile: profileData } =
    profileDataReq.data && hasOwn(profileDataReq.data, 'isViewer')
      ? profileDataReq.data
      : { akashaProfile: null };

  const navigateTo = getRoutingPlugin().navigateTo;

  const onAvatarClick = (id: string) => {
    navigateTo({
      appName: '@akashaorg/app-profile',
      getNavigationUrl: routes => `${routes.rootRoute}/${id}`,
    });
  };

  return (
    <EntryCard
      entryData={entryData}
      authorProfile={{ data: profileData, status: profileDataReq.status }}
      locale={locale}
      profileAnchorLink="/@akashaorg/app-profile"
      slateContent={entryData.content.flatMap(item => decodeb64SlateContent(item.value))}
      noWrapperCard={true}
      flagAsLabel={t('Report')}
      editLabel={t('Edit')}
      removed={{
        author: {
          firstPart: t('AKASHA world members won’t be able to see the content '),
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
      nsfw={{
        sensitiveContentLabel: t('Sensitive Content!'),
        clickToViewLabel: t('Click to View'),
      }}
      itemType={EntityTypes.REFLECT}
      onReflect={onReflect}
      onAvatarClick={onAvatarClick}
      {...rest}
    />
  );
};

export default ReflectionCard;
