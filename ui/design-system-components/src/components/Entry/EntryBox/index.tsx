import * as React from 'react';
import { tw } from '@twind/core';
import CardHeaderMenu from './card-header-menu';
import CardActions from './card-actions';

import EntryCardHidden from '../EntryCardHidden';

import EmbedBox from '../../EmbedBox';
import ReadOnlyEditor from '../../ReadOnlyEditor';
import LinkPreview from '../../LinkPreview';

import { formatDate, formatRelativeTime, ILocale } from '../../../utils/time';
import { IEntryData, EntityTypes, NavigateToParams } from '@akashaorg/typings/ui';

import EntryCardRemoved from '../EntryCardRemoved';
import { EntryImageGallery } from '../../ImageGallery/entry-image-gallery';
import { ImageObject } from '../../ImageGallery/image-grid-item';
import MultipleImageOverlay from '../../ImageOverlay/multiple-image-overlay';
import { editorDefaultValue } from '../../Editor/initialValue';
import isEqual from 'lodash.isequal';
import EntryCardError from '../EntryCardError';

import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import ProfileAvatarButton from '@akashaorg/design-system-core/lib/components/ProfileAvatarButton';
import Tooltip from '@akashaorg/design-system-core/lib/components/Tooltip';

export interface IContentClickDetails {
  authorId: string;
  id: string;
  replyTo?: {
    authorId?: string;
    itemId?: string;
  };
}

export interface IEntryBoxProps {
  // data
  entryData: IEntryData;
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
  onClickAvatar?: React.MouseEventHandler<HTMLDivElement>;
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
}

