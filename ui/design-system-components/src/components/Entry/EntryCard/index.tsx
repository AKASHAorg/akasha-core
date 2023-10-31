import React, { ReactElement, ReactNode, Ref, CSSProperties, Fragment, useState } from 'react';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import ProfileAvatarButton from '@akashaorg/design-system-core/lib/components/ProfileAvatarButton';
import Tooltip from '@akashaorg/design-system-core/lib/components/Tooltip';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import EntryCardRemoved, { AuthorsRemovedMessage, OthersRemovedMessage } from '../EntryCardRemoved';
import CardActions from './card-actions';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import CardHeaderMenuDropdown from './card-header-menu';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import ReadOnlyEditor from '../../ReadOnlyEditor';
import AuthorProfileLoading from '../EntryCardLoading/author-profile-loading';
import NSFW, { NSFWProps } from '../NSFW';
import { ILocale, formatRelativeTime } from '@akashaorg/design-system-core/lib/utils';
import { formatDate } from '../../../utils/time';
import { Descendant } from 'slate';
import { AkashaBeam, AkashaReflect } from '@akashaorg/typings/lib/sdk/graphql-types-new';
import { AkashaProfile, EntityTypes, NavigateToParams } from '@akashaorg/typings/lib/ui';

export type EntryCardProps = {
  entryData: Omit<AkashaBeam, 'reflectionsCount' | 'reflections'> | AkashaReflect;
  authorProfile: {
    data: Pick<AkashaProfile, 'name' | 'avatar' | 'did'>;
    status: 'loading' | 'error' | 'success';
  };
  locale?: ILocale;
  flagAsLabel?: string;
  moderatedContentLabel?: string;
  ctaLabel?: string;
  removeEntryLabel?: string;
  removed?: {
    author: AuthorsRemovedMessage;
    others: OthersRemovedMessage;
  };
  nsfw?: Omit<NSFWProps, 'onClickToView'>;
  profileAnchorLink?: string;
  repliesAnchorLink?: string;
  disableReporting?: boolean;
  hidePublishTime?: boolean;
  disableActions?: boolean;
  noWrapperCard?: boolean;
  hideActionButtons?: boolean;
  scrollHiddenContent?: boolean;
  contentClickable?: boolean;
  editable?: boolean;
  notEditableLabel?: string;
  headerMenuExt?: ReactElement;
  actionsRightExt?: ReactNode;
  customStyle?: CSSProperties;
  ref?: Ref<HTMLDivElement>;
  onReflect?: () => void;
  onAvatarClick?: (profileId: string) => void;
  onContentClick?: () => void;
  onEntryRemove?: (itemId: string) => void;
  onEntryFlag?: () => void;
  onEdit?: () => void;
} & (
  | {
      sortedContents: AkashaBeam['content'];
      itemType: EntityTypes.BEAM;
      children: (props: { blockID: string }) => ReactElement;
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
    locale,
    ref,
    authorProfile,
    flagAsLabel,
    removed,
    nsfw,
    profileAnchorLink,
    repliesAnchorLink,
    disableReporting,
    hidePublishTime,
    disableActions,
    noWrapperCard = false,
    hideActionButtons,
    scrollHiddenContent,
    contentClickable,
    notEditableLabel,
    editable = true,
    headerMenuExt,
    actionsRightExt,
    onAvatarClick,
    onContentClick,
    onEntryFlag,
    onReflect,
    onEdit,
    ...rest
  } = props;

  const profileRef: React.Ref<HTMLDivElement> = React.useRef(null);

  const [showNSFW, setShowNSFW] = useState(false);

  const scrollHiddenStyle = scrollHiddenContent ? 'overflow-auto' : 'overflow-hidden';
  const contentClickableStyle = contentClickable ? 'cursor-pointer' : 'cursor-default';
  const nsfwHeightStyle = entryData.nsfw && !showNSFW ? 'min-h-[6rem]' : '';
  const nsfwBlurStyle = entryData.nsfw && !showNSFW ? 'blur-lg' : '';

  const editableIconButtonUi = (
    <Button onClick={editable ? onEdit : null} disabled={!editable} plain>
      <Icon size="md" type="PencilIcon" />
    </Button>
  );

  const entryCardUi = (
    <Stack spacing="gap-y-2" padding="p-4">
      <Stack direction="row" justify="between">
        <>
          {authorProfile.status === 'loading' ? (
            <AuthorProfileLoading />
          ) : (
            <ProfileAvatarButton
              data-testid="entry-profile-detail"
              profileId={entryData.author.id}
              label={
                authorProfile.status === 'error' ? entryData.author.id : authorProfile.data?.name
              }
              avatarImage={authorProfile.status === 'error' ? null : authorProfile.data?.avatar}
              href={`${profileAnchorLink}/${entryData.author.id}`}
              onClick={() => {
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
          {entryData?.createdAt &&
            (notEditableLabel ? (
              <Tooltip placement={'top'} content={notEditableLabel}>
                {editableIconButtonUi}
              </Tooltip>
            ) : (
              editable && editableIconButtonUi
            ))}
          {!entryData.active && (
            <CardHeaderMenuDropdown
              disabled={disableActions}
              menuItems={
                !entryData.author.isViewer
                  ? [
                      {
                        icon: 'FlagIcon',
                        label: flagAsLabel,
                        disabled: disableReporting,
                        handler: onEntryFlag,
                      },
                    ]
                  : []
              }
              headerMenuExt={headerMenuExt}
            />
          )}
        </Stack>
      </Stack>
      {!entryData.active && (
        <EntryCardRemoved
          {...(entryData.author.isViewer
            ? {
                type: 'author',
                message: removed.author,
                onTapToView: () => {
                  //@TODO
                },
              }
            : { type: 'others', message: removed.others })}
        />
      )}
      {entryData.active && (
        <Button onClick={onContentClick} plain>
          <Stack
            align="center"
            justify="center"
            customStyle={`relative max-h-[50rem] ${scrollHiddenStyle} ${contentClickableStyle} ${nsfwHeightStyle}`}
            data-testid="entry-content"
          >
            {entryData.nsfw && !showNSFW && (
              <Stack customStyle="absolute w-36 h-16 z-10">
                <NSFW
                  {...nsfw}
                  onClickToView={() => {
                    setShowNSFW(true);
                  }}
                />
              </Stack>
            )}
            <Stack justifySelf="start" alignSelf="start" customStyle={nsfwBlurStyle}>
              {rest.itemType === EntityTypes.REFLECT ? (
                <ReadOnlyEditor
                  content={rest.slateContent}
                  disabled={entryData.nsfw}
                  handleMentionClick={rest.onMentionClick}
                  handleTagClick={rest.onTagClick}
                  handleLinkClick={url => {
                    rest.navigateTo?.({ getNavigationUrl: () => url });
                  }}
                />
              ) : (
                rest.sortedContents?.map(item => (
                  <Fragment key={item.blockID}>{rest.children({ blockID: item.blockID })}</Fragment>
                ))
              )}
            </Stack>
          </Stack>
        </Button>
      )}
      {!hideActionButtons && (
        <CardActions
          itemId={entryData.id}
          repliesAnchorLink={repliesAnchorLink}
          disableActions={disableActions || !entryData.active}
          actionsRightExt={actionsRightExt}
          onReflect={onReflect}
        />
      )}
    </Stack>
  );

  return noWrapperCard ? (
    <>{entryCardUi}</>
  ) : (
    <Card ref={ref} padding="p-0">
      {entryCardUi}
    </Card>
  );
};

export default EntryCard;
