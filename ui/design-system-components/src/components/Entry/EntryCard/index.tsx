import React, { ReactElement, ReactNode, Ref, CSSProperties, Fragment, useState } from 'react';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import ProfileAvatarButton from '@akashaorg/design-system-core/lib/components/ProfileAvatarButton';
import Tooltip from '@akashaorg/design-system-core/lib/components/Tooltip';
import EntryCardRemoved, { AuthorsRemovedMessage, OthersRemovedMessage } from '../EntryCardRemoved';
import CardActions from './card-actions';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import ReadOnlyEditor from '../../ReadOnlyEditor';
import AuthorProfileLoading from '../EntryCardLoading/author-profile-loading';
import NSFW, { NSFWProps } from '../NSFW';
import Menu from '@akashaorg/design-system-core/lib/components/Menu';
import {
  ILocale,
  formatRelativeTime,
  getColorClasses,
} from '@akashaorg/design-system-core/lib/utils';
import { formatDate } from '../../../utils/time';
import { Descendant } from 'slate';
import { AkashaBeam, AkashaReflect } from '@akashaorg/typings/lib/sdk/graphql-types-new';
import { AkashaProfile, EntityTypes, NavigateToParams } from '@akashaorg/typings/lib/ui';
import { ListItem } from '@akashaorg/design-system-core/lib/components/List';

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
  notEditableLabel?: string;
  removed?: {
    author: AuthorsRemovedMessage;
    others: OthersRemovedMessage;
  };
  editLabel?: string;
  nsfw?: Omit<NSFWProps, 'onClickToView'>;
  profileAnchorLink?: string;
  repliesAnchorLink?: string;
  disableReporting?: boolean;
  hidePublishTime?: boolean;
  disableActions?: boolean;
  plainCard?: boolean;
  hideActionButtons?: boolean;
  scrollHiddenContent?: boolean;
  contentClickable?: boolean;
  lastEntry?: boolean;
  hover?: boolean;
  editable?: boolean;
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
    notEditableLabel,
    editLabel,
    nsfw,
    profileAnchorLink,
    repliesAnchorLink,
    disableReporting,
    hidePublishTime,
    disableActions,
    plainCard = false,
    hideActionButtons,
    scrollHiddenContent,
    contentClickable,
    editable = true,
    lastEntry,
    hover,
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

  const menuItems: ListItem[] = [
    ...(!entryData.author.isViewer
      ? [
          {
            icon: 'FlagIcon' as const,
            label: flagAsLabel,
            color: { light: 'errorLight' as const, dark: 'errorDark' as const },
            disabled: disableReporting,
            onClick: onEntryFlag,
          },
        ]
      : []),
    ...(entryData.author.isViewer
      ? [
          {
            icon: 'PencilIcon' as const,
            label: editLabel,
            disabled: !editable,
            toolTipContent: editable ? null : notEditableLabel,
            onClick: onEdit,
          },
        ]
      : []),
  ];

  const hoverStyleLastEntry = lastEntry ? 'rounded-b-2xl' : '';
  const hoverStyle = hover
    ? `${getColorClasses({ light: 'grey9/60', dark: 'grey3' }, 'hover:bg')} ${hoverStyleLastEntry}`
    : '';

  const publishTime = entryData?.createdAt ? formatRelativeTime(entryData.createdAt, locale) : '';

  const entryCardUi = (
    <Stack spacing="gap-y-2" padding="p-4" customStyle={hoverStyle}>
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
              metadata={
                publishTime &&
                !hidePublishTime && (
                  <Stack direction="row" align="center" spacing="gap-x-1">
                    <Text
                      variant="footnotes2"
                      weight="normal"
                      color={{ light: 'grey4', dark: 'grey7' }}
                    >
                      ·
                    </Text>
                    <Tooltip placement={'top'} content={formatDate(entryData?.createdAt, locale)}>
                      <Text
                        variant="footnotes2"
                        weight="normal"
                        color={{ light: 'grey4', dark: 'grey7' }}
                      >
                        {publishTime}
                      </Text>
                    </Tooltip>
                  </Stack>
                )
              }
              onClick={() => {
                if (onAvatarClick) onAvatarClick(entryData.author.id);
              }}
              ref={profileRef}
            />
          )}
        </>
        <Menu
          anchor={{
            icon: 'EllipsisHorizontalIcon',
            plainIcon: true,
            iconOnly: true,
            size: 'md',
          }}
          items={menuItems}
          disabled={disableActions}
          customStyle="shrink-0"
        />
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

  return plainCard ? (
    <>{entryCardUi}</>
  ) : (
    <Card ref={ref} padding="p-0">
      {entryCardUi}
    </Card>
  );
};

export default EntryCard;
