import * as React from 'react';
import { tw } from '@twind/core';
import Avatar from '@akashaorg/design-system-core/lib/components/Avatar';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import { Menu } from '@headlessui/react';
import { truncateMiddle } from '../../utils/string-utils';
import { IProfileData } from '@akashaorg/typings/ui';

export interface ISocialBox {
  socialData: IProfileData[];
  onClickUser?: (ethAddress: string) => void;
  // labels
  repostedThisLabel?: string;
  andLabel?: string;
  othersLabel?: string;
}

const SocialBox: React.FC<ISocialBox> = props => {
  const { socialData, andLabel, othersLabel, repostedThisLabel, onClickUser } = props;

  const avatarUserData = socialData.map(user => {
    return {
      pubKey: user.pubKey,
      ethAddress: user.ethAddress,
      avatar: user.avatar,
      userName: user.userName,
      name: user.name,
    };
  });

  return (
    <div className={tw(`flex flex-row items-center gap-1 px-4 py-2`)}>
      {avatarUserData && (
        <Avatar
          src={avatarUserData[0].avatar}
          ethAddress={avatarUserData[0].ethAddress}
          size="xs"
          onClick={() => {
            if (onClickUser) {
              onClickUser(avatarUserData[0].pubKey);
            }
          }}
        />
      )}
      <a
        className={tw(`flex no-underline`)}
        onClick={() => {
          if (onClickUser) {
            onClickUser(socialData[0].pubKey);
          }
        }}
      >
        {socialData[0].name ||
          socialData[0].userName ||
          truncateMiddle(socialData[0]?.ethAddress, 3, 3)}
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
                          src={user.avatar}
                          ethAddress={user.ethAddress}
                          size="xs"
                          onClick={() => {
                            if (onClickUser) {
                              onClickUser(user.pubKey);
                            }
                          }}
                        />
                        <button
                          onClick={() => {
                            if (onClickUser) {
                              onClickUser(user.pubKey);
                            }
                          }}
                        >
                          <Text>
                            {user.name || user.userName || truncateMiddle(user.ethAddress, 3, 3)}
                          </Text>
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

export { SocialBox };
