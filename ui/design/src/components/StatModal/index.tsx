import React from 'react';
import { Box, Tabs, Text } from 'grommet';
import { isMobileOnly } from 'react-device-detect';
import { ITag, IProfileData, QueryStatus } from '@akashaorg/typings/ui';

import ListEmpty from './list-empty';
import ListError from './list-error';
import ListLoading from './list-loading';
import TagEntry, { ITagEntry } from './tag-entry';
import ProfileEntry, { IProfileEntry } from './profile-entry';

import Icon from '../Icon';
import { MainAreaCardBox } from '../EntryCard/basic-card-box';
import { StyledTab } from '../AppInfoWidgetCard/styled-widget-cards';
import { ModalWrapper, StyledBox } from '../ListModal/styled-modal';
import useBodyScrollLock from '../../utils/use-body-scroll-lock';
import { UserFollowers_Response } from '@akashaorg/typings/sdk';

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
  interests?: ITag[];

  followersReqStatus: QueryStatus;
  followingReqStatus: QueryStatus;
  interestsReqStatus: QueryStatus;

  followersPages: UserFollowers_Response[];
  followingPages: UserFollowers_Response[];

  loadMoreFollowers: () => void;
  loadMoreFollowing: () => void;

  handleButtonClick: () => void;
  closeModal: () => void;
}

const StatModal: React.FC<IStatModal> = props => {
  const {
    className,
    activeIndex,
    setActiveIndex,
    getMediaUrl,
    loggedUser,
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
    followersPages,
    followingPages,
    loadingMoreLabel,
    onClickTag,
    onClickProfile,
    handleFollowProfile,
    handleUnfollowProfile,
    handleSubscribeTag,
    handleUnsubscribeTag,
    loadMoreFollowers,
    loadMoreFollowing,
    handleButtonClick,
    closeModal,
  } = props;

  useBodyScrollLock();

  return (
    <ModalWrapper isTransparent={true} isMobile={isMobileOnly} justify="center" align="center">
      <StyledBox>
        <MainAreaCardBox className={className} verticalFill={true}>
          <Box direction="column" pad={{ top: 'large', horizontal: 'large' }}>
            <Box direction="row" margin={{ top: 'xsmall' }} align="start">
              {isMobileOnly && (
                <Icon
                  type="arrowLeft"
                  color="secondaryText"
                  clickable={true}
                  onClick={closeModal}
                />
              )}
              <Text
                weight={600}
                margin={{ bottom: '1rem', horizontal: 'auto' }}
                size="xlarge"
                truncate={true}
              >
                {titleLabel}
              </Text>
              {!isMobileOnly && (
                <Icon type="close" color="secondaryText" clickable={true} onClick={closeModal} />
              )}
            </Box>
          </Box>
          <Tabs
            style={{ height: '100%' }}
            activeIndex={activeIndex}
            onActive={idx => setActiveIndex(idx)}
          >
            {tabLabelsArr.map((label, index) => (
              <StyledTab
                key={index}
                title={`${label}${stats[index] > 0 ? ` (${stats[index]})` : ''}`}
              >
                <Box
                  height={isMobileOnly ? '100%' : '30rem'}
                  pad={{ horizontal: 'large' }}
                  overflow={{ vertical: 'auto' }}
                >
                  {index === 0 && (
                    <>
                      {followersReqStatus.isLoading && <ListLoading type="profile" />}
                      {followersReqStatus.isError && (
                        <ListError
                          errorTitleLabel={errorTitleLabel}
                          errorSubtitleLabel={errorSubtitleLabel}
                          buttonLabel={buttonLabel}
                          handleButtonClick={handleButtonClick}
                        />
                      )}
                      {followersReqStatus.isSuccess && followers && !followers.length && (
                        <ListEmpty
                          assetName={'no-followers'}
                          placeholderTitleLabel={placeholderTitleLabel}
                          placeholderSubtitleLabel={placeholderSubtitleLabel}
                        />
                      )}
                      {followersReqStatus.isSuccess && followers && !!followers.length && (
                        <ProfileEntry
                          getMediaUrl={getMediaUrl}
                          loggedUser={loggedUser}
                          followedProfiles={followedProfiles}
                          followLabel={followLabel}
                          followingLabel={followingLabel}
                          unfollowLabel={unfollowLabel}
                          profileAnchorLink={profileAnchorLink}
                          pages={followersPages}
                          status={followersReqStatus.status}
                          hasNextPage={followersReqStatus.hasNextPage}
                          loadingMoreLabel={loadingMoreLabel}
                          onLoadMore={loadMoreFollowers}
                          onClickProfile={onClickProfile}
                          handleFollowProfile={handleFollowProfile}
                          handleUnfollowProfile={handleUnfollowProfile}
                        />
                      )}
                    </>
                  )}
                  {index === 1 && (
                    <>
                      {followingReqStatus.isLoading && <ListLoading type="profile" />}
                      {followingReqStatus.isError && (
                        <ListError
                          errorTitleLabel={errorTitleLabel}
                          errorSubtitleLabel={errorSubtitleLabel}
                          buttonLabel={buttonLabel}
                          handleButtonClick={handleButtonClick}
                        />
                      )}
                      {followingReqStatus.isSuccess && following && !following.length && (
                        <ListEmpty
                          assetName={'no-following'}
                          placeholderTitleLabel={placeholderTitleLabel}
                          placeholderSubtitleLabel={placeholderSubtitleLabel}
                        />
                      )}
                      {followingReqStatus.isSuccess && following && !!following.length && (
                        <ProfileEntry
                          getMediaUrl={getMediaUrl}
                          loggedUser={loggedUser}
                          followedProfiles={followedProfiles}
                          followLabel={followLabel}
                          followingLabel={followingLabel}
                          unfollowLabel={unfollowLabel}
                          profileAnchorLink={profileAnchorLink}
                          pages={followingPages}
                          status={followingReqStatus.status}
                          hasNextPage={followingReqStatus.hasNextPage}
                          loadingMoreLabel={loadingMoreLabel}
                          onLoadMore={loadMoreFollowing}
                          onClickProfile={onClickProfile}
                          handleFollowProfile={handleFollowProfile}
                          handleUnfollowProfile={handleUnfollowProfile}
                        />
                      )}
                    </>
                  )}
                  {index === 2 && (
                    <>
                      {interestsReqStatus.isLoading && <ListLoading type="topic" />}
                      {interestsReqStatus.isError && (
                        <ListError
                          errorTitleLabel={errorTitleLabel}
                          errorSubtitleLabel={errorSubtitleLabel}
                          buttonLabel={buttonLabel}
                          handleButtonClick={handleButtonClick}
                        />
                      )}
                      {interestsReqStatus.isSuccess && interests && !interests.length && (
                        <ListEmpty
                          assetName={'no-interests'}
                          placeholderTitleLabel={placeholderTitleLabel}
                          placeholderSubtitleLabel={placeholderSubtitleLabel}
                        />
                      )}
                      {interestsReqStatus.isSuccess && interests && !!interests.length && (
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
