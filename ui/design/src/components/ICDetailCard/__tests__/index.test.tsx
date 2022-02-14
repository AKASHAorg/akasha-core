import * as React from 'react';
import { act, cleanup } from '@testing-library/react';

import ICDetailCard from '../';
import { customRender, wrapWithTheme } from '../../../test-utils';
import { ICWorldAppsData } from '../../../utils/dummy-data';

describe('<ICDetailCard /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  const handleClickShare = jest.fn();
  const handleClickCTA = jest.fn();
  const handleClickInstall = jest.fn();
  const handleClickUninstall = jest.fn();

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
            releaseTypeLabel={'Release Type'}
            releaseIdLabel={'Release Id'}
            versionHistoryLabel="Version History"
            authorsLabel="Authors & Contributors"
            licenseLabel="License"
            descriptionContent={ICWorldAppsData[3].description}
            isInstalled={false}
            links={[]}
            releases={ICWorldAppsData[3].releases}
            authors={ICWorldAppsData[3].authors}
            tags={ICWorldAppsData[3].tags}
            license={ICWorldAppsData[3].license}
            onClickShare={handleClickShare}
            onClickCTA={handleClickCTA}
            onClickInstall={handleClickInstall}
            onClickUninstall={handleClickUninstall}
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
    const title = getByText(ICWorldAppsData[3].name);
    expect(title).toBeDefined();
  });
});
