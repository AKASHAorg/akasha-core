import * as React from 'react';
import { act, cleanup } from '@testing-library/react';

import ICDetailCard from '../';
import { customRender, wrapWithTheme } from '../../../test-utils';
import { ICDetailAppsData } from '../../../utils/dummy-data';

describe('<ICDetailCard /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  const handleClickShare = jest.fn();
  const handleClickCTA = jest.fn();
  const handleClickInstall = jest.fn();
  const handleClickUninstall = jest.fn();
  const handleAuthorClick = jest.fn();
  const handleAuthorEthAddressClick = jest.fn();
  const handleTagClick = jest.fn();

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        wrapWithTheme(
          <ICDetailCard
            shareLabel="Share"
            installLabel="Install"
            uninstallLabel="Uninstall"
            installedLabel="Installed"
            descriptionLabel="Description"
            showMoreLabel="Show More"
            linksLabel="Links"
            releasesLabel={'Releases'}
            releaseVersionLabel={'Version'}
            latestReleaseLabel={'Latest release'}
            noPreviousReleasesLabel={'No previous releases'}
            releaseIdLabel={'Release Id'}
            versionHistoryLabel="Version History"
            authorLabel="Authors & Contributors"
            licenseLabel="License"
            isInstalled={false}
            releases={ICDetailAppsData[3].releases}
            latestRelease={ICDetailAppsData[3].releases[0]}
            id="0x41249dasda269423432534bfafa"
            integrationName={ICDetailAppsData[3].name}
            authorEthAddress="0x428478234k2jn4das4234fsa23"
            onClickShare={handleClickShare}
            onClickCTA={handleClickCTA}
            onClickInstall={handleClickInstall}
            onClickUninstall={handleClickUninstall}
            handleAuthorClick={handleAuthorClick}
            handleAuthorEthAddressClick={handleAuthorEthAddressClick}
            handleTagClick={handleTagClick}
          />,
        ),
        {},
      );
    });
  });

  afterEach(() => {
    act(() => componentWrapper.unmount());
    cleanup();
  });

  it('renders correctly', () => {
    expect(componentWrapper).toBeDefined();
  });

  it('has correct integration name', () => {
    const { getByText } = componentWrapper;
    const title = getByText(ICDetailAppsData[3].name);
    expect(title).toBeDefined();
  });
});
