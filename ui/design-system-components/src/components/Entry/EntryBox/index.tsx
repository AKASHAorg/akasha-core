import * as React from 'react';
import type { IEntryData, NavigateToParams, IContentClickDetails } from '@akashaorg/typings/ui';
import { EntityTypes } from '@akashaorg/typings/ui';

import Anchor from '@akashaorg/design-system-core/lib/components/Anchor';
import Box from '@akashaorg/design-system-core/lib/components/Box';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import ProfileAvatarButton from '@akashaorg/design-system-core/lib/components/ProfileAvatarButton';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import Tooltip from '@akashaorg/design-system-core/lib/components/Tooltip';

import CardHeaderMenu from './card-header-menu';
import CardActions from './card-actions';

import EntryCardError from '../EntryCardError';
import EntryCardHidden from '../EntryCardHidden';
import EntryCardRemoved from '../EntryCardRemoved';

import { editorDefaultValue } from '../../Editor/initialValue';
import EmbedBox from '../../EmbedBox';
import { EntryImageGallery } from '../../ImageGallery/entry-image-gallery';
import { ImageObject } from '../../ImageGallery/image-grid-item';
import MultipleImageOverlay from '../../ImageOverlay/multiple-image-overlay';
import LinkPreview from '../../LinkPreview';
import ReadOnlyEditor from '../../ReadOnlyEditor';

import { formatDate, formatRelativeTime, ILocale } from '../../../utils/time';
import { AkashaBeam, AkashaReflect } from '@akashaorg/typings/sdk/graphql-types-new';

export type EntryBoxProps = {
  // data
  entryData: Omit<AkashaBeam, 'reflectionsCount' | 'reflections'> | AkashaReflect;
  locale: ILocale;
  // labels
  flagAsLabel?: string;
  comment?: boolean;
  editedLabel?: string;
  headerTextLabel?: string;
  footerTextLabel?: string;
  moderatedContentLabel?: string;
  ctaLabel?: string;
  removedByMeLabel?: string;
  removedByAuthorLabel?: string;
  // determines when to render the 'show more' icon
  showMore: boolean;
  // anchor link
  profileAnchorLink?: string;
  repliesAnchorLink?: string;
  // handlers
  onClickAvatar?: () => void;
  onRepost?: (withComment: boolean, itemId: string) => void;
  onEntryFlag?: (itemId?: string, itemType?: string) => void;
  // redirects
  onContentClick?: (details: IContentClickDetails, itemType?: EntityTypes) => void;
  /* Can click the content (not embed!) to navigate */
  contentClickable?: boolean;
  onMentionClick?: (pubKey: string) => void;
  onTagClick?: (name: string) => void;
  navigateTo?: (args: NavigateToParams) => void;
  // style
  style?: React.CSSProperties;
  disableReposting?: boolean;
  disableReporting?: boolean;
  disableActions?: boolean;
  hideActionButtons?: boolean;
  hidePublishTime?: boolean;
  handleFlipCard?: () => void;
  isModerated?: boolean;
  scrollHiddenContent?: boolean;
  removeEntryLabel?: string;
  onEntryRemove?: (itemId: string) => void;
  onRepliesClick?: () => void;
  isRemoved?: boolean;
  headerMenuExt?: React.ReactElement;
  actionsRightExt?: React.ReactNode;
  hideRepost?: boolean;
  error?: string;
  onRetry?: () => void;
  children?: React.ReactNode;
};

