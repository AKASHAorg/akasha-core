import { Box, Text } from 'grommet';
import * as React from 'react';
import { MainAreaCardBox } from '../common/basic-card-box';
import { IconLink } from '../../Buttons';
import { TextIcon } from '../../TextIcon';
import { SearchInput } from '../../Input';
import { TagCard, ITagData } from './tag-card';
import { IProfileData } from '../profile-cards/profile-widget-card';
import { ProfileMiniCard } from '../profile-cards/profile-mini-card';
import { Icon } from '../../Icon';

export interface ICustomizeFeedCardProps {
  // data
  profiles: IProfileData[];
  tags: ITagData[];
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
  handleUnfollow: (profileEthAddress: string) => void;
  handleSubscribe: (tagNAme: string) => void;
  handleUnsubscribe: (tagName: string) => void;
  // external css
  className?: string;
  style?: React.CSSProperties;
}

const CustomizeFeedCard: React.FC<ICustomizeFeedCardProps> = props => {
  const {
    // data
    profiles,
    tags,
    // labels
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
    handleUnfollow,
    handleSubscribe,
    handleUnsubscribe,
    // external css
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

  const handleGoProfiles = () => {
    setCardState('profiles');
    setSearch(false);
    setInputValue('');
  };

  const handleGoTags = () => {
    setCardState('tags');
    setSearch(false);
    setInputValue('');
  };

  const handleInputChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(ev.target.value);
  };

  return (
    <MainAreaCardBox className={className} style={style} verticalFill={true}>
      {cardState === 'tags' && (
        <>
          <Box flex={{ shrink: 0 }}>
            <Box
              align="center"
              pad={{ vertical: 'large', horizontal: 'xlarge' }}
              margin={{ horizontal: 'medium' }}
            >
              <Text size="bold" textAlign="center">
                {title1Label}
              </Text>
              <Text textAlign="center">
                {subtitle1Label}
                <IconLink
                  size="medium"
                  active={true}
                  label={subtitle1LaterLabel}
                  onClick={handleLater}
                />
              </Text>
            </Box>
            <Box pad={{ horizontal: 'medium' }} fill="horizontal">
              {!search && (
                <Box
                  justify="between"
                  direction="row"
                  pad={{ bottom: 'xsmall' }}
                  // to adjust for the border of the form field
                  margin={{ bottom: '1px' }}
                >
                  <TextIcon
                    label={searchLabel}
                    iconType="search"
                    onClick={onClickSearch}
                    fontSize="large"
                  />
                  <TextIcon
                    label={nextStepLabel}
                    iconType="arrowRight"
                    accentColor={true}
                    reverse={true}
                    iconSize="xs"
                    fontSize="large"
                    onClick={handleGoProfiles}
                    clickable={true}
                  />
                </Box>
              )}
              {search && (
                <SearchInput
                  onChange={handleInputChange}
                  inputValue={inputValue}
                  handleCancel={onClickCancel}
                />
              )}
            </Box>
          </Box>

          <Box gap="small" direction="column" pad="medium" overflow="scroll">
            {tags
              .filter(tag => tag.tagName.toLowerCase().includes(inputValue.toLowerCase()))
              .map((tag, index) => (
                <TagCard
                  key={index}
                  tag={tag}
                  handleSubscribe={handleSubscribe}
                  handleUnsubscribe={handleUnsubscribe}
                  mentionsLabel={mentionsLabel}
                  subscribeLabel={subscribeLabel}
                />
              ))}
          </Box>
        </>
      )}
      {cardState === 'profiles' && (
        <>
          <Box flex={{ shrink: 0 }}>
            <Box
              align="center"
              pad={{ vertical: 'large', horizontal: 'xlarge' }}
              margin={{ horizontal: 'medium' }}
              flex={{ shrink: 0 }}
            >
              <Text size="bold" textAlign="center">
                {title2Label}
              </Text>
              <Text textAlign="center">{subtitle2Label}</Text>
            </Box>
            <Box pad="medium" fill="horizontal">
              {!search && (
                <Box
                  justify="between"
                  direction="row"
                  pad={{ bottom: 'xsmall' }}
                  // to adjust for the border of the form field
                  margin={{ bottom: '1px' }}
                  fill="horizontal"
                >
                  <TextIcon label={searchLabel} iconType="search" onClick={onClickSearch} />
                  <Box direction="row" gap="small">
                    <Icon
                      type="arrowLeft"
                      clickable={true}
                      onClick={handleGoTags}
                      accentColor={true}
                      size="xs"
                    />
                    <TextIcon
                      label={createMyFeedLabel}
                      fontSize="large"
                      iconType="check"
                      accentColor={true}
                      reverse={true}
                      onClick={handleCreateFeed}
                      clickable={true}
                    />
                  </Box>
                </Box>
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
          </Box>

          <Box
            direction="row"
            pad="medium"
            wrap={true}
            align="center"
            justify="center"
            overflow="scroll"
          >
            {profiles
              .filter(
                profile =>
                  profile.ensName?.toLowerCase().includes(inputValue.toLowerCase()) ||
                  profile.userName?.toLowerCase().includes(inputValue.toLowerCase()) ||
                  profile.description?.toLowerCase().includes(inputValue.toLowerCase()),
              )
              .map((profile, index) => (
                <Box width="16rem" key={index} pad="small">
                  <ProfileMiniCard
                    profileData={profile}
                    handleFollow={handleFollow}
                    handleUnfollow={handleUnfollow}
                    followLabel={followLabel}
                    postsLabel={postsLabel}
                  />
                </Box>
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
    'Choose from Hashtags and Profiles to create your customized Etherweb feed. Or you can ',
  subtitle1LaterLabel: 'do this later.',
  title2Label: "You're almost there!",
  subtitle2Label:
    'Here are some of our most active users talking about the topics you selected. Follow them!',
  searchLabel: 'Search',
  cancelLabel: 'Cancel',
  nextStepLabel: 'Next Step',
  createMyFeedLabel: 'Create My Feed',
};

export { CustomizeFeedCard };