const EntryBox: React.FC<IEntryBoxProps> = props => {
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
  } = props;

  const profileRef: React.Ref<HTMLDivElement> = React.useRef(null);

  const handleRepost = (withComment: boolean) => () => {
    if (onRepost) {
      onRepost(withComment, entryData.entryId);
    }
  };

  const handleEntryFlag = () => {
    if (onEntryFlag) {
      onEntryFlag();
    }
  };

  const handleEntryRemove = () => {
    if (onEntryRemove) {
      onEntryRemove(props.entryData.entryId);
    }
  };

  const handleRepliesClick = () => {
    handleContentClick(entryData);
    if (typeof onRepliesClick === 'function') onRepliesClick();
  };

  const handleContentClick = (data?: IEntryData) => {
    if (typeof onContentClick === 'function' && !disableActions && contentClickable && data) {
      const replyTo = data.postId ? { itemId: data.postId } : null;
      const itemType = replyTo ? EntityTypes.REPLY : EntityTypes.POST;
      onContentClick(
        {
          authorId: data.author.did.id,
          id: data.entryId,
          replyTo,
        },
        itemType,
      );
    }
  };

  const handleLinkClick = (url: string) => {
    navigateTo?.({ getNavigationUrl: () => url });
  };

  const showLinkPreview = React.useMemo(
    () => !props.isRemoved && entryData?.linkPreview,
    [entryData?.linkPreview, props.isRemoved],
  );

  const showQuote = React.useMemo(
    () =>
      !props.isRemoved &&
      entryData.quote &&
      !entryData.quote.isRemoved &&
      !entryData.quote.delisted &&
      !entryData.quote.reported,
    [entryData.quote, props.isRemoved],
  );

  const showRemovedQuote = React.useMemo(
    () => entryData.quote && entryData.quote.isRemoved,
    [entryData.quote],
  );

  const showReportedQuote = React.useMemo(
    () =>
      !props.isRemoved && entryData.quote && !entryData.quote.delisted && entryData.quote.reported,
    [entryData.quote, props.isRemoved],
  );

  const showDelistedQuote = React.useMemo(
    () => !props.isRemoved && entryData.quote && entryData.quote.delisted,
    [entryData.quote, props.isRemoved],
  );

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

  return (
    <>
      <div className={tw(`${error && 'bg-[#FFFDF1]'}`)} style={style}>
        <div className={tw(`flex flex-row justify-between p-4 shrink-0`)}>
          <a
            className={tw(`flex min-w-0 no-underline`)}
            onClick={(e: React.SyntheticEvent) => {
              e.preventDefault();
              return false;
            }}
            href={`${profileAnchorLink}/${entryData.author.id}`}
            data-testid="entry-profile-detail"
          >
            <ProfileAvatarButton
              customStyle={'grow shrink'}
              profileId={entryData.author?.id}
              label={entryData.author?.name}
              info={entryData.author?.id && `@${entryData.author?.id}`}
              avatarImage={entryData.author?.avatar}
              onClick={(ev: React.MouseEvent<HTMLDivElement>) => {
                if (disableActions) {
                  return;
                }
                if (onClickAvatar) {
                  onClickAvatar(ev);
                }
              }}
              ref={profileRef}
            />
          </a>

          <div className={tw(`flex flex-row gap-2 items-center shrink-0`)}>
            {entryData.time && !hidePublishTime && (
              <Tooltip placement={'top'} content={formatDate(entryData.time, locale)}>
                <p className={tw(`flex shrink-0 text(grey4 dark:grey7)`)}>
                  {formatRelativeTime(entryData.time, locale)}
                </p>
              </Tooltip>
            )}
            {!!entryData?.updatedAt && (
              <Tooltip
                placement={'top'}
                content={`${editedLabel} ${formatRelativeTime(entryData.updatedAt, locale)}`}
              >
                <Icon size="sm" type="PencilIcon" />
              </Tooltip>
            )}
            {entryData.type !== 'REMOVED' && (
              <CardHeaderMenu
                disabled={disableActions}
                menuItems={[
                  ...(onEntryFlag && !entryData.author?.did?.isViewer
                    ? [
                        {
                          icon: 'FlagIcon',
                          handler: handleEntryFlag,
                          label: flagAsLabel,
                          disabled: disableReporting,
                        },
                      ]
                    : []),
                  ...(entryData.author?.did?.isViewer
                    ? [
                        {
                          icon: 'TrashIcon',
                          handler: handleEntryRemove,
                          label: removeEntryLabel,
                        },
                      ]
                    : []),
                ]}
                headerMenuExt={props.headerMenuExt}
              />
            )}
          </div>
        </div>

        {props.isRemoved && (
          <EntryCardRemoved
            isAuthor={entryData.author?.did?.isViewer}
            removedByAuthorLabel={removedByAuthorLabel}
            removedByMeLabel={removedByMeLabel}
          />
        )}
        {!props.isRemoved && !isEqual(entryData.slateContent, editorDefaultValue) && (
          <div
            className={tw(
              `px-4 max-h-[50rem] ${scrollHiddenContent ? 'overflow-auto' : 'overflow-hidden'} ${
                contentClickable ? 'cursor-pointer' : 'cursor-default'
              }`,
            )}
            onClick={() => handleContentClick(entryData)}
            data-testid="entry-content"
          >
            <ReadOnlyEditor
              content={entryData.slateContent}
              handleMentionClick={onMentionClick}
              handleTagClick={onTagClick}
              handleLinkClick={handleLinkClick}
            />
          </div>
        )}
        {showLinkPreview && (
          <div className={tw(`flex p-4`)}>
            <LinkPreview
              linkPreviewData={entryData.linkPreview}
              handleLinkClick={handleLinkClick}
            />
          </div>
        )}
        {entryData.images && (
          <div className={tw(`flex p-4`)}>
            <EntryImageGallery images={entryData.images} handleClickImage={handleClickImage} />
          </div>
        )}
        {imageOverlayOpen && (
          <MultipleImageOverlay
            clickedImg={currentImage}
            images={entryData.images}
            closeModal={closeImageOverlay}
          />
        )}
        {showQuote && (
          <div className={tw(`flex p-4`)} onClick={() => handleContentClick(entryData.quote)}>
            <EmbedBox embedEntryData={entryData.quote} />
          </div>
        )}
        {showRemovedQuote && (
          <EntryCardRemoved
            isAuthor={entryData.author?.did?.isViewer}
            removedByAuthorLabel={removedByAuthorLabel}
            removedByMeLabel={removedByMeLabel}
          />
        )}
        {showReportedQuote && (
          <div className={tw(`flex p-4`)} onClick={() => null}>
            <EntryCardHidden
              reason={entryData.reason}
              headerTextLabel={headerTextLabel}
              footerTextLabel={footerTextLabel}
              ctaLabel={ctaLabel}
              handleFlipCard={handleFlipCard}
            />
          </div>
        )}
        {showDelistedQuote && (
          <div className={tw(`flex p-4`)} onClick={() => null}>
            <EntryCardHidden moderatedContentLabel={moderatedContentLabel} isDelisted={true} />
          </div>
        )}
        {!hideActionButtons && (
          <CardActions
            entryData={entryData}
            repliesAnchorLink={repliesAnchorLink}
            onRepost={handleRepost(false)}
            handleRepliesClick={handleRepliesClick}
            disableReposting={disableReposting}
            disableActions={disableActions}
            isModerated={isModerated}
            actionsRightExt={actionsRightExt}
            hideRepost={hideRepost}
          />
        )}
        {error && <EntryCardError error={error} onRetry={onRetry} />}
      </div>
    </>
  );
};

export default EntryBox;
