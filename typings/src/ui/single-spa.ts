export interface ISingleSpaLifecycle {
  bootstrap: (props: unknown) => Promise<unknown>;
  mount: (props: unknown) => Promise<unknown>;
  unmount: (props: unknown) => Promise<unknown>;
  update?: (props: unknown) => Promise<unknown>;
}
