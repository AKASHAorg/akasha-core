import * as React from 'react';

export interface IConfig {
  attributes?: boolean;
  /**
   * Trigger callback only for these attributes
   */
  attributesFilter?: string[];
  childList?: boolean;
}

export const useMutationObserver = (
  domEl: HTMLElement | null,
  callback: MutationCallback,
  config?: IConfig,
) => {
  const observer = React.useRef(new MutationObserver(callback));

  React.useEffect(() => {
    if (domEl) {
      observer.current.observe(domEl, { attributes: true, ...config });
      return () => observer.current.disconnect();
    }
    return () => undefined;
  }, [domEl, config]);
};
