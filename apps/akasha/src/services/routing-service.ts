export const redirect =
  (navigateToUrl: (path: string) => void, callback?: () => void) => (url: string) => {
    if (callback && typeof callback === 'function') {
      callback();
    }
    return navigateToUrl(url);
  };
