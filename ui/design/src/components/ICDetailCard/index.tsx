import * as React from 'react';
import { Box, Drop, Text } from 'grommet';

import ICDetailCardCoverImage from './ic-detail-card-fields/cover-image';
import ICDetailCardAvatar from './ic-detail-card-fields/avatar';
import ICDetailCardDescription from './ic-detail-card-fields/description';

import Icon from '../Icon';
import DuplexButton from '../DuplexButton';
import { MainAreaCardBox, StyledAnchor } from '../EntryCard/basic-card-box';
import { TextLine } from '../TextLine';
import SubtitleTextIcon from '../SubtitleTextIcon';
import { IProfileData } from '@akashaorg/typings/ui';
import { IntegrationReleaseInfo } from '@akashaorg/typings/sdk/graphql-types';
import ProfileAvatarButton from '../ProfileAvatarButton';
import Version from './version';

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
  repoLinkLabel: string;
  docsLinkLabel: string;
  releasesLabel: string;
  releaseVersionLabel: string;
  latestReleaseLabel: string;
  noPreviousReleasesLabel: string;
  versionHistoryLabel: string;
  authorLabel: string;
  ethereumAddressLabel: string;
  licenseLabel: string;

  id?: string;
  integrationName?: string;
  authorEthAddress?: string;
  authorProfile?: IProfileData;
  isInstalled: boolean;
  releases: IntegrationReleaseInfo[];
  latestRelease: IntegrationReleaseInfo;
  isFetching?: boolean;

  onClickShare: () => void;
  onClickCTA: () => void;
  onClickInstall: () => void;
  onClickUninstall: () => void;
  handleAuthorClick?: (IProfileData) => void;
  handleAuthorEthAddressClick?: (string) => void;
  handleTagClick?: (tag: string) => void;
  description?: string;
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
    repoLinkLabel,
    docsLinkLabel,
    releasesLabel,
    releaseVersionLabel,
    latestReleaseLabel,
    noPreviousReleasesLabel,
    versionHistoryLabel,
    authorLabel,
    ethereumAddressLabel,
    licenseLabel,
    id,
    integrationName,
    authorEthAddress,
    authorProfile,
    isInstalled,
    releases = [],
    latestRelease,
    isFetching,
    onClickShare,
    // onClickCTA,
    onClickInstall,
    onClickUninstall,
    handleAuthorClick,
    handleAuthorEthAddressClick,
    handleTagClick,
    description,
  } = props;

  const [showReleases, setShowReleases] = React.useState(false);
  const handleShowVersionHistory = () => {
    setShowReleases(true);
  };

  const [showLatestReleaseDrop, setShowLatestReleaseDrop] = React.useState(false);
  const latestReleaseIconRef = React.useRef();

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
                latestRelease?.integrationType === 2
                  ? 'integrationWidgetLarge'
                  : 'integrationAppLarge'
              }
            />
            <Box pad={{ vertical: 'xxsmall', left: 'xsmall', right: 'small' }}>
              {latestRelease?.manifestData?.displayName && integrationName && (
                <SubtitleTextIcon
                  label={latestRelease?.manifestData?.displayName}
                  subtitle={integrationName}
                  subtitleIcon="info"
                  subtitleIconTooltip={id}
                />
              )}
              {isFetching && !latestRelease?.manifestData?.displayName && (
                <Box gap="xxsmall">
                  <TextLine title="integrationName" animated={false} width="140px" />
                  <TextLine title="integrationName" animated={false} width="80px" />
                </Box>
              )}
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
        <Box pad={{ vertical: 'large' }} border={{ side: 'bottom' }}>
          <Text weight={'bold'} size="large">
            {descriptionLabel}
          </Text>
          {description && <ICDetailCardDescription description={description} />}
          {isFetching && !latestRelease?.manifestData?.description && (
            <TextLine title="integrationDescription" animated={false} width="250px" />
          )}
        </Box>
        {(latestRelease?.links?.documentation || latestRelease?.links?.publicRepository) && (
          <Box pad={{ vertical: 'large' }} border={{ side: 'bottom' }} gap="small">
            <Text weight={'bold'}>{linksLabel}</Text>
            {latestRelease?.links?.documentation && (
              <Box>
                <Text>{docsLinkLabel}</Text>
                <StyledAnchor
                  label={latestRelease?.links?.documentation}
                  href={latestRelease?.links?.documentation}
                />
              </Box>
            )}
            {latestRelease?.links?.publicRepository && (
              <Box>
                <Text>{repoLinkLabel}</Text>
                <StyledAnchor
                  label={latestRelease?.links?.publicRepository}
                  href={latestRelease?.links?.publicRepository}
                  target="_blank"
                />
              </Box>
            )}
          </Box>
        )}
        <Box pad={{ vertical: 'large' }} border={{ side: 'bottom' }} gap="small">
          <Text weight={'bold'}>{latestReleaseLabel}</Text>
          <Text>{releaseVersionLabel}</Text>
          {latestRelease?.version && (
            <Box direction="row" gap="xsmall">
              <Text size="sm" color="secondaryText">
                {latestRelease?.version}
              </Text>
              <Icon
                ref={latestReleaseIconRef}
                size="xs"
                type="info"
                accentColor={true}
                clickable={true}
                onClick={() => setShowLatestReleaseDrop(!showLatestReleaseDrop)}
              />
              {showLatestReleaseDrop && latestReleaseIconRef.current && (
                <Drop
                  margin={{ left: 'xsmall' }}
                  align={{ left: 'right' }}
                  target={latestReleaseIconRef.current}
                  onClickOutside={() => setShowLatestReleaseDrop(false)}
                >
                  <Box background="activePanelBackground" round="xsmall" pad="xsmall">
                    <Text>{latestRelease?.id}</Text>
                  </Box>
                </Drop>
              )}
            </Box>
          )}
          {isFetching && !latestRelease?.version && (
            <TextLine title="integrationVersion" animated={false} width="70px" />
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
              releases?.map(release => (
                <Version key={release.id} releaseId={release.id} version={release.version} />
              ))}
          </Box>
        )}

        <Box pad={{ vertical: 'large' }} border={{ side: 'bottom' }} gap="small">
          <Text weight={'bold'}>{authorLabel}</Text>
          {isFetching && !authorProfile && (
            <Box direction="row">
              <Box direction="row" align="center">
                <Box>
                  <TextLine title="avatar" width="40px" height="40px" round={{ size: '50%' }} />
                </Box>
                <Box direction="column" margin={{ left: '8px' }}>
                  <TextLine
                    title="author name"
                    width="220px"
                    height={{ min: '18px' }}
                    animated={false}
                  />
                  <TextLine
                    title="entry-publish-date"
                    width="160px"
                    margin={{ top: '4px' }}
                    animated={false}
                  />
                </Box>
              </Box>
            </Box>
          )}
          {authorProfile && (
            <ProfileAvatarButton
              avatarImage={authorProfile.avatar}
              ethAddress={authorProfile.ethAddress}
              label={authorProfile.name}
              info={authorProfile.userName && `@${authorProfile.userName}`}
              onClick={() => handleAuthorClick(authorProfile)}
            />
          )}
          <Text>{ethereumAddressLabel}</Text>
          {isFetching && !authorEthAddress && (
            <TextLine title="integrationAuthorEthAddress" animated={false} width="150px" />
          )}
          {authorEthAddress && (
            <Text
              size="md"
              color="accent"
              style={{ cursor: 'pointer' }}
              onClick={() => handleAuthorEthAddressClick(authorEthAddress)}
            >
              {authorEthAddress}
            </Text>
          )}
        </Box>

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
            {isFetching && !latestRelease?.manifestData?.license && (
              <TextLine title="integrationLicense" animated={false} width="70px" />
            )}
            {latestRelease?.manifestData?.license && (
              <Box direction="row" align="center" margin={{ bottom: '1rem' }}>
                {/* license icons are created accordingly with 'license' starting their names, all in lowercase */}
                {/* <Icon type={'license' + latestRelease?.manifestData?.license} /> */}
                <Text size="md" margin={{ left: '0.5rem' }}>
                  {latestRelease?.manifestData?.license}
                </Text>
              </Box>
            )}
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
  versionHistoryLabel: 'Version History',
  authorLabel: 'Authors & Contributors',
  licenseLabel: 'License',
};

export default ICDetailCard;
