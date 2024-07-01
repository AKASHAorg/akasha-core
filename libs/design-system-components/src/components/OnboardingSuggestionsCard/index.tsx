import React from 'react';
import { Tag, type Image, Profile } from '@akashaorg/typings/lib/ui';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import DuplexButton from '@akashaorg/design-system-core/lib/components/DuplexButton';
import { UserCircleIcon } from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';
import ProfileAvatarButton from '@akashaorg/design-system-core/lib/components/ProfileAvatarButton';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import { TagButton } from './tag-button';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';

export type OnboardingSuggestionsCardProps = {
  topicsLabel?: string;
  peopleLabel?: string;
  followLabel?: string;
  unfollowLabel?: string;
  followingLabel?: string;
  tags?: Tag[];
  profiles?: Profile[];
  subscribedTags?: string[];
  followedProfiles?: string[];
  transformSource: (src: Image) => Image;
  onClickTag?: (tagName: string) => void;
  onClickProfile?: (id: string) => void;
  onClickFollow?: (id: string) => void;
  onClickUnfollow?: (id: string) => void;
  loggedUserDID?: string;
};

/**
 * Component used in the search app to showcase suggested topics and profiles for the
 * new user to follow
 * @param topicsLabel - text for topics title
 * @param peopleLabel - text for profiles title
 * @param followLabel - text for follow button
 * @param unfollowLabel -  text for unfollow button
 * @param followingLabel - text for follow button
 * @param tags - list of topics that the user can subscribe to
 * @param profiles - list of profiles that the user can follow
 * @param subscribedTags - list of tags user has already subscribed to
 * @param followedProfiles - list of profiles that the user is already following
 * @param transformSource - utility function to provide ipfs images with gateways to be accessed
 * @param onClickTag - handler for clicking on a topic
 * @param onClickProfile - handler for clicking on a profile
 * @param onClickFollow - handler for following a profile
 * @param onClickUnfollow - handler for unfollowing a profile
 * @param loggedUserDID - did of the logged in user, to prevent displaying the follow function
 */
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
    transformSource,
    onClickTag,
    onClickProfile,
    onClickFollow,
    onClickUnfollow,
    loggedUserDID,
  } = props;

  return (
    <Card>
      <Stack spacing="gap-4">
        <Stack spacing="gap-4">
          <Text variant="h5">{topicsLabel}</Text>

          <Stack direction="row" spacing="gap-2" customStyle="flex-wrap">
            {tags?.map((tag, index) => (
              <Stack key={index} padding="pb-2">
                <TagButton
                  tagName={tag.name}
                  onClickTag={() => onClickTag(tag.name)}
                  isSubscribed={subscribedTags.includes(tag.name)}
                />
              </Stack>
            ))}
          </Stack>
        </Stack>
        <Stack spacing="gap-4">
          <Text variant="h5">{peopleLabel}</Text>

          {profiles?.map((profile, index) => (
            <Stack key={index} direction="row" align="center" justify="between">
              <ProfileAvatarButton
                profileId={profile.did.id}
                onClick={() => onClickProfile(profile.did.id)}
                label={profile.name}
                avatar={transformSource(profile?.avatar?.default)}
                alternativeAvatars={profile?.avatar?.alternatives?.map(alternative =>
                  transformSource(alternative),
                )}
              />
              {loggedUserDID !== profile.did.id && (
                <DuplexButton
                  inactiveLabel={followLabel}
                  activeLabel={followingLabel}
                  activeHoverLabel={unfollowLabel}
                  onClickInactive={() => onClickFollow(profile.did.id)}
                  onClickActive={() => onClickUnfollow(profile.did.id)}
                  active={followedProfiles?.includes(profile.did.id)}
                  icon={<UserCircleIcon />}
                  allowMinimization
                />
              )}
            </Stack>
          ))}
        </Stack>
      </Stack>
    </Card>
  );
};

export default OnboardingSuggestionsCard;
