import React, { ReactNode, Ref, useState, useMemo } from 'react';
import { Card } from '@akashaorg/ui/lib/akasha-components/card';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import EntryCardRemoved from './entry-card-removed';
import CardActions from './card-actions';
import { EllipsisIcon } from 'lucide-react';
import NSFW, { NSFWProps } from '../nsfw-card';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@akashaorg/ui/lib/components/dropdown-menu';
import { type EntryData } from '@akashaorg/typings/lib/ui';
import Pill from '@akashaorg/design-system-core/lib/components/Pill';
import { ListItem } from '@akashaorg/ui/lib/library/list-item';

export type EntryCardProps = {
  entryData: EntryData;
  profileAvatar: ReactNode;
  moderatedContentLabel?: string;
  ctaLabel?: string;
  removeEntryLabel?: string;
  notEditableLabel?: string;
  editLabel?: string;
  removed?: {
    author: React.ReactNode;
    others: React.ReactNode;
  };
  moderated?: {
    author: React.ReactNode;
    others: React.ReactNode;
  };
  nsfw?: Omit<NSFWProps, 'onClickToView'>;
  reflectAnchorLink?: string;
  disableReporting?: boolean;
  isViewer?: boolean;
  isLoggedIn: boolean;
  disableActions?: boolean;
  noWrapperCard?: boolean;
  hideActionButtons?: boolean;
  showHiddenContent?: boolean;
  showNSFWCard?: boolean;
  nsfwUserSetting?: boolean;
  contentClickable?: boolean;
  lastEntry?: boolean;
  hover?: boolean;
  editable?: boolean;
  actionsRight?: ReactNode;
  reflectionsCount?: number;
  customStyle?: string;
  ref?: Ref<HTMLDivElement>;
  dataTestId?: string;
  menuItems: ListItem[];
  nsfwText: string;
  children: ReactNode;
  onReflect?: () => void;
  onTagClick?: (tag: string) => void;
  onMentionClick?: (profileId: string) => void;
  onContentClick?: () => void;
  onEntryRemove?: (itemId: string) => void;
  onEntryFlag?: () => void;
  onEdit?: () => void;
  showLoginModal?: (title?: string, message?: string) => void;
};

