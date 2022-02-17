import * as React from 'react';
import { Box, Text } from 'grommet';
import styled, { css } from 'styled-components';

import ICDetailCardCoverImage from './ic-detail-card-fields/cover-image';
import ICDetailCardAvatar from './ic-detail-card-fields/avatar';

import Icon from '../Icon';
import DuplexButton from '../DuplexButton';
import { MainAreaCardBox } from '../EntryCard/basic-card-box';

import SubtitleTextIcon from '../SubtitleTextIcon';
import { ReleaseInfo } from '@akashaproject/ui-awf-typings';

export interface ICDetailCardProps {
  className?: string;
  // labels
  shareLabel: string;
  installLabel: string;
  uninstallLabel: string;
  installedLabel: string;
  descriptionLabel: string;
  showMoreLabel: string;
  linksLabel: string;
  releasesLabel: string;
  releaseVersionLabel: string;
  latestReleaseLabel: string;
  noPreviousReleasesLabel: string;
  releaseIdLabel: string;
  versionHistoryLabel: string;
  authorLabel: string;
  licenseLabel: string;

  integrationName?: string;
  id?: string;
  isInstalled: boolean;
  releases: ReleaseInfo[];
  latestRelease: ReleaseInfo;

  onClickShare: () => void;
  onClickCTA: () => void;
  onClickInstall: () => void;
  onClickUninstall: () => void;
  handleAuthorClick?: () => void;
  handleTagClick?: (tag: string) => void;
}

const StyledText = styled(Text)<{ marginBottom?: boolean; bold?: boolean }>`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
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
    linksLabel,
    releasesLabel,
    releaseVersionLabel,
    latestReleaseLabel,
    noPreviousReleasesLabel,
    releaseIdLabel,
    versionHistoryLabel,
    authorLabel,
    licenseLabel,
    integrationName,
    id,
    isInstalled,
    releases = [],
    latestRelease,
    onClickShare,
    onClickCTA,
    onClickInstall,
    onClickUninstall,
    handleAuthorClick,
    handleTagClick,
  } = props;

  const [showReleases, setShowReleases] = React.useState(false);
  const handleShowVersionHistory = () => {
    setShowReleases(true);
  };

  return (
    <MainAreaCardBox className={className}>
      <ICDetailCardCoverImage
        shareLabel={shareLabel}
        coverImage={null}
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
            <ICDetailCardAvatar ethAddress={latestRelease?.id} />
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
            {latestRelease?.integrationType === 0 ? (
              <Icon type="checkSimple" accentColor={true} size="md" />
            ) : (
              <DuplexButton
                icon={isInstalled ? <Icon type="checkSimple" size="xs" /> : null}
                active={isInstalled}
                activeLabel={installedLabel}
                inactiveLabel={installLabel}
                activeHoverLabel={uninstallLabel}
                onClickActive={onClickUninstall}
                onClickInactive={onClickInstall}
              />
            )}
          </Box>
        </Box>
        <Box margin={{ top: 'large' }} border={{ side: 'bottom' }}>
          <StyledText size="md" bold marginBottom>
            {descriptionLabel}
          </StyledText>
          <Text size="md" style={{ lineHeight: '1.375rem' }}>
            {latestRelease?.manifestData?.description}
          </Text>
        </Box>
        {(latestRelease?.links?.documentation || latestRelease?.links?.publicRepository) && (
          <Box margin={{ top: 'large' }} border={{ side: 'bottom' }}>
            <StyledText size="md" bold marginBottom>
              {linksLabel}
            </StyledText>
            {latestRelease?.links?.documentation && (
              <Text size="md">{latestRelease?.links?.documentation}</Text>
            )}
            {latestRelease?.links?.publicRepository && (
              <Text size="md">{latestRelease?.links?.publicRepository}</Text>
            )}
          </Box>
        )}
        <Box margin={{ top: 'large' }} border={{ side: 'bottom' }}>
          <StyledText size="md" weight="bold" marginBottom>
            {latestReleaseLabel}
          </StyledText>
          <StyledText size="md" marginBottom>
            {releaseIdLabel}
          </StyledText>
          <StyledText size="sm" color="secondaryText" marginBottom>
            {latestRelease?.id}
          </StyledText>
          <StyledText size="md" marginBottom>
            {releaseVersionLabel}
          </StyledText>
          <StyledText size="sm" color="secondaryText" marginBottom>
            {latestRelease?.version}
          </StyledText>

          {!showReleases && (
            <StyledText
              size="md"
              color="accent"
              style={{ cursor: 'pointer' }}
              marginBottom
              onClick={handleShowVersionHistory}
            >
              {versionHistoryLabel}
            </StyledText>
          )}
        </Box>
        {showReleases && (
          <Box margin={{ top: 'large' }} border={{ side: 'bottom' }}>
            <StyledText size="md" weight="bold" marginBottom>
              {releasesLabel}
            </StyledText>
            {releases?.length === 0 && (
              <StyledText size="md" marginBottom>
                {noPreviousReleasesLabel}
              </StyledText>
            )}
            {releases?.length !== 0 &&
              releases?.map(release => (
                <>
                  <StyledText size="md" marginBottom>
                    {releaseIdLabel} {release?.id}
                  </StyledText>
                </>
              ))}
          </Box>
        )}
        {latestRelease?.author && (
          <Box margin={{ top: 'large' }} border={{ side: 'bottom' }}>
            <StyledText size="md" weight="bold" marginBottom>
              {authorLabel}
            </StyledText>
            {latestRelease?.author && (
              <Box direction="row">
                <StyledText
                  size="md"
                  color="accent"
                  style={{ cursor: 'pointer' }}
                  marginBottom
                  onClick={handleAuthorClick}
                >
                  {latestRelease?.author}
                </StyledText>
              </Box>
            )}
          </Box>
        )}
        {latestRelease?.manifestData?.keywords &&
          latestRelease?.manifestData?.keywords?.length > 0 && (
            <Box margin={{ top: 'medium' }} border={{ side: 'bottom' }}>
              <Box direction="row" margin={{ bottom: '1.5rem' }} wrap={true}>
                {latestRelease?.manifestData?.keywords.map((tag, idx) => (
                  <Box
                    key={idx + tag}
                    round="0.25rem"
                    pad="0.5rem 0.75rem"
                    style={{ cursor: 'pointer' }}
                    margin={{
                      top: '0.5rem',
                      right:
                        idx < latestRelease?.manifestData?.keywords?.length - 1 ? '0.5rem' : '',
                    }}
                    border={{ color: 'darkBorder', size: 'xsmall', style: 'solid', side: 'all' }}
                    onClick={() => handleTagClick(tag)}
                  >
                    {tag}
                  </Box>
                ))}
              </Box>
            </Box>
          )}
        {latestRelease?.manifestData?.license && (
          <Box margin={{ top: 'large' }}>
            <StyledText size="md" weight="bold" marginBottom>
              {licenseLabel}:
            </StyledText>
            <Box direction="row" align="center" margin={{ bottom: '1rem' }}>
              {/* license icons are created accordingly with 'license' starting their names, all in lowercase */}
              {/* <Icon type={'license' + latestRelease?.manifestData?.license} /> */}
              <Text size="md" margin={{ left: '0.5rem' }}>
                {latestRelease?.manifestData?.license}
              </Text>
            </Box>
          </Box>
        )}
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
  releaseIdLabel: 'ReleaseId',
  versionHistoryLabel: 'Version History',
  authorLabel: 'Authors & Contributors',
  licenseLabel: 'License',
};

export default ICDetailCard;
