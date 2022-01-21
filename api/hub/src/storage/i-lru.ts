export interface ILRU {
  set(key: string, value: unknown): Promise<void>;

  get<T>(key: string): Promise<T>;

  has(key: string): Promise<boolean>;

  del(key: string): Promise<void>;

  delete(key: string): Promise<void>;

  /**
   * Add a value to a set
   * @param key
   * @param value
   */
  sAdd(key: string, value: string): Promise<void>;

  /**
   * Returns the members of a set
   * @param key
   */
  sMembers(key: string): Promise<string[]>;

  /**
   * Removes and returns the last value from a set
   * @param key
   */
  sPop(key: string): Promise<string | void>;
}
