import React from 'react';
import { Tab } from '@headlessui/react';
import { ITag, IProfileData } from '@akashaorg/typings/ui';
import DuplexButton from '../DuplexButton';
import SubtitleTextIcon from '../SubtitleTextIcon';
import { tw, apply } from '@twind/core';
import TextLine from '../TextLine';
import ProfileAvatarButton from '../ProfileAvatarButton';
import BasicCardBox from '../BasicCardBox';

export interface ITrendingWidgetCardProps {
  // data
  tags: ITag[];
  profiles: IProfileData[];
  followedProfiles?: string[];
  subscribedTags?: string[];
  loggedEthAddress?: string | null;
  isLoadingTags?: boolean;
  isLoadingProfiles?: boolean;
  // labels
  noTagsLabel?: string;
  noProfilesLabel?: string;
  titleLabel: string;
  topicsLabel: string;
  profilesLabel: string;
  followLabel?: string;
  followingLabel?: string;
  followersLabel?: string;
  unfollowLabel?: string;
  subscribeLabel?: string;
  unsubscribeLabel?: string;
  subscribedLabel?: string;
  // anchor link
  tagAnchorLink: string;
  profileAnchorLink: string;
  // handlers
  onClickTag: (tagName: string) => void;
  onClickProfile: (ethAddress: string) => void;
  handleFollowProfile: (ethAddress: string) => void;
  handleUnfollowProfile: (ethAddress: string) => void;
  handleSubscribeTag: (tagName: string) => void;
  handleUnsubscribeTag: (tagName: string) => void;
  onActiveTabChange?: (tabIdx: number) => void;
  // css
  className?: string;
}
const BaseTabListStyles = apply`
    w-full py-2.5 text-sm font-medium
    ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none
    `;

const BaseTabPanelStyles = apply`
    ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none px-8
    `;

const SelectedTabStyles = apply`
    text-secondary-light border-b-secondary-light border-b-2
    `;

