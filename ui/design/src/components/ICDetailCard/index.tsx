import * as React from 'react';
import { Box, Text } from 'grommet';
import styled, { css } from 'styled-components';
import { IntegrationCenterApp } from '@akashaproject/ui-awf-typings';

import ICDetailCardCoverImage from './ic-detail-card-fields/cover-image';
import ICDetailCardAvatar from './ic-detail-card-fields/avatar';
import ICDetailCardName from './ic-detail-card-fields/name';
import SectionWrapper from './ic-detail-card-fields/section-wrapper';

import Icon from '../Icon';
import DuplexButton from '../DuplexButton';
import { MainAreaCardBox } from '../EntryCard/basic-card-box';

import { formatRelativeTime } from '../../utils/time';

export interface ICDetailCardProps {
  className?: string;

  // labels
  titleLabel: string;
  shareLabel: string;
  installLabel: string;
  uninstallLabel: string;
  installedLabel: string;
  descriptionLabel: string;
  descriptionContent: string;
  showMoreLabel: string;
  linksLabel: string;
  nextReleaseLabel: string;
  ghRepoLabel: string;
  curVersionLabel: string;
  versionLabel: string;
  currentLabel: string;
  bugFixingLabel: string;
  versionHistoryLabel: string;
  authorsLabel: string;
  licenseLabel: string;

  id?: string;
  avatar?: string;
  coverImage?: string;
  ethAddress?: string;
  isInstalled: boolean;
  releases: IntegrationCenterApp['releases'];
  authors: IntegrationCenterApp['authors'];
  tags: IntegrationCenterApp['tags'];
  license: string;

  onClickShare: () => void;
  onClickCTA: () => void;
  onClickInstall: () => void;
  onClickUninstall: () => void;
}

const StyledText = styled(Text)<{ marginBottom?: boolean; bold?: boolean }>`
  ${props =>
    props.marginBottom &&
    css`
      margin-bottom: 1rem;
    `}
  ${props =>
    props.bold &&
    css`
      font-weight: bold;
    `}
`;

