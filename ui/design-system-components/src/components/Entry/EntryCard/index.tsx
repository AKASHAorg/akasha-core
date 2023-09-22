import React from 'react';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import ProfileAvatarButton from '@akashaorg/design-system-core/lib/components/ProfileAvatarButton';
import Tooltip from '@akashaorg/design-system-core/lib/components/Tooltip';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import EntryCardRemoved from '../EntryCardRemoved';
import CardActions from './card-actions';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import CardHeaderMenuDropdown from './card-header-menu';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import ReadOnlyEditor from '../../ReadOnlyEditor';
import Extension from '../../Extension';
import AuthorProfileLoading from '../EntryCardLoading/author-profile-loading';
import { ILocale, formatRelativeTime } from '@akashaorg/design-system-core/lib/utils';
import { formatDate } from '../../../utils/time';
import { Descendant } from 'slate';
import { AkashaBeam, AkashaReflect } from '@akashaorg/typings/lib/sdk/graphql-types-new';
import {
  AkashaProfile,
  EntityTypes,
  NavigateToParams,
  RootComponentProps,
} from '@akashaorg/typings/lib/ui';

export type EntryCardProps = {
  entryData: Omit<AkashaBeam, 'reflectionsCount' | 'reflections'> | AkashaReflect;
  authorProfile: {
    data: Pick<AkashaProfile, 'name' | 'avatar' | 'did'>;
    status: 'loading' | 'error' | 'success';
  };
  locale?: ILocale;
  editedLabel?: string;
  profileAnchorLink?: string;
  repliesAnchorLink?: string;
  flagAsLabel?: string;
  removedByMeLabel?: string;
  removedByAuthorLabel?: string;
  removeEntryLabel?: string;
  moderatedContentLabel?: string;
  ctaLabel?: string;
  disableReporting?: boolean;
  hidePublishTime?: boolean;
  isModerated?: boolean;
  disableActions?: boolean;
  hideActionButtons?: boolean;
  isRemoved?: boolean;
  scrollHiddenContent?: boolean;
  contentClickable?: boolean;
  headerMenuExt?: React.ReactElement;
  actionsRightExt?: React.ReactNode;
  customStyle?: React.CSSProperties;
  ref?: React.Ref<HTMLDivElement>;
  onAvatarClick?: (profileId: string) => void;
  onContentClick?: () => void;
  onEntryRemove?: (itemId: string) => void;
  onEntryFlag?: () => void;
  onReflect?: () => void;
} & (
  | {
      sortedContents: AkashaBeam['content'];
      uiEvents: RootComponentProps['uiEvents'];
      itemType: EntityTypes.BEAM;
    }
  | {
      slateContent: Descendant[];
      itemType: EntityTypes.REFLECT;
      onMentionClick?: (profileId: string) => void;
      onTagClick?: (name: string) => void;
      navigateTo?: (args: NavigateToParams) => void;
    }
);

const EntryCard: React.FC<EntryCardProps> = props => {
  const {
    entryData,
    authorProfile,
    editedLabel,
    locale,
    ref,
    profileAnchorLink,
    repliesAnchorLink,
    flagAsLabel,
    removedByMeLabel,
    removedByAuthorLabel,
    disableReporting,
    hidePublishTime,
    isModerated,
    disableActions,
    hideActionButtons,
    isRemoved,
    scrollHiddenContent,
    contentClickable,
    headerMenuExt,
    actionsRightExt,
    onAvatarClick,
    onContentClick,
    onEntryFlag,
    onReflect,
    ...rest
  } = props;

  const profileRef: React.Ref<HTMLDivElement> = React.useRef(null);

  return (
    <Card ref={ref} padding="p-0">
      <Stack direction="row" justify="between" customStyle="p-4 shrink-0">
        <>
          {authorProfile.status === 'loading' ? (
            <AuthorProfileLoading />
          ) : (
            <ProfileAvatarButton
              data-testid="entry-profile-detail"
              profileId={
                authorProfile.status === 'error' ? entryData.author.id : authorProfile.data.did?.id
              }
              label={
                authorProfile.status === 'error' ? entryData.author.id : authorProfile.data.name
              }
              avatarImage={authorProfile.status === 'error' ? null : authorProfile.data?.avatar}
              href={`${profileAnchorLink}/${entryData.author.id}`}
              onClick={event => {
                event.preventDefault();
                if (onAvatarClick) onAvatarClick(entryData.author.id);
              }}
              ref={profileRef}
            />
          )}
        </>
        <Stack direction="row" spacing="gap-2" align="center" customStyle="shrink-0">
          {entryData?.createdAt && !hidePublishTime && (
            <Tooltip placement={'top'} content={formatDate(entryData?.createdAt, locale)}>
              <Text customStyle="flex shrink-0 text(grey4 dark:grey7)">
                {formatRelativeTime(entryData?.createdAt, locale)}
              </Text>
            </Tooltip>
          )}
          {entryData?.createdAt && (
            <Tooltip
              placement={'top'}
              content={`${editedLabel} ${formatRelativeTime(entryData?.createdAt, locale)}`}
            >
              <Icon size="sm" type="PencilIcon" />
            </Tooltip>
          )}
          {!entryData.active && (
            <CardHeaderMenuDropdown
              disabled={disableActions}
              menuItems={
                !entryData.author.isViewer
                  ? [
                      {
                        icon: 'FlagIcon',
                        handler: onEntryFlag,
                        label: flagAsLabel,
                        disabled: disableReporting,
                      },
                    ]
                  : []
              }
              headerMenuExt={headerMenuExt}
            />
          )}
        </Stack>
      </Stack>
      {isRemoved && (
        <EntryCardRemoved
          isAuthor={entryData.author.isViewer}
          removedByAuthorLabel={removedByAuthorLabel}
          removedByMeLabel={removedByMeLabel}
        />
      )}
      {!isRemoved && (
        <Button onClick={onContentClick} plain>
          <Stack
            customStyle={`px-4 max-h-[50rem] ${
              scrollHiddenContent ? 'overflow-auto' : 'overflow-hidden'
            } ${contentClickable ? 'cursor-pointer' : 'cursor-default'}`}
            data-testid="entry-content"
          >
            {rest.itemType === EntityTypes.REFLECT ? (
              <ReadOnlyEditor
                content={rest.slateContent}
                handleMentionClick={rest.onMentionClick}
                handleTagClick={rest.onTagClick}
                handleLinkClick={url => {
                  rest.navigateTo?.({ getNavigationUrl: () => url });
                }}
              />
            ) : (
              rest.sortedContents.map(item => (
                <Extension
                  key={item.blockID}
                  name={`${item.blockID}_content_block`}
                  uiEvents={rest.uiEvents}
                />
              ))
            )}
          </Stack>
        </Button>
      )}
      {!hideActionButtons && (
        <CardActions
          profileId={entryData.author.id}
          repliesAnchorLink={repliesAnchorLink}
          disableActions={disableActions}
          isModerated={isModerated}
          actionsRightExt={actionsRightExt}
          onReflect={onReflect}
        />
      )}
    </Card>
  );
};

export default EntryCard;
