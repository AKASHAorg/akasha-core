import * as React from 'react';
import { tw } from '@twind/core';
import { Menu } from '@headlessui/react';

import type { Image, Profile } from '@akashaorg/typings/lib/ui';

import Avatar from '@akashaorg/design-system-core/lib/components/Avatar';
import Text from '@akashaorg/design-system-core/lib/components/Text';

import { truncateMiddle } from '../../utils/string-utils';
import Button from '@akashaorg/design-system-core/lib/components/Button';

export interface ISocialBox {
  socialData: Profile[];
  onClickUser?: (profileId: string) => void;
  transformSource: (src: Image) => Image;
  // labels
  repostedThisLabel?: string;
  andLabel?: string;
  othersLabel?: string;
}

const SocialBox: React.FC<ISocialBox> = props => {
  const { socialData, andLabel, othersLabel, repostedThisLabel, onClickUser, transformSource } =
    props;

  const avatarUserData = socialData.map(user => {
    return {
      profileId: user.id,
      avatar: user.avatar,
      name: user.name,
    };
  });

  return (
    <div className={tw(`flex flex-row items-center gap-1 px-4 py-2`)}>
      {avatarUserData && (
        <Avatar
          avatar={transformSource(avatarUserData[0]?.avatar?.default)}
          alternativeAvatars={avatarUserData[0]?.avatar?.alternatives?.map(alternative =>
            transformSource(alternative),
          )}
          profileId={avatarUserData[0].profileId}
          size="xs"
          onClick={() => {
            if (onClickUser) {
              onClickUser(avatarUserData[0].profileId);
            }
          }}
        />
      )}
      <Button
        plain={true}
        onClick={() => {
          if (onClickUser) {
            onClickUser(socialData[0].id);
          }
        }}
      >
        {socialData[0].name ||
          // socialData[0].userName ||
          truncateMiddle(socialData[0]?.id, 3, 3)}
      </Button>

      {socialData.length > 1 ? (
        <div className={tw(`flex flex-row gap-1`)}>
          <Text variant="subtitle1">{andLabel}</Text>

          <Menu>
            <Menu.Button>
              <Text variant="subtitle1">{`${socialData?.length - 1} ${othersLabel}`}</Text>
            </Menu.Button>
            <Menu.Items>
              <div
                className={tw(
                  `overflow-hidden absolute right-0 mt-2 w-56 origin-top-right rounded`,
                )}
              >
                <div className={tw(`p-1 max-h-[8rem] overflow-auto`)}>
                  {avatarUserData.slice(1).map((user, index) => (
                    <Menu.Item key={index}>
                      <div
                        className={tw(
                          `flex flex-row gap-1 items-center p-1 shrink-0 cursor-pointer rounded hover:bg-secondary/0.5`,
                        )}
                      >
                        <Avatar
                          avatar={transformSource(user?.avatar?.default)}
                          alternativeAvatars={user?.avatar?.alternatives?.map(alternative =>
                            transformSource(alternative),
                          )}
                          profileId={user.profileId}
                          size="xs"
                          onClick={() => {
                            if (onClickUser) {
                              onClickUser(user.profileId);
                            }
                          }}
                        />
                        <button
                          onClick={() => {
                            if (onClickUser) {
                              onClickUser(user.profileId);
                            }
                          }}
                        >
                          <Text>{user.name || truncateMiddle(user.profileId, 3, 3)}</Text>
                        </button>
                      </div>
                    </Menu.Item>
                  ))}
                </div>
              </div>
            </Menu.Items>
          </Menu>

          <Text customStyle={'shrink-0'} variant="subtitle1">
            {repostedThisLabel}
          </Text>
        </div>
      ) : (
        <Text customStyle={'shrink-0'} variant="subtitle1">
          {repostedThisLabel}
        </Text>
      )}
    </div>
  );
};

SocialBox.defaultProps = {
  repostedThisLabel: 'reposted this',
  andLabel: 'and',
  othersLabel: 'others',
};

export default SocialBox;
