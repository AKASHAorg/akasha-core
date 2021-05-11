import * as React from 'react';
// import { create } from 'react-test-renderer';
import { render } from '@testing-library/react';

import TutorialWidgetCard from '../';
import { wrapWithTheme } from '../../../test-utils';

describe('TutorialWidgetCard component', () => {
  it('renders correctly', () => {
    render(
      wrapWithTheme(
        <TutorialWidgetCard
          currentProgress={0}
          titleLabel={'Pick your ethereum name'}
          subtitleLabel={'Take your address to the next level'}
          infoLabel={
            'Your human-friendly Ethereum name can be used also in wallets instead of your address'
          }
          subtitleIcon={'iconEns'}
          seeVideoTutorialLabel={'See video tutorial'}
          callToActionLabel={'Go to app'}
          learnMoreLabel={'Learn more'}
          handleSeeVideoTutorial={() => null}
          handleDismiss={() => null}
          //   handleFollowProfile={() => null}
          //   handleUnfollowProfile={() => null}
          //   handleSubscribeTag={() => null}
          //   handleUnsubscribeTag={() => null}
        />,
      ),
    );
  });
});