const EntryBox: React.FC<EntryBoxProps> = props => {
  const {
    entryData,
    flagAsLabel,
    locale,
    profileAnchorLink,
    repliesAnchorLink,
    onClickAvatar,
    onRepost,
    onEntryFlag,
    onContentClick,
    onMentionClick,
    onTagClick,
    navigateTo,
    style,
    contentClickable,
    disableReposting,
    disableReporting,
    disableActions,
    hideActionButtons,
    hidePublishTime,
    headerTextLabel,
    footerTextLabel,
    moderatedContentLabel,
    ctaLabel,
    handleFlipCard,
    isModerated,
    isRemoved,
    scrollHiddenContent,
    onEntryRemove,
    removeEntryLabel,
    removedByMeLabel = 'You deleted this post',
    removedByAuthorLabel = 'This post was deleted by its author',
    editedLabel = 'Last edited',
    actionsRightExt,
    onRepliesClick,
    hideRepost,
    error,
    onRetry,
    headerMenuExt,
    children,
  } = props;

  const profileRef: React.Ref<HTMLDivElement> = React.useRef(null);

  const handleRepost = (withComment: boolean) => () => {
    if (onRepost) {
      onRepost(withComment, entryData.id);
    }
  };

  const handleEntryFlag = () => {
    if (onEntryFlag) {
      onEntryFlag();
    }
  };

  const handleEntryRemove = () => {
    if (onEntryRemove) {
      onEntryRemove(entryData.id);
    }
  };

  const handleRepliesClick = ev => {
    handleContentClick(entryData);
    if (typeof onRepliesClick === 'function') onRepliesClick();
  };

  const handleContentClick = (data?: {
    embeddedBeam?: AkashaBeam['embeddedBeam'];
    author: AkashaBeam['author'];
    id: AkashaBeam['id'];
  }) => {
    if (typeof onContentClick === 'function' && !disableActions && contentClickable && data) {
      const replyTo = data.embeddedBeam ? { itemId: data.embeddedBeam.embeddedID } : null;
      const itemType = replyTo ? EntityTypes.REFLECT : EntityTypes.BEAM;
      onContentClick(
        {
          authorId: data.author.id,
          id: data.id,
          replyTo,
        },
        itemType,
      );
    }
  };

  const handleLinkClick = (url: string) => {
    navigateTo?.({ getNavigationUrl: () => url });
  };

  // const showLinkPreview = React.useMemo(
  //   () => !isRemoved && entryData?.linkPreview,
  //   [entryData?.linkPreview, isRemoved],
  // );

  // const showQuote = React.useMemo(
  //   () =>
  //     !isRemoved &&
  //     entryData.quote &&
  //     !entryData.quote.isRemoved &&
  //     !entryData.quote.delisted &&
  //     !entryData.quote.reported,
  //   [entryData.quote, isRemoved],
  // );

  // const showRemovedQuote = React.useMemo(
  //   () => entryData.quote && entryData.quote.isRemoved,
  //   [entryData.quote],
  // );

  // const showReportedQuote = React.useMemo(
  //   () => !isRemoved && entryData.quote && !entryData.quote.delisted && entryData.quote.reported,
  //   [entryData.quote, isRemoved],
  // );

  // const showDelistedQuote = React.useMemo(
  //   () => !isRemoved && entryData.quote && entryData.quote.delisted,
  //   [entryData.quote, isRemoved],
  // );

  const [imageOverlayOpen, setImageOverlayOpen] = React.useState(false);
  const [currentImage, setCurrentImage] = React.useState<ImageObject | null>(null);

  /**
   * opens the fullscreen image modal and shows the clicked upon image in it
   */
  const handleClickImage = (image: ImageObject) => {
    setCurrentImage(image);
    setImageOverlayOpen(true);
  };

  const closeImageOverlay = () => {
    setImageOverlayOpen(false);
  };

  const handleClickAvatar = () => {
    if (disableActions) {
      return;
    }
    if (onClickAvatar) {
      onClickAvatar();
    }
  };

  return (
    <>
      <Box customStyle={`${error && 'bg-(errorLight/10 dark:errorDark/40)'}`} style={style}>
        <Box customStyle="flex flex-row justify-between p-4 shrink-0">
          <Anchor
            customStyle="flex min-w-0 no-underline"
            href={`${profileAnchorLink}/${entryData.author.id}`}
            data-testid="entry-profile-detail"
            target="_self"
          >
            <ProfileAvatarButton
              customStyle={'grow shrink'}
              profileId={entryData.author?.id}
              label={entryData.author?.id}
              // avatarImage={entryData.author}
              onClick={handleClickAvatar}
              ref={profileRef}
            />
          </Anchor>

          <Box customStyle="flex flex-row gap-2 items-center shrink-0">
            {entryData.createdAt && !hidePublishTime && (
              <Tooltip placement={'top'} content={formatDate(entryData.createdAt, locale)}>
                <Text customStyle="flex shrink-0 text(grey4 dark:grey7)">
                  {formatRelativeTime(entryData.createdAt, locale)}
                </Text>
              </Tooltip>
            )}
            {!!entryData?.createdAt && (
              <Tooltip
                placement={'top'}
                content={`${editedLabel} ${formatRelativeTime(entryData.createdAt, locale)}`}
              >
                <Icon size="sm" type="PencilIcon" />
              </Tooltip>
            )}
            {!entryData.active && (
              <CardHeaderMenu
                disabled={disableActions}
                menuItems={[
                  ...(onEntryFlag && !entryData.author?.isViewer
                    ? [
                        {
                          icon: 'FlagIcon',
                          handler: handleEntryFlag,
                          label: flagAsLabel,
                          disabled: disableReporting,
                        },
                      ]
                    : []),
                  ...(entryData.author?.isViewer
                    ? [
                        {
                          icon: 'TrashIcon',
                          handler: handleEntryRemove,
                          label: removeEntryLabel,
                        },
                      ]
                    : []),
                ]}
                headerMenuExt={headerMenuExt}
              />
            )}
          </Box>
        </Box>

        {isRemoved && (
          <EntryCardRemoved
            isAuthor={entryData.author?.isViewer}
            removedByAuthorLabel={removedByAuthorLabel}
            removedByMeLabel={removedByMeLabel}
          />
        )}
        {!isRemoved && (
          <Box
            customStyle={`px-4 max-h-[50rem] ${
              scrollHiddenContent ? 'overflow-auto' : 'overflow-hidden'
            } ${contentClickable ? 'cursor-pointer' : 'cursor-default'}`}
            onClick={() => handleContentClick(entryData)}
            data-testid="entry-content"
          >
            {children}
            {/*<ReadOnlyEditor*/}
            {/*  content={entryData.slateContent}*/}
            {/*  handleMentionClick={onMentionClick}*/}
            {/*  handleTagClick={onTagClick}*/}
            {/*  handleLinkClick={handleLinkClick}*/}
            {/*/>*/}
          </Box>
        )}
        {/*{showLinkPreview && (*/}
        {/*  <Box customStyle="flex p-4">*/}
        {/*    <LinkPreview*/}
        {/*      linkPreviewData={entryData.linkPreview}*/}
        {/*      handleLinkClick={handleLinkClick}*/}
        {/*    />*/}
        {/*  </Box>*/}
        {/*)}*/}
        {/*{entryData.images && (*/}
        {/*  <Box customStyle="flex p-4">*/}
        {/*    <EntryImageGallery images={entryData.images} handleClickImage={handleClickImage} />*/}
        {/*  </Box>*/}
        {/*)}*/}
        {/*{imageOverlayOpen && (*/}
        {/*  <MultipleImageOverlay*/}
        {/*    clickedImg={currentImage}*/}
        {/*    images={entryData.images}*/}
        {/*    closeModal={closeImageOverlay}*/}
        {/*  />*/}
        {/*)}*/}
        {/*{showQuote && (*/}
        {/*  <Box customStyle="flex p-4" onClick={() => handleContentClick(entryData.quote)}>*/}
        {/*    <EmbedBox embedEntryData={entryData.quote} />*/}
        {/*  </Box>*/}
        {/*)}*/}
        {/*{showRemovedQuote && (*/}
        {/*  <EntryCardRemoved*/}
        {/*    isAuthor={entryData.author?.did?.isViewer}*/}
        {/*    removedByAuthorLabel={removedByAuthorLabel}*/}
        {/*    removedByMeLabel={removedByMeLabel}*/}
        {/*  />*/}
        {/*)}*/}
        {/*{showReportedQuote && (*/}
        {/*  <Box customStyle="flex p-4" onClick={() => null}>*/}
        {/*    <EntryCardHidden*/}
        {/*      reason={entryData.reason}*/}
        {/*      headerTextLabel={headerTextLabel}*/}
        {/*      footerTextLabel={footerTextLabel}*/}
        {/*      ctaLabel={ctaLabel}*/}
        {/*      handleFlipCard={handleFlipCard}*/}
        {/*    />*/}
        {/*  </Box>*/}
        {/*)}*/}
        {/*{showDelistedQuote && (*/}
        {/*  <Box customStyle="flex p-4" onClick={() => null}>*/}
        {/*    <EntryCardHidden moderatedContentLabel={moderatedContentLabel} isDelisted={true} />*/}
        {/*  </Box>*/}
        {/*)}*/}
        {!hideActionButtons && (
          <CardActions
            entryData={entryData}
            repliesAnchorLink={repliesAnchorLink}
            onRepost={handleRepost(false)}
            handleRepliesClick={ev => {
              ev.stopPropagation();
              handleRepliesClick(ev);
            }}
            disableReposting={disableReposting}
            disableActions={disableActions}
            isModerated={isModerated}
            actionsRightExt={actionsRightExt}
            hideRepost={hideRepost}
          />
        )}
        {error && <EntryCardError error={error} onRetry={onRetry} />}
      </Box>
    </>
  );
};

export default EntryBox;
