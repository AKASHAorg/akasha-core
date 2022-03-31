import React from 'react';
import { Box, Grommet } from 'grommet';
import { isMobileOnly } from 'react-device-detect';

import ICDetailCard, { ICDetailCardProps } from '.';

import lightTheme from '../../styles/themes/light/light-theme';
import { ICDetailAppsData } from '../../utils/dummy-data';

export default {
  title: 'Cards/ICDetailCard',
  component: ICDetailCard,
  argType: {
    onClickShare: { action: 'clicked share' },
    onClickCTA: { action: 'clicked CTA' },
    onClickInstall: { action: 'clicked Install' },
    onClickUninstall: { action: 'clicked Uninstall' },
  },
};

const Template = (args: ICDetailCardProps) => {
  const [isInstalled, setIsInstalled] = React.useState(true);

  return (
    <Grommet theme={lightTheme}>
      <Box width={isMobileOnly ? '100%' : '30%'} pad="none" align="center">
        <ICDetailCard
          {...args}
          isInstalled={isInstalled}
          onClickInstall={() => setIsInstalled(true)}
          onClickUninstall={() => setIsInstalled(false)}
        />
      </Box>
    </Grommet>
  );
};

export const BaseICDetailCard = Template.bind({});

BaseICDetailCard.args = {
  shareLabel: 'Share',
  id: ICDetailAppsData[3].id,
  avatar: ICDetailAppsData[3].avatar,
  coverImage: ICDetailAppsData[3].coverImage,
  installLabel: 'Install',
  uninstallLabel: 'Uninstall',
  installedLabel: 'Installed',
  descriptionLabel: 'Description',
  descriptionContent: ICDetailAppsData[3].description,
  showMoreLabel: 'Show More',
  linksLabel: 'Links',
  releasesLabel: 'Releases',
  releaseTypeLabel: 'Release Type',
  releaseIdLabel: 'Release Id',
  releases: ICDetailAppsData[3].releases,
  versionHistoryLabel: 'Version History',
  authorsLabel: 'Authors & Contributors',
  authors: ICDetailAppsData[3].authors,
  tags: ICDetailAppsData[3].tags,
  licenseLabel: 'License',
  license: ICDetailAppsData[3].license,
};
