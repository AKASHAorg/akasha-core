import * as React from 'react';
import { Box, Text } from 'grommet';

import ICDetailCardCoverImage from './ic-detail-card-fields/cover-image';
import ICDetailCardAvatar from './ic-detail-card-fields/avatar';

import Icon from '../Icon';
import DuplexButton from '../DuplexButton';
import { MainAreaCardBox, StyledAnchor } from '../EntryCard/basic-card-box';

import SubtitleTextIcon from '../SubtitleTextIcon';
import { ReleaseInfo } from '@akashaproject/ui-awf-typings';
import { IProfileData } from '@akashaproject/ui-awf-typings/lib/profile';
import ProfileAvatarButton from '../ProfileAvatarButton';

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

  id?: string;
  integrationName?: string;
  authorEthAddress?: string;
  authorProfile?: IProfileData;
  isInstalled: boolean;
  releases: any[];
  latestRelease: ReleaseInfo;

  onClickShare: () => void;
  onClickCTA: () => void;
  onClickInstall: () => void;
  onClickUninstall: () => void;
  handleAuthorClick?: (IProfileData) => void;
  handleAuthorEthAddressClick?: (string) => void;
  handleTagClick?: (tag: string) => void;
}

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
    id,
    integrationName,
    authorEthAddress,
    authorProfile,
    isInstalled,
    releases = [],
    latestRelease,
    onClickShare,
    // onClickCTA,
    onClickInstall,
    onClickUninstall,
    handleAuthorClick,
    handleAuthorEthAddressClick,
    handleTagClick,
  } = props;

  const [showReleases, setShowReleases] = React.useState(false);
  const handleShowVersionHistory = () => {
    setShowReleases(true);
  };

  const [showReleaseId, setShowReleaseId] = React.useState(false);
  const handleShowReleaseId = () => {
    setShowReleaseId(!showReleaseId);
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
            <ICDetailCardAvatar
              ethAddress={latestRelease?.id}
              iconType={
                latestRelease.integrationType === 2
                  ? 'integrationWidgetLarge'
                  : 'integrationAppLarge'
              }
            />
            <Box pad={{ vertical: 'xxsmall', left: 'xsmall', right: 'small' }}>
              <SubtitleTextIcon
                label={latestRelease?.manifestData?.displayName}
                subtitle={integrationName}
                subtitleIcon="info"
                subtitleIconTooltip={id}
              />
            </Box>
          </Box>
          <Box direction="row" data-testid="ic-detail-card-install-button">
            {/* <Box
              pad="0.2rem 0.3rem"
              round="0.2rem"
              margin={{ right: '0.5rem' }}
              border={{ color: 'accent', size: 'xsmall', style: 'solid', side: 'all' }}
              onClick={onClickCTA}
            >
              <Icon size="md" type="settings" accentColor={true} />
            </Box> */}
            {latestRelease?.integrationType === 1 ? (
              <DuplexButton
                icon={isInstalled ? <Icon type="checkSimple" size="xs" /> : null}
                activeIcon={<Icon type="checkSimple" accentColor={true} />}
                activeHoverIcon={<Icon type="close" />}
                active={isInstalled}
                activeLabel={installedLabel}
                inactiveLabel={installLabel}
                activeHoverLabel={uninstallLabel}
                onClickActive={onClickUninstall}
                onClickInactive={onClickInstall}
              />
            ) : (
              <Icon type="checkSimple" accentColor={true} size="md" />
            )}
          </Box>
        </Box>
        <Box pad={{ vertical: 'large' }} border={{ side: 'bottom' }} gap="small">
          <Text weight={'bold'}>{descriptionLabel}</Text>
          <Text size="md" style={{ lineHeight: '1.375rem' }}>
            {latestRelease?.manifestData?.description}
          </Text>
        </Box>
        {(latestRelease?.links?.documentation || latestRelease?.links?.publicRepository) && (
          <Box pad={{ vertical: 'large' }} border={{ side: 'bottom' }}>
            <Text weight={'bold'}>{linksLabel}</Text>
            {latestRelease?.links?.documentation && (
              <StyledAnchor
                label={latestRelease?.links?.documentation}
                href={latestRelease?.links?.documentation}
              />
            )}
            {latestRelease?.links?.publicRepository && (
              <StyledAnchor
                label={latestRelease?.links?.publicRepository}
                href={latestRelease?.links?.publicRepository}
                target="_blank"
              />
            )}
          </Box>
        )}
        <Box pad={{ vertical: 'large' }} border={{ side: 'bottom' }} gap="small">
          <Text weight={'bold'}>{latestReleaseLabel}</Text>

          <Box direction="row" gap="xsmall">
            <Text>{releaseVersionLabel}</Text>
            <Icon
              size="xs"
              type={showReleaseId ? 'closedEye' : 'eye'}
              accentColor={true}
              onClick={handleShowReleaseId}
            />
          </Box>

          <Text size="sm" color="secondaryText">
            {latestRelease?.version}
          </Text>
          {showReleaseId && (
            <Box>
              <Text>{releaseIdLabel}</Text>
              <Text size="sm" color="secondaryText">
                {latestRelease?.id}
              </Text>
            </Box>
          )}
          {!showReleases && (
            <Text
              size="md"
              color="accent"
              style={{ cursor: 'pointer' }}
              onClick={handleShowVersionHistory}
            >
              {versionHistoryLabel}
            </Text>
          )}
        </Box>
        {showReleases && (
          <Box pad={{ vertical: 'large' }} border={{ side: 'bottom' }} gap="small">
            <Text weight={'bold'}>{releasesLabel}</Text>
            {releases?.length === 0 && <Text>{noPreviousReleasesLabel}</Text>}
            {releases?.length !== 0 &&
              releases?.map(release => <Text key={release.id}>{release.id}</Text>)}
          </Box>
        )}
        {authorEthAddress && (
          <Box pad={{ vertical: 'large' }} border={{ side: 'bottom' }} gap="small">
            {authorProfile && (
              <ProfileAvatarButton
                avatarImage={authorProfile.avatar}
                ethAddress={authorProfile.ethAddress}
                label={authorProfile.name}
                info={authorProfile.userName && `@${authorProfile.userName}`}
                onClick={() => handleAuthorClick(authorProfile)}
              />
            )}
            <Text weight={'bold'}>{authorLabel}</Text>

            <Box direction="row">
              <Text
                size="md"
                color="accent"
                style={{ cursor: 'pointer' }}
                onClick={() => handleAuthorEthAddressClick(authorEthAddress)}
              >
                {authorEthAddress}
              </Text>
            </Box>
          </Box>
        )}
        {latestRelease?.manifestData?.keywords &&
          latestRelease?.manifestData?.keywords?.length > 0 && (
            <Box margin={{ top: 'medium' }} border={{ side: 'bottom' }} gap="small">
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
          <Box pad={{ top: 'large' }} gap="small">
            <Text weight={'bold'}>{licenseLabel}:</Text>
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
