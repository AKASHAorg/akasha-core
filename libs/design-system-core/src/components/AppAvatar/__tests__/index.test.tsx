import * as React from 'react';
import { act } from '@testing-library/react';
import AppAvatar from '../';
import { customRender } from '../../../test-utils';
import { AkashaAppApplicationType } from '@akashaorg/typings/lib/sdk/graphql-types-new';

describe('<AppAvatar /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  const avatar = {
    height: 320,
    src: '',
    width: 320,
  };

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        <AppAvatar
          appType={AkashaAppApplicationType.App}
          avatar={avatar}
          extensionId="k2t6wzhkhabz2zolcv1p1iw5i2ubcwt7w1ulma6j433zfn8qawjy9l72cubfc5"
        />,
        {},
      );
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    expect(componentWrapper).toBeDefined();
  });

  it('renders avatar fallback for app', () => {
    const { getByRole } = componentWrapper;

    const img = getByRole('img');

    expect(img).toBeDefined();
  });
});
