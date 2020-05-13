import { Box, Text } from 'grommet';
import * as React from 'react';
import { MainAreaCardBox } from '../common/basic-card-box';
import { IconLink } from '../../Buttons';
import { TextIcon } from '../../TextIcon';
import { SearchInput } from '../../Input';
import { TagBox } from './tag-box';
import { ITag } from '../widget-cards/trending-widget-card';
import { IProfileData, ProfileMiniCard } from '../profile-cards/profile-mini-card';

export interface ICustomizeFeedCardProps {
  // data
  profiles: IProfileData[];
  tags: ITag[];
  // labels
  title1Label?: string;
  subtitle1Label?: string;
  subtitle1LaterLabel?: string;
  title2Label?: string;
  subtitle2Label?: string;
  searchLabel?: string;
  searchPlaceholderLabel?: string;
  cancelLabel?: string;
  nextStepLabel?: string;
  createMyFeedLabel?: string;
  subscribeLabel?: string;
  followLabel?: string;
  mentionsLabel?: string;
  postsLabel?: string;
  // handlers
  handleCreateFeed: () => void;
  handleFollow: (profileEthAddress: string) => void;
  handleSubscribe: (tagNAme: string) => void;
  // external css
  className?: string;
  style?: React.CSSProperties;
}

const CustomizeFeedCard: React.FC<ICustomizeFeedCardProps> = props => {
  const {
    profiles,
    tags,
    title1Label,
    subtitle1Label,
    subtitle1LaterLabel,
    title2Label,
    subtitle2Label,
    searchLabel,
    searchPlaceholderLabel,
    cancelLabel,
    nextStepLabel,
    createMyFeedLabel,
    subscribeLabel,
    followLabel,
    mentionsLabel,
    postsLabel,
    // handlers
    handleCreateFeed,
    handleFollow,
    handleSubscribe,
    className,
    style,
  } = props;

  const [cardState, setCardState] = React.useState<'tags' | 'profiles'>('tags');
  const [search, setSearch] = React.useState(false);
  const [inputValue, setInputValue] = React.useState('');

  const handleLater = () => {
    return;
  };
  const onClickSearch = () => {
    setSearch(true);
  };
  const onClickCancel = () => {
    setSearch(false);
    setInputValue('');
  };

  const onClickNextStep = () => {
    setCardState('profiles');
    setSearch(false);
    setInputValue('');
  };

  const handleInputChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(ev.target.value);
  };

  return (
    <MainAreaCardBox className={className} style={style}>
      {cardState === 'tags' && (
        <>
          <Box align="center" pad={{ vertical: 'large', horizontal: 'large' }}>
            <Text size="bold">{title1Label}</Text>
            <Text>{subtitle1Label}</Text>
            <IconLink size="medium" label={subtitle1LaterLabel} onClick={handleLater} />
          </Box>

          <Box pad="medium" justify="between" direction="row">
            {!search && (
              <>
                <TextIcon label={searchLabel} iconType="search" onClick={onClickSearch} />
                <TextIcon
                  label={nextStepLabel}
                  iconType="arrowRight"
                  primaryColor={true}
                  reverse={true}
                  onClick={onClickNextStep}
                />
              </>
            )}
            {search && (
              <SearchInput
                onChange={handleInputChange}
                inputValue={inputValue}
                handleCancel={onClickCancel}
              />
            )}
          </Box>

          <Box gap="xsmall" direction="column" pad="medium">
            {tags.map((tag, index) => (
              <TagBox
                key={index}
                tag={tag}
                handleSubscribe={handleSubscribe}
                mentionsLabel={mentionsLabel}
                subscribeLabel={subscribeLabel}
              />
            ))}
          </Box>
        </>
      )}
      {cardState === 'profiles' && (
        <>
          <Box align="center" pad={{ vertical: 'large', horizontal: 'large' }}>
            <Text size="bold">{title2Label}</Text>
            <Text>{subtitle2Label}</Text>
          </Box>

          <Box pad="medium" justify="between" direction="row">
            {!search && (
              <>
                <TextIcon label={searchLabel} iconType="search" onClick={onClickSearch} />
                <TextIcon
                  label={createMyFeedLabel}
                  iconType="check"
                  primaryColor={true}
                  reverse={true}
                  onClick={handleCreateFeed}
                />
              </>
            )}
            {search && (
              <SearchInput
                onChange={handleInputChange}
                inputValue={inputValue}
                handleCancel={onClickCancel}
                cancelLabel={cancelLabel}
                placeholderLabel={searchPlaceholderLabel}
              />
            )}
          </Box>

          <Box gap="xsmall" direction="column" pad="medium">
            {profiles.map((profile, index) => (
              <ProfileMiniCard
                key={index}
                profileData={profile}
                onClickFollow={handleFollow}
                followLabel={followLabel}
                postsLabel={postsLabel}
              />
            ))}
          </Box>
        </>
      )}
    </MainAreaCardBox>
  );
};

CustomizeFeedCard.defaultProps = {
  title1Label: "Let's start creating your etherweb feed",
  subtitle1Label:
    'Choose from Hashtags and Profiles to create your customized Etherweb feed. Or you can',
  subtitle1LaterLabel: 'do this later',
  title2Label: "You're almost there!",
  subtitle2Label:
    'Here are some of our most active users talking about the topics you selected. Follow them!',
  searchLabel: 'Search',
  cancelLabel: 'Cancel',
  nextStepLabel: 'Next Step',
  createMyFeedLabel: 'Create My Feed',
};

export default CustomizeFeedCard;
