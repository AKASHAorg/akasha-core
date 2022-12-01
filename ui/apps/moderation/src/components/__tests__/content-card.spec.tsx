import * as React from 'react';

import { EntityTypes } from '@akashaorg/typings/ui';
import { screen, renderWithAllProviders, act, genAppProps, cleanup } from '@akashaorg/af-testing';

import ContentCard from '../content-card';

describe('<ContentCard /> component', () => {
  const Base = (
    <ContentCard
      incidentLabel=""
      uniqueId="skhgdfbiruwoytwrht"
      isPending={false}
      locale="en"
      showExplanationsLabel="Show Explanation"
      hideExplanationsLabel="Hide Explanation"
      reportedByLabel="Reported by"
      reportedLabel="Reported"
      itemType={EntityTypes.POST}
      forLabel="for"
      originallyReportedByLabel="Originally reported by"
      itemId="01f3dwm7z3qep88ap4j87vw8p8"
      reasons={['reason-1', 'reason-2']}
      reportedDateTime={new Date()}
      handleButtonClick={jest.fn}
      {...genAppProps()}
    />
  );

  let componentWrapper = renderWithAllProviders(<></>, {});

  beforeAll(() => {
    act(() => {
      componentWrapper = renderWithAllProviders(Base, {});
    });
  });

  afterAll(() => {
    act(() => componentWrapper.unmount());
    cleanup();
  });

  it('should render content card', async () => {
    expect(screen.getByTestId('avatar-image')).toBeInTheDocument();
    expect(screen.getByText(/Reported for/i)).toBeInTheDocument();
    expect(screen.getByText(/Originally reported by/i)).toBeInTheDocument();
  });
});
