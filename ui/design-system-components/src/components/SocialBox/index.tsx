import * as React from 'react';
import { tw } from '@twind/core';
import Avatar from '@akashaorg/design-system-core/lib/components/Avatar';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import { Menu } from '@headlessui/react';
import { truncateMiddle } from '../../utils/string-utils';
import { Profile } from '@akashaorg/typings/sdk/graphql-types-new';

export interface ISocialBox {
  socialData: Profile[];
  onClickUser?: (profileId: string) => void;
  // labels
  repostedThisLabel?: string;
  andLabel?: string;
  othersLabel?: string;
}

const SocialBox: React.FC<ISocialBox> = props => {
  const { socialData, andLabel, othersLabel, repostedThisLabel, onClickUser } = props;

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
          avatar={avatarUserData[0].avatar}
          profileId={avatarUserData[0].profileId}
          size="xs"
          onClick={() => {
            if (onClickUser) {
              onClickUser(avatarUserData[0].profileId);
            }
          }}
        />
      )}
      <a
        className={tw(`flex no-underline`)}
        onClick={() => {
          if (onClickUser) {
            onClickUser(socialData[0].id);
          }
        }}
      >
        {socialData[0].name ||
          // socialData[0].userName ||
          truncateMiddle(socialData[0]?.id, 3, 3)}
      </a>

      {socialData.length > 1 ? (
        <div className={tw(`flex flex-row gap-1`)}>
          <Text variant="subtitle1">{andLabel}</Text>

          <Menu>
            <Menu.Button>
              <a className={tw(`flex no-underline`)}>{`${
                socialData?.length - 1
              } ${othersLabel}`}</a>
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
                          avatar={user.avatar}
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