const EntryCard: React.FC<EntryCardProps> = props => {
  const {
    entryData,
    profileAvatar,
    ref,
    removed,
    nsfw,
    reflectAnchorLink,
    isViewer,
    isLoggedIn,
    disableActions = false,
    noWrapperCard = false,
    hideActionButtons,
    showHiddenContent,
    showNSFWCard,
    nsfwUserSetting,
    contentClickable,
    lastEntry,
    hover,
    actionsRight,
    reflectionsCount,
    customStyle = '',
    nsfwText,
    onTagClick,
    onContentClick,
    onReflect,
    showLoginModal,
    dataTestId,
    menuItems,
    children,
  } = props;

  /**
   * showNSFWContent determines whether to display the content underneath the overlay,
   * so if the showNSFWCard prop is true (which means to show the overlay), showNSFWContent should be false.
   * It is later toggled through an onClickToView handler.
   */
  const [showNSFWContent, setShowNSFWContent] = useState(!showNSFWCard);
  const showHiddenStyle = showHiddenContent ? '' : 'max-h-[50rem]';
  const contentClickableStyle =
    contentClickable && !showNSFWCard ? 'cursor-pointer' : 'cursor-default';

  const hoverStyleLastEntry = lastEntry ? 'rounded-b-2xl' : '';
  const hoverStyle = hover ? `hover:bg-grey9/60 hover:bg-grey3 ${hoverStyleLastEntry}` : '';

  const entryCardUi = useMemo(
    () => (
      <div
        data-testid={dataTestId}
        /**
         * attach onClick handler if;
         * 'showNSFWContent' state (initially derived from the inverse of the 'showNSFWCard' prop) and contentClickable are true
         */
        {...(contentClickable && showNSFWContent && { onClick: onContentClick })}
      >
        <Stack spacing="gap-y-2" padding="p-4" customStyle={`grow ${hoverStyle}`}>
          <Stack direction="row" justify="between">
            {profileAvatar}

            <DropdownMenu>
              <DropdownMenuTrigger disabled={disableActions} asChild>
                <EllipsisIcon
                  aria-label="settings"
                  className="h-5 w-5 [&>*]:stroke-secondaryLight dark:[&>*]:stroke-secondaryDark"
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {menuItems.map(item => (
                  <DropdownMenuItem
                    key={item.label}
                    onClick={() => item.onClick(item.label)}
                    className={item?.color}
                  >
                    {item?.icon}
                    {item.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
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
            <Card
              className={`p-0 border-none flex flex-col justify-start items-center w-full overflow-hidden grow bg-transparent ${showHiddenStyle} ${contentClickableStyle}`}
              /**
               * attach onClick handler if
               * 'showNSFWContent' and 'noWrapperCard' are both true
               */
              {...(showNSFWContent && noWrapperCard && { onClick: onContentClick })}
            >
              {/* show the overlay in two cases: the user not logged in, or the beam is nsfw and
              the nsfw setting is off */}
              {((showNSFWCard && !nsfwUserSetting && !showNSFWContent) ||
                (!isLoggedIn && showNSFWCard)) && (
                <NSFW
                  {...nsfw}
                  onClickToView={event => {
                    event.stopPropagation();
                    if (!isLoggedIn) {
                      if (showLoginModal && typeof showLoginModal === 'function') {
                        showLoginModal(null, nsfwText);
                      }
                    } else {
                      setShowNSFWContent(true);
                    }
                  }}
                />
              )}
              {/*
               * display the content in case: the content is not nsfw or, the showNSFWContent flag
               * is true or, the nsfw setting is on and the user is logged in.
               */}
              {(!entryData.nsfw || showNSFWContent || (nsfwUserSetting && isLoggedIn)) && (
                <Stack
                  justifySelf="start"
                  alignSelf="start"
                  align="start"
                  spacing="gap-y-2"
                  customStyle="grow"
                  fullWidth={true}
                >
                  {children}
                </Stack>
              )}
              {showHiddenContent && entryData.tags?.length > 0 && (
                <Stack
                  justify="start"
                  direction="row"
                  spacing="gap-2"
                  customStyle="flex-wrap mt-auto"
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
                      type="action"
                    />
                  ))}
                </Stack>
              )}
            </Card>
          )}
          {!hideActionButtons && (
            <CardActions
              itemId={entryData.id}
              reflectAnchorLink={reflectAnchorLink}
              disableActions={disableActions || !entryData.active}
              actionsRight={actionsRight}
              reflectionsCount={reflectionsCount}
              onReflect={onReflect}
              customStyle="mt-auto"
            />
          )}
        </Stack>
      </div>
    ),
    [
      actionsRight,
      contentClickable,
      contentClickableStyle,
      dataTestId,
      disableActions,
      entryData.active,
      entryData.id,
      entryData.nsfw,
      entryData.tags,
      hideActionButtons,
      hoverStyle,
      isLoggedIn,
      isViewer,
      menuItems,
      noWrapperCard,
      nsfw,
      nsfwText,
      nsfwUserSetting,
      onContentClick,
      onReflect,
      onTagClick,
      profileAvatar,
      reflectAnchorLink,
      reflectionsCount,
      removed.author,
      removed.others,
      showHiddenContent,
      showHiddenStyle,
      showLoginModal,
      showNSFWCard,
      showNSFWContent,
      children,
    ],
  );

  return noWrapperCard ? (
    <> {entryCardUi}</>
  ) : (
    <Card ref={ref} className={`p-0 grow min-h-[inherit] ${customStyle}`}>
      {entryCardUi}
    </Card>
  );
};

export default EntryCard;
