import * as React from 'react';
import ContentCard from '../content-card';

import { screen, renderWithAllProviders, act, genAppProps } from '@akashaorg/af-testing';

describe('< ContentCard /> component', () => {
  const Base = (
    <ContentCard
      isPending={false}
      locale="en"
      showExplanationsLabel="Show Explanation"
      hideExplanationsLabel="Hide Explanation"
      reportedByLabel="Reported by"
      reportedLabel="Reported"
      itemType="post"
      forLabel="for"
      originallyReportedByLabel="Originally reported by"
      itemId="01f3dwm7z3qep88ap4j87vw8p8"
      reasons={['reason-1', 'reason-2']}
      reportedDateTime={new Date()}
      handleButtonClick={jest.fn}
      {...genAppProps()}
    />
  );
  act(() => {
    renderWithAllProviders(Base, {});
  });
  it('should render content card', async () => {
    expect(screen.getByTestId('avatar-image')).toBeInTheDocument();
    expect(screen.getByText(/Post Reported for/i)).toBeInTheDocument();
    expect(screen.getByText(/Originally reported by/i)).toBeInTheDocument();
    expect(screen.getByText(/Show Explanation/i)).toBeInTheDocument();
  });
});
