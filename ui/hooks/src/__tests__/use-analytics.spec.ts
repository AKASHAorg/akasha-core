/**
 * @jest-environment jsdom
 */
import { act, cleanup } from '@testing-library/react';
import { renderHook } from './utils';
import useAnalytics from '../use-analytics';

let container: HTMLElement | null = null;
console.log(renderHook, 'render hook');
beforeEach(() => {
  // create container
  container = document.createElement('div');
  document.body.appendChild(container);
});
afterEach(() => {
  // cleanups
  cleanup();
  container!.remove();
  container = null;
});

describe('useAnalytics', () => {
  it('should render', () => {
    const { rerender, result } = renderHook(useAnalytics, {}, container as HTMLElement);
    act(() => {
      // const res = result.data as any;
      expect(result.data).toBeDefined();
      rerender({});
    });
  });
  // it('should expose actions', () => {
  //   expect(actions).toBeDefined();
  // });
  // it('should set cookieBannerDismissed to true when acceptConsent action is called', () => {
  // actions.acceptConsent('ALL');
  // expect(state.cookieBannerDismissed).toBe(true);
  // });
});
