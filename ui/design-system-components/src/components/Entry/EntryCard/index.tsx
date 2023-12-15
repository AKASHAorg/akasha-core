import React, { ReactElement, ReactNode, Ref, CSSProperties, Fragment, useState } from 'react';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import ProfileAvatarButton from '@akashaorg/design-system-core/lib/components/ProfileAvatarButton';
import Tooltip from '@akashaorg/design-system-core/lib/components/Tooltip';
import EntryCardRemoved, { AuthorsRemovedMessage, OthersRemovedMessage } from '../EntryCardRemoved';
import CardActions from './card-actions';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import {
  EllipsisHorizontalIcon,
  FlagIcon,
  PencilIcon,
} from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';
import ReadOnlyEditor from '../../ReadOnlyEditor';
import AuthorProfileLoading from '../EntryCardLoading/author-profile-loading';
import NSFW, { NSFWProps } from '../NSFW';
import Menu from '@akashaorg/design-system-core/lib/components/Menu';
import {
  formatDate,
  formatRelativeTime,
  getColorClasses,
} from '@akashaorg/design-system-core/lib/utils';
import { Descendant } from 'slate';
import { AkashaBeam } from '@akashaorg/typings/lib/sdk/graphql-types-new';
import {
  type EntryData,
  AkashaProfile,
  EntityTypes,
  type Image,
  NavigateToParams,
} from '@akashaorg/typings/lib/ui';
import { ListItem } from '@akashaorg/design-system-core/lib/components/List';

export type EntryCardProps = {
  entryData: EntryData;
  authorProfile: {
    data: Pick<AkashaProfile, 'name' | 'avatar' | 'did'>;
    status: 'loading' | 'error' | 'success';
  };
  locale?: string;
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
  isViewer?: boolean;
  hidePublishTime?: boolean;
  disableActions?: boolean;
  noWrapperCard?: boolean;
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
  transformSource: (src: Image) => Image;
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
    isViewer,
    hidePublishTime,
    disableActions,
    noWrapperCard = false,
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
    transformSource,
    ...rest
  } = props;

  const profileRef: React.Ref<HTMLDivElement> = React.useRef(null);

  const [showNSFW, setShowNSFW] = useState(false);

  const scrollHiddenStyle = scrollHiddenContent ? 'overflow-auto' : 'overflow-hidden';
  const contentClickableStyle = contentClickable ? 'cursor-pointer' : 'cursor-default';
  const nsfwHeightStyle = entryData.nsfw && !showNSFW ? 'min-h-[6rem]' : '';
  const nsfwBlurStyle = entryData.nsfw && !showNSFW ? 'blur-lg' : '';

  const menuItems: ListItem[] = [
    ...(!isViewer
      ? [
          {
            icon: <FlagIcon />,
            label: flagAsLabel,
            color: { light: 'errorLight' as const, dark: 'errorDark' as const },
            disabled: disableReporting,
            onClick: onEntryFlag,
          },
        ]
      : []),
    ...(isViewer
      ? [
          {
            icon: <PencilIcon />,
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

  const avatar = authorProfile.status === 'error' ? null : authorProfile.data?.avatar;

  const entryCardUi = (
    <Stack spacing="gap-y-2" padding="p-4" customStyle={hoverStyle}>
      <Stack direction="row" justify="between">
        <>
          {authorProfile.status === 'loading' ? (
            <AuthorProfileLoading />
          ) : (
            <ProfileAvatarButton
              data-testid="entry-profile-detail"
              profileId={entryData.authorId}
              label={
                authorProfile.status === 'error' ? entryData.authorId : authorProfile.data?.name
              }
              avatar={transformSource(avatar?.default)}
              alternativeAvatars={avatar?.alternatives?.map(alternative =>
                transformSource(alternative),
              )}
              href={`${profileAnchorLink}/${entryData.authorId}`}
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
                if (onAvatarClick) onAvatarClick(entryData.authorId);
              }}
              ref={profileRef}
            />
          )}
        </>
        <Menu
          anchor={{
            icon: <EllipsisHorizontalIcon />,
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
          {...(isViewer
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
            fullWidth={true}
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
            <Stack
              justifySelf="start"
              alignSelf="start"
              align="start"
              customStyle={nsfwBlurStyle}
              fullWidth={true}
            >
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
