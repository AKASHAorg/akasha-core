import React from 'react';
import EntryCard, {
  EntryCardProps,
} from '@akashaorg/design-system-components/lib/components/Entry/EntryCard';
import AuthorProfileAvatar from '../author-profile-avatar';
import { useAkashaStore } from '@akashaorg/ui-awf-hooks';
import { EntityTypes, ReflectEntryData } from '@akashaorg/typings/lib/ui';
import { decodeb64SlateContent, useRootComponentProps } from '@akashaorg/ui-awf-hooks';
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
  | 'hideActionButtons'
  | 'disableActions'
  | 'hover'
  | 'lastEntry'
> & {
  entryData: ReflectEntryData;
  hidePublishTime?: boolean;
};

const ReflectionCard: React.FC<ReflectCardProps> = props => {
  const { t } = useTranslation('ui-lib-feed');
  const { entryData, hidePublishTime, onReflect, ...rest } = props;
  const { getRoutingPlugin } = useRootComponentProps();
  const {
    data: { authenticatedDID },
  } = useAkashaStore();
  const isLoggedIn = !!authenticatedDID;

  const navigateTo = getRoutingPlugin().navigateTo;

  const handleFlagReflection = () => {
    navigateTo({
      appName: '@akashaorg/app-vibes',
      getNavigationUrl: () => `/report/reflection/${entryData.id}`,
    });
  };

  return (
    <EntryCard
      entryData={entryData}
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
      onReflect={onReflect}
      onEntryFlag={handleFlagReflection}
      profileAvatarExt={
        <AuthorProfileAvatar
          authorId={entryData.authorId}
          hidePublishTime={hidePublishTime}
          createdAt={entryData?.createdAt}
        />
      }
      {...rest}
    />
  );
};

export default ReflectionCard;