const ICDetailCard: React.FC<ICDetailCardProps> = props => {
  const {
    className,
    titleLabel,
    shareLabel,
    installLabel,
    uninstallLabel,
    installedLabel,
    descriptionLabel,
    descriptionContent,
    showMoreLabel,
    linksLabel,
    nextReleaseLabel,
    ghRepoLabel,
    curVersionLabel,
    versionLabel,
    currentLabel,
    bugFixingLabel,
    versionHistoryLabel,
    authorsLabel,
    licenseLabel,
    id,
    avatar,
    coverImage,
    ethAddress,
    isInstalled,
    releases,
    authors,
    tags,
    license,
    onClickShare,
    onClickCTA,
    onClickInstall,
    onClickUninstall,
  } = props;

  const currentRelease = releases.find(r => r.type === 'current');
  const latestBugFixRelease = releases.filter(r => r.type !== 'current')[0];

  const handleShowMore = () => {
    /* @TODO */
  };

  const handleShowVersionHistory = () => {
    /* @TODO */
  };

  const handleAuthorClick = () => {
    /* @TODO: navigate to author's profile page */
  };

  const handleTagClick = (tag: string) => () => {
    /* @TODO: navigate to tag's page */
  };

  return (
    <MainAreaCardBox className={className}>
      <ICDetailCardCoverImage
        shareLabel={shareLabel}
        coverImage={coverImage}
        handleShareClick={onClickShare}
      />
      <Box direction="column" pad={{ bottom: 'medium' }} margin={{ horizontal: 'medium' }}>
        <Box
          height="70px"
          direction="row"
          justify="between"
          align="center"
          border={{ color: 'border', size: 'xsmall', style: 'solid', side: 'bottom' }}
        >
          <Box direction="row">
            <ICDetailCardAvatar ethAddress={ethAddress} avatar={avatar} />
            <Box pad={{ vertical: 'xxsmall', left: 'xsmall', right: 'small' }}>
              <ICDetailCardName name={titleLabel} />
              <Box direction="row" gap="xsmall">
                <Text size="md" color="secondaryText">
                  {id ? `@${id.replace('@', '')}` : null}
                </Text>
              </Box>
            </Box>
          </Box>
          <Box direction="row" data-testid="ic-detail-card-install-button">
            <Box
              pad="0.2rem 0.3rem"
              round="0.2rem"
              margin={{ right: '0.5rem' }}
              border={{ color: 'accent', size: 'xsmall', style: 'solid', side: 'all' }}
              onClick={onClickCTA}
            >
              <Icon size="md" type="settings" />
            </Box>
            <DuplexButton
              icon={isInstalled ? <Icon type="checkSimple" size="xs" /> : null}
              active={isInstalled}
              activeLabel={installedLabel}
              inactiveLabel={installLabel}
              activeHoverLabel={uninstallLabel}
              onClickActive={onClickUninstall}
              onClickInactive={onClickInstall}
            />
          </Box>
        </Box>
        <SectionWrapper>
          <StyledText size="md" bold marginBottom>
            {descriptionLabel}
          </StyledText>
          <Text size="md" style={{ lineHeight: '1.375rem' }}>
            {descriptionContent}
          </Text>
          <Text
            size="md"
            color="accent"
            style={{ cursor: 'pointer' }}
            margin={{ vertical: '1rem' }}
            onClick={handleShowMore}
          >
            {showMoreLabel}
          </Text>
        </SectionWrapper>
        <SectionWrapper>
          <StyledText size="md" bold marginBottom>
            {linksLabel}
          </StyledText>
          <StyledText size="md" marginBottom style={{ lineHeight: '1.375rem' }}>
            {nextReleaseLabel}
          </StyledText>
          <StyledText size="md" marginBottom>
            {ghRepoLabel}
          </StyledText>
        </SectionWrapper>
        <SectionWrapper>
          <StyledText size="md" weight="bold" marginBottom>
            {curVersionLabel}
          </StyledText>
          {currentRelease && (
            <StyledText size="md" color="secondaryText" marginBottom>
              {versionLabel} {currentRelease.version} - {currentLabel}
            </StyledText>
          )}
          <StyledText size="md" marginBottom>
            {bugFixingLabel}
          </StyledText>
          {latestBugFixRelease && (
            <StyledText size="md" color="secondaryText" marginBottom>
              {versionLabel} {latestBugFixRelease.version} -{' '}
              {formatRelativeTime(latestBugFixRelease.timestamp)}
            </StyledText>
          )}
          <StyledText
            size="md"
            color="accent"
            style={{ cursor: 'pointer' }}
            marginBottom
            onClick={handleShowVersionHistory}
          >
            {versionHistoryLabel}
          </StyledText>
        </SectionWrapper>
        <SectionWrapper>
          <StyledText size="md" weight="bold" marginBottom>
            {authorsLabel}
          </StyledText>
          {authors && authors.length > 0 && (
            <Box direction="row">
              {authors.map((author, idx) => (
                <React.Fragment key={idx + author}>
                  <StyledText
                    size="md"
                    color="accent"
                    style={{ cursor: 'pointer' }}
                    marginBottom
                    onClick={handleAuthorClick}
                  >
                    {'@' + author}
                  </StyledText>
                  <Text margin={{ horizontal: '0.5rem' }}>
                    {authors.length > 1 && idx !== authors.length - 1 && '-'}
                  </Text>
                </React.Fragment>
              ))}
            </Box>
          )}
        </SectionWrapper>
        {tags && tags.length > 0 && (
          <SectionWrapper margin={{ top: '1rem' }}>
            <Box direction="row" margin={{ bottom: '1.5rem' }} wrap={true}>
              {tags.map((tag, idx) => (
                <Box
                  key={idx + tag}
                  round="0.25rem"
                  pad="0.5rem 0.75rem"
                  style={{ cursor: 'pointer' }}
                  margin={{ top: '0.5rem', right: idx < tags.length - 1 ? '0.5rem' : '' }}
                  border={{ color: 'darkBorder', size: 'xsmall', style: 'solid', side: 'all' }}
                  onClick={handleTagClick(tag)}
                >
                  {tag}
                </Box>
              ))}
            </Box>
          </SectionWrapper>
        )}
        <SectionWrapper noBorder>
          <StyledText size="md" weight="bold" marginBottom>
            {licenseLabel}:
          </StyledText>
          <Box direction="row" align="center" margin={{ bottom: '1rem' }}>
            {/* license icons are created accordingly with 'license' starting their names, all in lowercase */}
            <Icon type={'license' + license} />
            <Text size="md" margin={{ left: '0.5rem' }}>
              {license}
            </Text>
          </Box>
        </SectionWrapper>
      </Box>
    </MainAreaCardBox>
  );
};

ICDetailCard.defaultProps = {
  titleLabel: 'Integration App Name',
  shareLabel: 'Share',
  installLabel: 'Install',
  uninstallLabel: 'Uninstall',
  installedLabel: 'Installed',
  descriptionLabel: 'Description',
  showMoreLabel: 'Show More',
  linksLabel: 'Links',
  nextReleaseLabel: 'Support next release',
  ghRepoLabel: 'Github Repo',
  curVersionLabel: 'Current Version',
  versionLabel: 'Version',
  currentLabel: 'Current',
  bugFixingLabel: 'Bug Fixing',
  versionHistoryLabel: 'Version History',
  authorsLabel: 'Authors & Contributors',
  licenseLabel: 'License',
};

export default ICDetailCard;
