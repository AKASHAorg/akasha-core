import * as React from 'react';

export interface IConfig {
  attributes: boolean;
  /**
   * Trigger callback only for these attributes
   */
  attributesFilter?: string[];
}

export const useMutationObserver = (
  domEl: HTMLElement | null,
  callback: MutationCallback,
  config?: IConfig,
) => {
  const observer = React.useMemo(() => new MutationObserver(callback), [callback]);

  React.useEffect(() => {
    if (domEl) {
      observer.observe(domEl, config);
      return () => observer.disconnect();
    }
    return () => undefined;
  }, [domEl, config]);
};
