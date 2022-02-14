import * as React from 'react';
import { Box, Text } from 'grommet';
import styled, { css } from 'styled-components';
import { IntegrationCenterApp } from '@akashaproject/ui-awf-typings';

import ICDetailCardCoverImage from './ic-detail-card-fields/cover-image';
import ICDetailCardAvatar from './ic-detail-card-fields/avatar';

import Icon from '../Icon';
import DuplexButton from '../DuplexButton';
import { MainAreaCardBox, StyledAnchor } from '../EntryCard/basic-card-box';

import SubtitleTextIcon from '../SubtitleTextIcon';

export interface ICDetailCardProps {
  className?: string;
  // labels

  shareLabel: string;
  installLabel: string;
  uninstallLabel: string;
  installedLabel: string;
  descriptionLabel: string;
  descriptionContent: string;
  showMoreLabel: string;
  linksLabel: string;
  releasesLabel: string;
  releaseTypeLabel: string;
  releaseIdLabel: string;
  versionHistoryLabel: string;
  authorsLabel: string;
  licenseLabel: string;

  integrationName?: string;
  id?: string;
  avatar?: string;
  coverImage?: string;
  ethAddress?: string;
  isInstalled: boolean;
  links?: string[];
  releases: any;
  authors?: IntegrationCenterApp['authors'];
  tags?: IntegrationCenterApp['tags'];
  license?: string;

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
    shareLabel,
    installLabel,
    uninstallLabel,
    installedLabel,
    descriptionLabel,
    descriptionContent,
    showMoreLabel,
    releasesLabel,
    releaseTypeLabel,
    releaseIdLabel,
    versionHistoryLabel,
    authorsLabel,
    licenseLabel,
    integrationName,
    id,
    avatar,
    coverImage,
    ethAddress,
    isInstalled,
    links,
    releases,
    authors,
    tags,
    license,
    onClickShare,
    onClickCTA,
    onClickInstall,
    onClickUninstall,
  } = props;

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
          height="78px"
          direction="row"
          justify="between"
          align="center"
          border={{ color: 'border', size: 'xsmall', style: 'solid', side: 'bottom' }}
        >
          <Box direction="row" align="center" style={{ position: 'relative', top: '-0.5rem' }}>
            <ICDetailCardAvatar ethAddress={ethAddress} avatar={avatar} />
            <Box pad={{ vertical: 'xxsmall', left: 'xsmall', right: 'small' }}>
              <SubtitleTextIcon label={integrationName} subtitle={id} />
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
              <Icon size="md" type="settings" accentColor={true} />
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
        <Box margin={{ top: 'large' }} border={{ side: 'bottom' }}>
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
        </Box>
        {links && (
          <Box margin={{ top: 'large' }} border={{ side: 'bottom' }}>
            {links.map((url, index) => (
              <StyledAnchor key={index} label={url} href={url} />
            ))}
          </Box>
        )}
        <Box margin={{ top: 'large' }} border={{ side: 'bottom' }}>
          <StyledText size="md" weight="bold" marginBottom>
            {releasesLabel}
          </StyledText>
          {releases &&
            releases.map(release => (
              <>
                <StyledText size="md" color="secondaryText" marginBottom>
                  {releaseTypeLabel} {release?.type}
                </StyledText>{' '}
                <StyledText size="md" marginBottom>
                  {releaseIdLabel} {release?.id}
                </StyledText>
              </>
            ))()}

          <StyledText
            size="md"
            color="accent"
            style={{ cursor: 'pointer' }}
            marginBottom
            onClick={handleShowVersionHistory}
          >
            {versionHistoryLabel}
          </StyledText>
        </Box>
        <Box margin={{ top: 'large' }} border={{ side: 'bottom' }}>
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
                    {`@${author.replace('@', '')}`}
                  </StyledText>
                  <Text margin={{ horizontal: '0.5rem' }}>
                    {authors.length > 1 && idx !== authors.length - 1 && '-'}
                  </Text>
                </React.Fragment>
              ))}
            </Box>
          )}
        </Box>
        {tags && tags.length > 0 && (
          <Box margin={{ top: 'medium' }} border={{ side: 'bottom' }}>
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
          </Box>
        )}
        <Box margin={{ top: 'large' }}>
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
        </Box>
      </Box>
    </MainAreaCardBox>
  );
};

ICDetailCard.defaultProps = {
  shareLabel: 'Share',
  installLabel: 'Install',
  uninstallLabel: 'Uninstall',
  installedLabel: 'Installed',
  descriptionLabel: 'Description',
  showMoreLabel: 'Show More',
  linksLabel: 'Links',
  releasesLabel: 'Releases',
  releaseTypeLabel: 'Release Type',
  releaseIdLabel: 'ReleaseId',
  versionHistoryLabel: 'Version History',
  authorsLabel: 'Authors & Contributors',
  licenseLabel: 'License',
};

export default ICDetailCard;
