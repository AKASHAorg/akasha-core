import * as React from 'react';
import ContentCard from '../content-card/content-card';
import { act, create, ReactTestRenderer } from 'react-test-renderer';
import { cleanup } from '@testing-library/react';

describe('<ContentCard /> component', () => {
  let componentWrapper: ReactTestRenderer = create(<></>);
  beforeEach(() => {
    act(() => {
      componentWrapper = create(
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
          sdkModules={{}}
          globalChannel={{}}
          handleButtonClick={() => console.log('button click')}
        />,
      );
    });
  });

  afterEach(() => {
    act(() => {
      componentWrapper.unmount();
    });
    cleanup();
  });

  it('when in guest mode, should mount', () => {
    const root = componentWrapper;
    expect(root).toBeDefined();
  });
});
