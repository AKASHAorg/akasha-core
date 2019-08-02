export default interface IStash {
  readonly cache;

  get (key: string): Object;

  set (key: string, value: Object): void;
}
