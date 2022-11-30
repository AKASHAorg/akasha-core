import * as React from 'react';
import { EntityTypes } from '@akashaorg/typings/ui';
import {
  RenderResult,
  genEthAddress,
  genPostData,
  renderWithAllProviders,
  act,
  genAppProps,
  genLoggedInState,
} from '@akashaorg/af-testing';

import EntryCardRenderer from '../entry-renderer';

describe('<EntryCardRenderer /> component', () => {
  let renderResult: RenderResult;

  const BaseComponent = (
    <EntryCardRenderer
      {...genAppProps()}
      onRepost={jest.fn}
      sharePostUrl=""
      locale="en"
      itemType={EntityTypes.POST}
      loginState={genLoggedInState(true)}
      onEntryNavigate={jest.fn}
      navigateTo={jest.fn}
      modalSlotId=""
      i18n={{}} /*TODO: generate mock data for i18n */
    />
  );
  act(() => {
    renderResult = renderWithAllProviders(BaseComponent, {});
  });

  it('should render avatar', async () => {
    const avatarNode = await renderResult.findByTestId('avatar-image');
    expect(avatarNode).toBeDefined();
  });
});
