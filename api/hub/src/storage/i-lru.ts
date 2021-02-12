export interface ILRU {
  set(key: string, value: any): Promise<void>;

  get(key: string): Promise<any>;

  has(key: string): Promise<boolean>;

  del(key: string): Promise<void>;
}
