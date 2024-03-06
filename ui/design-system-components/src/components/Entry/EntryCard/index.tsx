import React, { ReactElement, ReactNode, Ref, CSSProperties, Fragment, useState } from 'react';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import ProfileAvatarButton from '@akashaorg/design-system-core/lib/components/ProfileAvatarButton';
import Tooltip from '@akashaorg/design-system-core/lib/components/Tooltip';
import EntryCardRemoved, { AuthorsRemovedMessage, OthersRemovedMessage } from '../EntryCardRemoved';
import CardActions from './card-actions';
import Text from '@akashaorg/design-system-core/lib/components/Text';
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
import Pill from '@akashaorg/design-system-core/lib/components/Pill';
import ErrorBoundary, {
  ErrorBoundaryProps,
} from '@akashaorg/design-system-core/lib/components/ErrorBoundary';

type BeamProps = {
  sortedContents: AkashaBeam['content'];
  itemType: EntityTypes.BEAM;
  children: (props: { blockID: string }) => ReactElement;
};

type ReflectProps = {
  slateContent: Descendant[];
  itemType: EntityTypes.REFLECT;
  navigateTo?: (args: NavigateToParams) => void;
};

export type EntryCardProps = {
  entryData: EntryData;
  authorProfile: {
    data: Pick<AkashaProfile, 'name' | 'avatar' | 'did'>;
    loading: boolean;
    error: Error;
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
  reflectAnchorLink?: string;
  disableReporting?: boolean;
  isViewer?: boolean;
  isLoggedIn: boolean;
  hidePublishTime?: boolean;
  disableActions?: boolean;
  noWrapperCard?: boolean;
  hideActionButtons?: boolean;
  showHiddenContent?: boolean;
  showNSFWCard?: boolean;
  contentClickable?: boolean;
  lastEntry?: boolean;
  hover?: boolean;
  editable?: boolean;
  actionsRight?: ReactNode;
  reflectionsCount?: number;
  customStyle?: CSSProperties;
  ref?: Ref<HTMLDivElement>;
  onReflect?: () => void;
  onAvatarClick?: (profileId: string) => void;
  onTagClick?: (tag: string) => void;
  onMentionClick?: (profileId: string) => void;
  onContentClick?: () => void;
  onEntryRemove?: (itemId: string) => void;
  onEntryFlag?: () => void;
  onEdit?: () => void;
  showLoginModal?: (title?: string, message?: string) => void;
  transformSource: (src: Image) => Image;
} & (BeamProps | ReflectProps);

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
    reflectAnchorLink,
    disableReporting,
    isViewer,
    isLoggedIn,
    hidePublishTime,
    disableActions,
    noWrapperCard = false,
    hideActionButtons,
    showHiddenContent,
    showNSFWCard,
    contentClickable,
    editable = true,
    lastEntry,
    hover,
    actionsRight,
    reflectionsCount,
    onAvatarClick,
    onTagClick,
    onContentClick,
    onEntryFlag,
    onReflect,
    onEdit,
    transformSource,
    showLoginModal,
    ...rest
  } = props;

  const profileRef: React.Ref<HTMLDivElement> = React.useRef(null);

  /* showNSFWContent determines whether to display the content underneath the
   * overlay, so if the showNSFWCard prop is true (which means to show the
   * overlay), showNSFWContent should be false. It is later toggled through an
   * onClickToView handler.
   */
  const [showNSFWContent, setShowNSFWContent] = useState(!showNSFWCard);
  const showHiddenStyle = showHiddenContent ? '' : 'max-h-[50rem]';
  const contentClickableStyle =
    contentClickable && !showNSFWCard ? 'cursor-pointer' : 'cursor-default';
  const menuItems: ListItem[] = [
    ...(!isViewer
      ? [
          {
            icon: <FlagIcon />,
            label: flagAsLabel,
            color: { light: 'errorLight', dark: 'errorDark' } as const,
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
  const avatar = authorProfile.error ? null : authorProfile.data?.avatar;

  const errorBoundaryProps: Pick<ErrorBoundaryProps, 'errorObj' | 'logger'> = {
    errorObj: {
      type: 'script-error',
      title: 'Error in beam rendering',
    },
  };

  const entryCardUi = (
    <Stack spacing="gap-y-2" padding="p-4" customStyle={hoverStyle}>
      <Stack direction="row" justify="between">
        <>
          {authorProfile.loading ? (
            <AuthorProfileLoading />
          ) : (
            <ProfileAvatarButton
              data-testid="entry-profile-detail"
              profileId={entryData.authorId}
              label={authorProfile.error ? entryData.authorId : authorProfile.data?.name}
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
                    <Tooltip
                      placement={'top'}
                      content={formatDate(entryData?.createdAt, 'H[:]mm [·] D MMM YYYY', locale)}
                    >
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
        <ErrorBoundary {...errorBoundaryProps}>
          <Card
            onClick={!showNSFWContent ? null : onContentClick}
            customStyle={contentClickableStyle}
            type="plain"
          >
            <Stack
              align="center"
              justify="start"
              customStyle={`overflow-hidden ${showHiddenStyle} ${contentClickableStyle}`}
              data-testid="entry-content"
              fullWidth={true}
            >
              {showNSFWCard && !showNSFWContent && (
                <NSFW
                  {...nsfw}
                  onClickToView={event => {
                    event.stopPropagation();
                    if (!isLoggedIn) {
                      if (showLoginModal && typeof showLoginModal === 'function') {
                        showLoginModal(
                          null,
                          'To view explicit or sensitive content, please connect to confirm your consent.',
                        );
                      }
                    } else {
                      setShowNSFWContent(true);
                    }
                  }}
                />
              )}
              {(!entryData.nsfw || showNSFWContent) && (
                <Stack
                  justifySelf="start"
                  alignSelf="start"
                  align="start"
                  spacing="gap-y-1"
                  fullWidth={true}
                >
                  {rest.itemType === EntityTypes.REFLECT ? (
                    <ReadOnlyEditor
                      content={rest.slateContent}
                      disabled={entryData.nsfw}
                      handleMentionClick={rest.onMentionClick}
                      handleLinkClick={url => {
                        rest.navigateTo?.({ getNavigationUrl: () => url });
                      }}
                    />
                  ) : (
                    rest.sortedContents?.map(item => (
                      <Fragment key={item.blockID}>
                        {rest.children({ blockID: item.blockID })}
                      </Fragment>
                    ))
                  )}
                </Stack>
              )}
              {showHiddenContent && entryData.tags?.length > 0 && (
                <Stack
                  padding={{ y: 16 }}
                  justify="start"
                  direction="row"
                  spacing="gap-2"
                  customStyle="flex-wrap"
                  fullWidth
                >
                  {entryData.tags?.map((tag, index) => (
                    <Pill
                      key={index}
                      label={tag}
                      onPillClick={() => {
                        if (typeof onTagClick === 'function') {
                          onTagClick(tag);
                        }
                      }}
                    />
                  ))}
                </Stack>
              )}
            </Stack>
          </Card>
        </ErrorBoundary>
      )}
      {!hideActionButtons && (
        <CardActions
          itemId={entryData.id}
          reflectAnchorLink={reflectAnchorLink}
          disableActions={disableActions || !entryData.active}
          actionsRight={actionsRight}
          reflectionsCount={reflectionsCount}
          onReflect={onReflect}
        />
      )}
    </Stack>
  );

  return noWrapperCard ? (
    <> {entryCardUi}</>
  ) : (
    <Card ref={ref} padding="p-0">
      {entryCardUi}
    </Card>
  );
};

export default EntryCard;
