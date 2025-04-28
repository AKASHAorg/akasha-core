export type CSSVar = `--${string}`;

export function cssVars<T extends Record<CSSVar, string | number>>(vars: T): React.CSSProperties {
  return vars;
}
