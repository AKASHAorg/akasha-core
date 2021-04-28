import * as React from 'react';
// import { create } from 'react-test-renderer';
import { render } from '@testing-library/react';

import FilterCard from '../';
import ProfileAvatarButton from '../../ProfileAvatarButton';
import { wrapWithTheme } from '../../../test-utils';

describe('FilterCard component', () => {
  const titleElement = (
    <ProfileAvatarButton
      avatarImage="https://placebeard.it/360x360"
      onClick={() => null}
      label="@ivacarter"
      info="ivacarter.akasha.eth"
      size="sm"
      ethAddress={'0x000000'}
    />
  );
  it('renders correctly', () => {
    render(
      wrapWithTheme(
        <FilterCard
          titleElement={titleElement}
          handleClickAll={() => null}
          handleClickFollowing={() => null}
          handleClickLatest={() => null}
          handleClickOldest={() => null}
        />,
      ),
    );
  });
});
