import { mergeMap } from 'rxjs';
import * as singleSpa from 'single-spa';
import { TestScheduler } from 'rxjs/testing';
import { genAppConfig } from '@akashaorg/af-testing';
import { getModalFromParams, checkActivityFn, stringToRegExp } from '../src/utils';

describe('[AppLoader] utils/getModalFromParams', () => {
  let scheduler: TestScheduler;
  beforeEach(() => {
    scheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
  });
  it('should return name and params if available', () => {
    const marbles = 'a-b-c|';
    const searches = {
      a: '',
      b: '?modal[name]=login',
      c: '?modal[name]=login&modal[param1]=value1',
    };
    scheduler.run(({ expectObservable, cold }) => {
      const input$ = cold(marbles, searches).pipe(
        mergeMap(search => getModalFromParams({ search } as Location)()),
      );
      const expectedMarble = 'a-b-c|';
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
  let _location: Location;

  test('should return true by default', () => {
    const active = checkActivityFn({
      config: genAppConfig(),
      encodedAppName: 'encoded app name',
    });
    expect(active).toBe(true);
  });

  test('should call singleSpa.pathToActiveWhen and return false', () => {
    const pathToActiveWhenSpy = jest.spyOn(singleSpa, 'pathToActiveWhen');
    const mockRootRoute = '/test';

    const active = checkActivityFn({
      config: {
        ...genAppConfig(),
        activeWhen: (location, pathToActiveWhen) => pathToActiveWhen(mockRootRoute)(location),
      },
      encodedAppName: 'encoded app name',
      location,
    });

    expect(active).toBe(false);
    expect(pathToActiveWhenSpy).toHaveBeenCalledTimes(1);
    /**
     * since activeWhen is defined, _location will not be passed
     */
    expect(pathToActiveWhenSpy).toHaveBeenLastCalledWith(mockRootRoute, _location);
  });
});

describe('[AppLoader] utils/stringToRegxp', () => {
  test('should match `some-ext-point`', () => {
    const matcher = stringToRegExp('some-ext-point');
    expect(matcher.test('some-ext-point')).toBe(true);
  });
  test('should not match `some-ext-point`', () => {
    const matcher = stringToRegExp('some-ext-point');
    expect(matcher.test('some-ext-point-2')).toBe(false);
  });
  test('should match `some-ext-point*`', () => {
    const matcher = stringToRegExp('some-ext-point*');
    expect(matcher.test('some-ext-point_bafrydiaeojf')).toBe(true);
  });
});
