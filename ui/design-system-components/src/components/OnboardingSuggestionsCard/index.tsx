import React from 'react';
import { tw } from '@twind/core';

import { ITag, Profile } from '@akashaorg/typings/ui';

import Card from '@akashaorg/design-system-core/lib/components/Card';
import DuplexButton from '@akashaorg/design-system-core/lib/components/DuplexButton';
import ProfileAvatarButton from '@akashaorg/design-system-core/lib/components/ProfileAvatarButton';
import Text from '@akashaorg/design-system-core/lib/components/Text';

import { TagButton } from './tag-button';

export interface OnboardingSuggestionsCardProps {
  topicsLabel?: string;
  peopleLabel?: string;
  followLabel?: string;
  unfollowLabel?: string;
  followingLabel?: string;
  tags?: ITag[];
  profiles?: Profile[];
  subscribedTags?: string[];
  followedProfiles?: string[];
  onClickTag?: (tagName: string) => void;
  onClickProfile?: (pubKey: string) => void;
  onClickFollow?: (pubKey: string) => void;
  onClickUnfollow?: (pubKey: string) => void;
  isViewer?: boolean;
}
const OnboardingSuggestionsCard: React.FC<OnboardingSuggestionsCardProps> = props => {
  const {
    topicsLabel,
    peopleLabel,
    followLabel,
    unfollowLabel,
    followingLabel,
    tags,
    profiles,
    subscribedTags,
    followedProfiles,
    onClickTag,
    onClickProfile,
    onClickFollow,
    onClickUnfollow,
    isViewer,
  } = props;

  return (
    <Card>
      <div className={tw(`flex p-4 gap-4`)}>
        <div className={tw(`flex gap-4`)}>
          <Text variant="h2">{topicsLabel}</Text>
          <div className={tw(`flex flex-row gap-2 flex-wrap`)}>
            {tags?.map((tag, index) => (
              <div key={index} className={tw(`flex pb-2`)}>
                <TagButton
                  tagName={tag.name}
                  onClickTag={() => onClickTag(tag.name)}
                  isSubscribed={subscribedTags.includes(tag.name)}
                />
              </div>
            ))}
          </div>
        </div>
        <div className={tw(`flex gap-4`)}>
          <Text variant="h2">{peopleLabel}</Text>
          <div className={tw(`flex p-4 gap-4`)}></div>
          {profiles?.map((profile, index) => (
            <div className={tw(`flex flex-row justify-between items-center`)} key={index}>
              <ProfileAvatarButton
                profileId={profile.did.id}
                onClick={() => onClickProfile(profile.did.id)}
                label={profile.name}
                // info={profile.userName && `@${profile.userName}`}
                size="md"
                avatarImage={profile.avatar}
              />
              {!isViewer && (
                <div>
                  <DuplexButton
                    inactiveLabel={followLabel}
                    activeLabel={followingLabel}
                    activeHoverLabel={unfollowLabel}
                    onClickInactive={() => onClickFollow(profile.did.id)}
                    onClickActive={() => onClickUnfollow(profile.did.id)}
                    active={followedProfiles?.includes(profile.did.id)}
                    icon="UserCircleIcon"
                    allowMinimization
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default OnboardingSuggestionsCard;
