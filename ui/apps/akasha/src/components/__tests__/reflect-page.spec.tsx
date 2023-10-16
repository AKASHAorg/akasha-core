import * as React from 'react';
import ReflectPage from '../item-page/reflect-page';
import * as Extension from '@akashaorg/design-system-components/lib/components/Extension';

import { renderWithAllProviders, act, genAppProps } from '@akashaorg/af-testing';
import { AnalyticsProvider } from '@akashaorg/ui-awf-hooks/lib/use-analytics';
import { InlineEditor } from '../../extensions/inline-editor/inline-editor';
import { when } from 'jest-when';
import { EntityTypes } from '@akashaorg/typings/lib/ui';

const partialArgs = (...argsToMatch) =>
  when.allArgs((args, equals) => equals(args, expect.arrayContaining(argsToMatch)));

const MockedInlineEditor = ({ action }) => (
  <InlineEditor
    extensionData={{
      name: 'name',
      itemId: '01gf',
      itemType: EntityTypes.REFLECT,
      action,
    }}
  />
);

describe('< ReflectPage /> component', () => {
  const BaseComponent = (
    <AnalyticsProvider {...genAppProps()}>
      <ReflectPage />
    </AnalyticsProvider>
  );

  beforeAll(() => {
    // (
    //   jest.spyOn(profileHooks, 'useGetProfile') as unknown as jest.SpyInstance<{
    //     data: Record<string, unknown>;
    //     status: string;
    //   }>
    // ).mockReturnValue({ data: genLoggedInState(true), status: 'success' });
  });
  // @TODO fix after new hooks
  it.skip('should render reflect page', async () => {
    const spiedExtension = jest.spyOn(Extension, 'default');

    when(spiedExtension)
      .calledWith(
        partialArgs(
          expect.objectContaining({ name: expect.stringMatching(/inline-editor_reflect/) }),
        ),
      )
      .mockReturnValue(<MockedInlineEditor action="reflect" />);

    await act(async () => {
      renderWithAllProviders(BaseComponent, {});
    });

    // expect(screen.getByText(/Reflect to/i)).toBeInTheDocument();
    // expect(screen.getByRole('button', { name: /Reflect/i })).toBeInTheDocument();
  });
});
