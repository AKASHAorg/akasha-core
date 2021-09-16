import React from 'react';
import { Box, Tabs, Text } from 'grommet';
import { isMobileOnly } from 'react-device-detect';

import ListEmpty from './list-empty';
import ListError from './list-error';
import ListLoading from './list-loading';
import TagEntry, { ITagEntry } from './tag-entry';
import ProfileEntry, { IProfileEntry } from './profile-entry';

import Icon from '../Icon';
import { ITag } from '../TrendingWidgetCard';
import { MainAreaCardBox } from '../EntryCard/basic-card-box';
import { StyledTab } from '../AppInfoWidgetCard/styled-widget-cards';
import { ModalWrapper, StyledBox } from '../ListModal/styled-modal';

import { useViewportSize } from '../Providers/viewport-dimension';
import { IProfileData } from '../ProfileCard/profile-widget-card';

type ReqStatus = 'success' | 'error' | 'loading' | 'idle';

export interface IStatModal extends IProfileEntry, ITagEntry {
  className?: string;
  activeIndex: number;
  setActiveIndex: React.Dispatch<React.SetStateAction<number>>;

  stats: (string | number)[];

  titleLabel: string;
  tabLabelsArr: string[];
  errorTitleLabel: string;
  errorSubtitleLabel: string;
  placeholderTitleLabel: string;
  placeholderSubtitleLabel: string;
  buttonLabel: string;

  followers?: IProfileData[];
  following?: IProfileData[];
  interests?: (ITag | string)[];

  followersReqStatus: ReqStatus;
  followingReqStatus: ReqStatus;
  interestsReqStatus: ReqStatus;

  handleButtonClick: () => void;
  closeModal: () => void;
}