const TrendingWidgetCard: React.FC<ITrendingWidgetCardProps> = props => {
  const {
    onClickTag,
    onClickProfile,
    handleFollowProfile,
    handleUnfollowProfile,
    handleSubscribeTag,
    handleUnsubscribeTag,
    onActiveTabChange,
    loggedEthAddress,
    titleLabel,
    tags,
    profiles,
    isLoadingTags,
    isLoadingProfiles,
    noTagsLabel,
    noProfilesLabel,
    topicsLabel,
    profilesLabel,
    followLabel,
    followingLabel,
    unfollowLabel,
    followersLabel,
    subscribeLabel,
    subscribedLabel,
    unsubscribeLabel,
    tagAnchorLink,
    profileAnchorLink,
    followedProfiles,
    subscribedTags,
  } = props;

  const handleTabChange = (tabIdx: number) => {
    if (onActiveTabChange) {
      onActiveTabChange(tabIdx);
    }
  };

  return (
    // <div className="w-full max-w-md px-2 sm:px-0 bg-white dark:bg-grey2 dark:bg-grey8">
    <BasicCardBox noBorder={true} pad="0">
      <h3>{titleLabel}</h3>
      <Tab.Group onChange={handleTabChange}>
        <Tab.List className="flex space-x-1 rounded-t-md">
          <Tab
            key={topicsLabel}
            className={({ selected }) =>
              tw(BaseTabListStyles) + (selected ? tw(SelectedTabStyles) : 'text-gray-400')
            }
          >
            {topicsLabel}
          </Tab>
          <Tab
            key={profilesLabel}
            className={({ selected }) =>
              tw(BaseTabListStyles) + (selected ? tw(SelectedTabStyles) : 'text-gray-400')
            }
          >
            {profilesLabel}
          </Tab>
        </Tab.List>
        <Tab.Panels>
          <Tab.Panel className={tw(BaseTabPanelStyles)}>
            <ul>
              {tags.length === 0 && !isLoadingTags && (
                <div className={tw('flex justify-center items-center')}>
                  <p>{noTagsLabel}</p>
                </div>
              )}
              {tags.length === 0 &&
                isLoadingTags &&
                Array.from({ length: 4 }, (_el, index: number) => (
                  <div key={index} className={tw('flex flex-row justify-between items-center')}>
                    <div>
                      <TextLine title="tagName" animated={false} width="140px" />
                      <TextLine title="tagName" animated={false} width="80px" />
                    </div>
                    <TextLine title="tagName" animated={false} width="7rem" height="2rem" />
                  </div>
                ))}
              {tags.length !== 0 &&
                tags.slice(0, 4).map((tag, index) => (
                  <div
                    key={index}
                    className={tw('flex flex-row justify-between items-center py-2')}
                  >
                    <a
                      onClick={e => {
                        e.preventDefault();
                        return false;
                      }}
                      href={`${tagAnchorLink}/${tag.name}`}
                    >
                      <SubtitleTextIcon
                        onClick={() => onClickTag(tag.name)}
                        label={`#${tag.name}`}
                        subtitle={`Used in ${tag.totalPosts} posts`}
                        labelSize="large"
                      />
                    </a>
                    <div>
                      <DuplexButton
                        inactiveLabel={subscribeLabel}
                        activeLabel={subscribedLabel}
                        activeHoverLabel={unsubscribeLabel}
                        onClickInactive={() => handleSubscribeTag(tag.name)}
                        onClickActive={() => handleUnsubscribeTag(tag.name)}
                        active={subscribedTags?.includes(tag.name)}
                        icon="RssIcon"
                        allowMinimization={true}
                      />
                    </div>
                  </div>
                ))}
            </ul>
          </Tab.Panel>
          <Tab.Panel className={tw(BaseTabPanelStyles)}>
            {profiles.length === 0 && !isLoadingProfiles && (
              <div className={tw('flex flex-row justify-center items-center py-2')}>
                <p>{noProfilesLabel}</p>
              </div>
            )}
            {profiles.length === 0 &&
              isLoadingProfiles &&
              Array.from({ length: 4 }, (_el, index: number) => (
                <div key={index} className={tw('flex flex-row justify-between items-center py-2')}>
                  <div className={tw('py-2')}>
                    <TextLine title="avatar" width="40px" height="40px" className="rounded-full" />
                    <div className={tw('py-1')}>
                      <TextLine title="tagName" animated={false} width="140px" />
                      <TextLine title="tagName" animated={false} width="80px" />
                    </div>
                  </div>
                  <TextLine title="tagName" animated={false} width="7rem" height="2rem" />
                </div>
              ))}
            {profiles.length !== 0 &&
              profiles.slice(0, 4).map((profile, index) => (
                <div key={index} className={tw('flex flex-row justify-between items-center py-2	')}>
                  <a
                    onClick={e => {
                      e.preventDefault();
                      return false;
                    }}
                    href={`${profileAnchorLink}/${profile.pubKey}`}
                  >
                    <ProfileAvatarButton
                      ethAddress={profile.ethAddress}
                      onClick={() => onClickProfile(profile.pubKey)}
                      label={profile.userName || profile.name}
                      info={`${profile.totalFollowers} ${followersLabel}`}
                      size="md"
                      avatarImage={profile.avatar}
                    />
                  </a>
                  {profile.ethAddress !== loggedEthAddress && (
                    <div>
                      <DuplexButton
                        inactiveLabel={followLabel}
                        activeLabel={followingLabel}
                        activeHoverLabel={unfollowLabel}
                        onClickInactive={() => handleFollowProfile(profile.pubKey)}
                        onClickActive={() => handleUnfollowProfile(profile.pubKey)}
                        active={followedProfiles?.includes(profile.pubKey)}
                        icon="ArrowRightOnRectangleIcon"
                        allowMinimization={true}
                      />
                    </div>
                  )}
                </div>
              ))}
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
      {/* </div> */}
    </BasicCardBox>
  );
};

TrendingWidgetCard.defaultProps = {
  titleLabel: 'Trending Right Now',
  topicsLabel: 'Topics',
  profilesLabel: 'People',
  followLabel: 'Follow',
  unfollowLabel: 'Unfollow',
  followersLabel: 'Followers',
  followingLabel: 'Following',
  subscribedLabel: 'Subscribed',
  subscribeLabel: 'Subscribe',
  unsubscribeLabel: 'Unsubscribe',
  noTagsLabel: 'No tags found!',
  noProfilesLabel: 'No profiles found!',
};

export default TrendingWidgetCard;
