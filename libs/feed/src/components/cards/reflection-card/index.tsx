import React from 'react';
import EntryCard, { EntryCardProps } from '../entry-card';
import AuthorProfileAvatar from '../author-profile-avatar';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
import Link from '@akashaorg/design-system-core/lib/components/Link';
import { useAkashaStore } from '@akashaorg/ui-core-hooks';
import { ReflectionData } from '@akashaorg/typings/lib/ui';
import { decodeb64SlateContent, useRootComponentProps } from '@akashaorg/ui-core-hooks';
import { Trans, useTranslation } from 'react-i18next';
import { canDecodeContent } from '../../../utils/can-decode-content';
import ReadOnlyEditor from '../../read-only-editor';
import InlineNotification from '@akashaorg/design-system-core/lib/components/InlineNotification';
import { ListItem } from '@akashaorg/design-system-core/lib/components/List';
import { FlagIcon } from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';
export type ReflectionCardProps = Pick<
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
  reflectionData: ReflectionData;
  hidePublishTime?: boolean;
  pending?: boolean;
};
const ReflectionCard: React.FC<ReflectionCardProps> = props => {
  const { t } = useTranslation('ui-lib-feed');
  const { reflectionData, hidePublishTime, pending, onReflect, ...rest } = props;
  const { getCorePlugins } = useRootComponentProps();
  const {
    data: { authenticatedDID },
  } = useAkashaStore();
  const isLoggedIn = !!authenticatedDID;
  const navigateTo = getCorePlugins().routing.navigateTo;
  const handleMentionClick = profileDID => {
    navigateTo({
      appName: '@akashaorg/app-profile',
      getNavigationUrl: () => `/${profileDID}`,
    });
  };
  const handleFlagReflection = () => {
    navigateTo({
      appName: '@akashaorg/app-vibes',
      getNavigationUrl: () => `/report/reflection/${reflectionData.id}`,
    });
  };
  const isViewer = authenticatedDID === reflectionData.authorId;
  const menuItems: ListItem[] = !isViewer
    ? [
        {
          icon: <FlagIcon />,
          label: t('Flag'),
          color: {
            light: 'errorLight',
            dark: 'errorDark',
          } as const,
          disabled: false,
          onClick: handleFlagReflection,
        },
      ]
    : [];
  return (
    <EntryCard
      menuItems={menuItems}
      nsfwText={t('To view explicit or sensitive content, please connect to confirm your consent.')}
      dataTestId={pending ? 'pending-reflection-card' : 'reflection-card'}
      entryData={reflectionData}
      reflectAnchorLink="/@akashaorg/app-antenna/reflection"
      noWrapperCard={true}
      isViewer={authenticatedDID === reflectionData.authorId}
      isLoggedIn={isLoggedIn}
      removed={{
        author: (
          <Trans
            defaults={`
                {textComponent}You have delisted this reflection.{textComponent}
                {textComponent}Some users may still be able to see it in the beam page.{textComponent}
                `}
            components={{
              textComponent: <Typography variant="xs" bold />,
            }}
          />
        ),
        others: t(
          `
                {textComponent}This reflection was delisted by the author.{textComponent}
                {textComponent}All reflections are disabled.{textComponent}
                `,
          {
            textComponent: <Typography />,
          },
        ),
      }}
      moderated={{
        author: (
          <Trans
            defaults={`
                {textComponent}AKASHA world members won't be able to see the content {textComponent}
                {textComponent}of your reflection because you have violated the following {textComponent}
                {linkComponent}Code of conduct{linkComponent}
                `}
            component={{
              textComponent: <Typography />,
              linkComponent: <Link />,
            }}
          />
        ),
        others: (
          <Trans
            defaults={`
                {textComponent}This reflection has been delisted for the violation of our Code of Conduct.{textComponent}
                {textComponent}All reflections are disabled.{textComponent}
                `}
            components={{
              textComponent: <Typography />,
            }}
          />
        ),
      }}
      onReflect={onReflect}
      onEntryFlag={handleFlagReflection}
      onMentionClick={handleMentionClick}
      profileAvatar={
        <AuthorProfileAvatar
          authorId={reflectionData.authorId}
          hidePublishTime={hidePublishTime}
          pending={pending}
          createdAt={reflectionData?.createdAt}
        />
      }
      {...rest}
    >
      {canDecodeContent(reflectionData.content) ? (
        <ReadOnlyEditor
          content={reflectionData.content.flatMap(item => decodeb64SlateContent(item.value))}
          disabled={reflectionData.nsfw}
          handleMentionClick={handleMentionClick}
          handleLinkClick={url => {
            navigateTo?.({
              getNavigationUrl: () => url,
            });
          }}
        />
      ) : (
        <InlineNotification
          title={t('Reflection can’t be loaded')}
          message={t('Unable to decode reflection content.')}
          type="error"
        />
      )}
    </EntryCard>
  );
};
export default ReflectionCard;