const StatModal: React.FC<IStatModal> = props => {
  const {
    className,
    activeIndex,
    setActiveIndex,
    ipfsGateway,
    stats,
    titleLabel,
    tabLabelsArr,
    errorTitleLabel,
    errorSubtitleLabel,
    placeholderTitleLabel,
    placeholderSubtitleLabel,
    buttonLabel,
    followers,
    following,
    interests,
    followersReqStatus,
    followingReqStatus,
    interestsReqStatus,
    followedProfiles,
    subscribedTags,
    followLabel,
    followingLabel,
    unfollowLabel,
    subscribeLabel,
    unsubscribeLabel,
    subscribedLabel,
    tagAnchorLink,
    profileAnchorLink,
    onClickTag,
    onClickProfile,
    handleFollowProfile,
    handleUnfollowProfile,
    handleSubscribeTag,
    handleUnsubscribeTag,
    handleButtonClick,
    closeModal,
  } = props;

  const {
    dimensions: { width },
  } = useViewportSize();

  return (
    <ModalWrapper isTransparent={true} isMobile={isMobileOnly}>
      <StyledBox width={width > 800 ? '35%' : width > 500 ? '50%' : '100%'}>
        <MainAreaCardBox className={className}>
          <Box direction="column" pad={{ top: 'large', horizontal: 'large' }}>
            <Box direction="row" margin={{ top: 'xsmall' }} align="start">
              {isMobileOnly && (
                <Icon
                  type="arrowLeft"
                  color="secondaryText"
                  primaryColor={true}
                  clickable={true}
                  onClick={closeModal}
                />
              )}
              <Text weight={600} margin={{ bottom: '1rem', horizontal: 'auto' }} size="xlarge">
                {titleLabel}
              </Text>
              {!isMobileOnly && (
                <Icon
                  type="close"
                  color="secondaryText"
                  primaryColor={true}
                  clickable={true}
                  onClick={closeModal}
                />
              )}
            </Box>
          </Box>
          <Tabs activeIndex={activeIndex} onActive={idx => setActiveIndex(idx)}>
            {tabLabelsArr.map((label, index) => (
              <StyledTab
                key={index}
                title={`${label}${stats[index] > 0 ? ` (${stats[index]})` : ''}`}
              >
                <Box height="32rem" pad={{ horizontal: 'large' }}>
                  {index === 0 && (
                    <>
                      {followersReqStatus === 'loading' && <ListLoading type="profile" />}
                      {['error', 'idle'].includes(followersReqStatus) && (
                        <ListError
                          errorTitleLabel={errorTitleLabel}
                          errorSubtitleLabel={errorSubtitleLabel}
                          buttonLabel={buttonLabel}
                          handleButtonClick={handleButtonClick}
                        />
                      )}
                      {followersReqStatus === 'success' && followers && followers.length === 0 && (
                        <ListEmpty
                          assetName={'no-followers'}
                          placeholderTitleLabel={placeholderTitleLabel}
                          placeholderSubtitleLabel={placeholderSubtitleLabel}
                        />
                      )}
                      {followersReqStatus === 'success' && followers && followers.length !== 0 && (
                        <ProfileEntry
                          ipfsGateway={ipfsGateway}
                          entries={followers}
                          followedProfiles={followedProfiles}
                          followLabel={followLabel}
                          followingLabel={followingLabel}
                          unfollowLabel={unfollowLabel}
                          profileAnchorLink={profileAnchorLink}
                          onClickProfile={onClickProfile}
                          handleFollowProfile={handleFollowProfile}
                          handleUnfollowProfile={handleUnfollowProfile}
                        />
                      )}
                    </>
                  )}
                  {index === 1 && (
                    <>
                      {followingReqStatus === 'loading' && <ListLoading type="profile" />}
                      {['error', 'idle'].includes(followingReqStatus) && (
                        <ListError
                          errorTitleLabel={errorTitleLabel}
                          errorSubtitleLabel={errorSubtitleLabel}
                          buttonLabel={buttonLabel}
                          handleButtonClick={handleButtonClick}
                        />
                      )}
                      {followingReqStatus === 'success' && following && following.length === 0 && (
                        <ListEmpty
                          assetName={'no-following'}
                          placeholderTitleLabel={placeholderTitleLabel}
                          placeholderSubtitleLabel={placeholderSubtitleLabel}
                        />
                      )}
                      {followingReqStatus === 'success' && following && following.length !== 0 && (
                        <ProfileEntry
                          ipfsGateway={ipfsGateway}
                          entries={following}
                          followedProfiles={followedProfiles}
                          followLabel={followLabel}
                          followingLabel={followingLabel}
                          unfollowLabel={unfollowLabel}
                          profileAnchorLink={profileAnchorLink}
                          onClickProfile={onClickProfile}
                          handleFollowProfile={handleFollowProfile}
                          handleUnfollowProfile={handleUnfollowProfile}
                        />
                      )}
                    </>
                  )}
                  {index === 2 && (
                    <>
                      {interestsReqStatus === 'loading' && <ListLoading type="topic" />}
                      {['error', 'idle'].includes(interestsReqStatus) && (
                        <ListError
                          errorTitleLabel={errorTitleLabel}
                          errorSubtitleLabel={errorSubtitleLabel}
                          buttonLabel={buttonLabel}
                          handleButtonClick={handleButtonClick}
                        />
                      )}
                      {interestsReqStatus === 'success' && interests && interests.length === 0 && (
                        <ListEmpty
                          assetName={'no-interests'}
                          placeholderTitleLabel={placeholderTitleLabel}
                          placeholderSubtitleLabel={placeholderSubtitleLabel}
                        />
                      )}
                      {interestsReqStatus === 'success' && interests && interests.length !== 0 && (
                        <TagEntry
                          tags={interests}
                          subscribedTags={subscribedTags}
                          subscribeLabel={subscribeLabel}
                          unsubscribeLabel={unsubscribeLabel}
                          subscribedLabel={subscribedLabel}
                          tagAnchorLink={tagAnchorLink}
                          onClickTag={onClickTag}
                          handleSubscribeTag={handleSubscribeTag}
                          handleUnsubscribeTag={handleUnsubscribeTag}
                        />
                      )}
                    </>
                  )}
                </Box>
              </StyledTab>
            ))}
          </Tabs>
        </MainAreaCardBox>
      </StyledBox>
    </ModalWrapper>
  );
};

export default StatModal;
