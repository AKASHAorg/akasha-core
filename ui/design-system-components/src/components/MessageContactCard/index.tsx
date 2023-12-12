import * as React from 'react';
import { tw } from '@twind/core';

import type { Image, Profile } from '@akashaorg/typings/lib/ui';

import Avatar from '@akashaorg/design-system-core/lib/components/Avatar';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import { EllipsisVerticalIcon } from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';
import Text from '@akashaorg/design-system-core/lib/components/Text';

export type MessageContactCardProps = {
  locale: string;
  senderName: Profile['name'];
  content?: string;
  isRead?: boolean;
  isPinned: boolean;
  hideBottomBorder?: boolean;
  pinConvoLabel: string;
  unpinConvoLabel: string;
  newMessageLabel?: string;
  senderAvatar: Profile['avatar'];
  senderDid: Profile['did']['id'];
  onClickAvatar?: () => void;
  onClickCard?: () => void;
  onConvoPin?: () => void;
  transformSource: (src: Image) => Image;
};

const MessageContactCard: React.FC<MessageContactCardProps> = props => {
  const {
    senderName,
    content,
    isRead,
    // isPinned,
    hideBottomBorder,
    // pinConvoLabel,
    // unpinConvoLabel,
    newMessageLabel,
    senderAvatar,
    senderDid,
    onClickAvatar,
    // onClickCard,
    // onConvoPin,
    transformSource,
  } = props;

  const [menuDropOpen, setMenuDropOpen] = React.useState(false);

  const menuIconRef: React.Ref<HTMLButtonElement> = React.useRef(null);

  // const showCardMenu = React.useMemo(() => menuIconRef.current && menuDropOpen, [menuDropOpen]);

  // const closeMenuDrop = () => {
  //   setMenuDropOpen(false);
  // };

  const toggleMenuDrop = (ev: React.SyntheticEvent) => {
    ev.stopPropagation();
    setMenuDropOpen(!menuDropOpen);
  };

  // const handlePinConvo = () => {
  //   if (onConvoPin) {
  //     onConvoPin();
  //   }
  // };

  const handleAvatarClick = (ev: React.SyntheticEvent) => {
    ev.stopPropagation();
    if (onClickAvatar) {
      onClickAvatar();
    }
  };

  const borderClass = hideBottomBorder
    ? 'border(t grey8 dark:grey3)'
    : 'border(y grey8 dark:grey3)';

  return (
    <div className={tw(`flex p-2 shrink-0 ${borderClass}`)}>
      <div className={tw(`flex flex-row justify-between`)}>
        <div className={tw(`flex flex-row items-start`)}>
          <button onClick={handleAvatarClick}>
            <Avatar
              size="lg"
              avatar={transformSource(senderAvatar?.default)}
              alternativeAvatars={senderAvatar?.alternatives?.map(alternative =>
                transformSource(alternative),
              )}
              profileId={senderDid}
            />
          </button>

          <div className={tw(`flex items-start ml-2`)}>
            <Text variant="h5" customStyle="capitalize">
              {senderName}
            </Text>
            {/*<Text size="medium" color="secondaryText">*/}
            {/*  {`@${senderUsername}`}*/}
            {/*</Text>*/}
            <Text
              variant={isRead ? 'subtitle1' : 'body1'}
              customStyle={'mt-1 max-w-[11.75rem] whitespace-nowrap overflow-hidden text-ellipsis'}
            >
              {content}
            </Text>
          </div>
        </div>
        <div className={tw(`flex flex-row h-fit shrink-0 items-center gap-1`)}>
          {!isRead && <Button size="sm" label={newMessageLabel} />}
          <button
            onClick={(ev: React.MouseEvent<HTMLButtonElement>) => toggleMenuDrop(ev)}
            ref={menuIconRef}
          >
            <Icon accentColor={menuDropOpen} icon={<EllipsisVerticalIcon />} />
          </button>
        </div>
        {/* {showCardMenu && (
          <CardHeaderMenuDropdown
            target={menuIconRef.current}
            onMenuClose={closeMenuDrop}
            menuItems={[
              {
                icon: isPinned ? ('unpinAlt' as IconType) : ('pinAlt' as IconType),
                handler: handlePinConvo,
                label: isPinned ? unpinConvoLabel : pinConvoLabel,
                iconColor: 'primaryText',
                plain: true,
              },
            ]}
          />
        )} */}
      </div>
    </div>
  );
};

export default MessageContactCard;
