import { IAppConfig } from '@akashaproject/ui-awf-typings/lib/app-loader';
import { from, mergeMap } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import { getModalFromParams, checkActivityFn } from '../src/utils';
import * as singleSpa from 'single-spa';

describe('[AppLoader] utils/getModalFromParams', () => {
  let scheduler: TestScheduler;
  beforeEach(() => {
    scheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
  });
  it('should return name and params if available', () => {
    const searches = ['', '?modal[name]=login', '?modal[name]=login&modal[param1]=value1'];
    scheduler.run(({ expectObservable }) => {
      const input$ = from(searches).pipe(
        mergeMap(search => getModalFromParams({ search } as Location)()),
      );
      const expectedMarble = '(abc|)';
      const expectedValues = {
        a: { name: null },
        b: { name: 'login' },
        c: { name: 'login', param1: 'value1' },
      };
      expectObservable(input$).toBe(expectedMarble, expectedValues);
    });
  });
});

describe('[AppLoader] utils/checkActivityFn', () => {
  test('should return true by default', () => {
    const active = checkActivityFn({} as IAppConfig);
    expect(active).toBe(true);
  });
  test('should call singleSpa.pathToActiveWhen and return false', () => {
    const pathToActiveWhenSpy = jest.spyOn(singleSpa, 'pathToActiveWhen');
    const mockRootRoute = '/test';
    const active = checkActivityFn({
      activeWhen: (location, pathToActiveWhen) => pathToActiveWhen(mockRootRoute)(location),
    } as IAppConfig);
    expect(pathToActiveWhenSpy).toHaveBeenCalledWith(mockRootRoute);
    expect(active).toBe(false);
  });
});
