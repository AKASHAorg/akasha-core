export interface IDraftStorage {
  setItem(key: string, value: string): void;

  getItem(key: string): string;

  removeItem(key: string): void;
}

interface IDraftFields {
  storage: IDraftStorage;
  appName: string;
  userId: string;
  action: 'post' | 'repost';
}

interface IDraft<T> extends IDraftFields {
  save(content: T): void;

  get(): void;

  clear(): void;
}

export class Draft<T> implements IDraft<T> {
  storage: IDraftStorage;
  appName: string;
  userId: string;
  action: 'post' | 'repost';

  constructor({ storage, appName, userId, action }: IDraftFields) {
    this.storage = storage;
    this.appName = appName;
    this.userId = userId;
    this.action = action;
  }

  static getDraftKey(appName: string, userId: string, action: string) {
    return `${appName}-${userId}-draft-${action}`;
  }

  save(content: T) {
    this.storage.setItem(
      Draft.getDraftKey(this.appName, this.userId, this.action),
      JSON.stringify(content),
    );
  }

  get() {
    try {
      return JSON.parse(
        this.storage.getItem(Draft.getDraftKey(this.appName, this.userId, this.action)),
      ) as T;
    } catch {
      return null;
    }
  }

  clear() {
    this.storage.removeItem(Draft.getDraftKey(this.appName, this.userId, this.action));
  }
}
