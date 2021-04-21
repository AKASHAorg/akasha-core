import * as React from 'react';
import ContentCard from '../content-card/content-card';

import { RenderResult, renderWithAllWrappers, act } from '@akashaproject/ui-awf-testing-utils';
import { from } from 'rxjs';

describe('<ContentCard /> component', () => {
  let renderResult: RenderResult;
  const mockObs = from(['test']);
  const mockEntryObs = from(['mock-obs']);
  const globalChannel = { pipe: () => ({ subscribe: () => {}, unsubscribe: () => {} }) };
  const Base = (
    <ContentCard
      isPending={false}
      locale="en"
      showExplanationsLabel="Show Explanation"
      hideExplanationsLabel="Hide Explanation"
      reportedByLabel="Reported by"
      reportedLabel="Reported"
      contentType="post"
      forLabel="for"
      originallyReportedByLabel="Originally reported by"
      entryId="01f3dwm7z3qep88ap4j87vw8p8"
      reasons={['reason-1', 'reason-2']}
      reportedDateTime={new Date().toString()}
      logger={{ log: console.log }}
      singleSpa={{}}
      sdkModules={{
        commons: { ipfsService: { getSettings: () => mockObs } },
        profiles: { profileService: { getProfile: () => mockObs } },
        posts: { entries: { getEntry: () => mockEntryObs } },
      }}
      globalChannel={globalChannel}
      handleButtonClick={jest.fn}
    />
  );
  act(() => {
    renderResult = renderWithAllWrappers(Base, {});
  });
  it('should render an avatar', async () => {
    const avatar = await renderResult.findByTestId('avatar-image');
    expect(avatar).toBeDefined();
  });
});
