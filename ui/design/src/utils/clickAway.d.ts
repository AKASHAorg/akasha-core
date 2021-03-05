import * as React from 'react';
declare const useOnClickAway: (
  ref: React.RefObject<any>,
  handler: (e: any) => void | undefined,
) => void;
declare const useTogglerWithClickAway: (
  togglerElemRef: React.RefObject<any>,
  clickAwayElemRef: React.RefObject<any>,
  handler: (toggled: boolean) => void,
  toggled: boolean,
) => void;
export { useOnClickAway, useTogglerWithClickAway };
