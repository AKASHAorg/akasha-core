import getSDK from '@akashaorg/awf-sdk';

import constants from './constants';

const {
  BASE_REPORT_URL,
  BASE_STATUS_URL,
  BASE_REASONS_URL,
  BASE_DECISION_URL,
  BASE_MODERATOR_URL,
  DEFAULT_FETCH_TIMEOUT,
  PENDING_CACHE_KEY_PREFIX,
  MODERATED_CACHE_KEY_PREFIX,
  MODERATION_COUNT_CACHE_KEY_PREFIX,
} = constants;

type Profile = {
  pubKey: string;
  ethAddress: string;
  name: string;
  userName: string;
  avatar: string;
};

export interface ModerationStatus {
  contentId: string;
  delisted: boolean;
  moderated: boolean;
  reason: string;
  reported: boolean;
}

export interface Reason {
  _id: string;
  _mod: Date;
  creationDate: Date;
  active: boolean;
  description: string;
  label: string;
}

export interface ICount {
  kept: number;
  pending: number;
  delisted: number;
}

export interface EntryReport {
  _id: string;
  _mod: Date;
  creationDate: Date;
  author: string;
  contentID: string;
  contentType: string;
  explanation: string;
  reason: string;
}

export interface ILogItem {
  decisionID: string;
  contentID: string;
  contentType: string;
  delisted: false;
  reasons: string[];
  explanation: string;
  moderator: Profile;
  moderatedDate: Date;
  reports: number;
}

export interface IPendingItem {
  _id: string;
  _mod: Date;
  creationDate: Date;
  decisionID: string;
  contentID: string;
  contentType: string;
  delisted: boolean;
  moderated: boolean;
  reasons: string[];
  explanation: string;
  reportedBy: string;
  reportedByProfile: Profile;
  reportedDate: Date;
  reports: number;
  count: number;
}

export interface IModeratedItem extends IPendingItem {
  moderator: string;
  moderatedDate?: Date;
  evaluationDate?: Date;
  moderatorProfile: Profile;
}

interface PaginatedResponse {
  nextIndex: string | null;
  total: number;
}

export interface LogItemsReponse extends PaginatedResponse {
  results: ILogItem[];
}

export interface PendingItemsReponse extends PaginatedResponse {
  results: IPendingItem[];
}

export interface ModeratedItemsReponse extends PaginatedResponse {
  results: IModeratedItem[];
}

export interface CreateModerationReturn {
  [key: string]: string | number;
}

/**
 * Creates moderation entry
 * @returns response HTTP status code
 * @example Creating a moderation entry
 * ```typescript
 * const status = await createModeration('https://someendpoint', {contentId: 'some-content-id', contentType: 'post', data: object, signature: 'sig'}, 12000);
 * ```
 */
export const createModeration = async (
  url: string,
  data: {
    contentId: string;
    contentType: string;
    data: { [key: string]: string };
    signature: string;
  },
  timeout = DEFAULT_FETCH_TIMEOUT,
): Promise<CreateModerationReturn> => {
  const rheaders = new Headers();

  const sdk = getSDK();

  const key = sdk.services.stash.computeKey({
    method: 'POST',
    url,
    data: data,
    statusOnly: false,
  });
  const uiCache = sdk.services.stash.getUiStash();
  if (uiCache.has(key)) {
    return uiCache.get(key) as CreateModerationReturn;
  }
  rheaders.append('Content-Type', 'application/json');

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  const response = await fetch(url, {
    signal: controller.signal,
    method: 'POST',
    headers: rheaders,
    body: JSON.stringify(data),
  });

  clearTimeout(timer);

  return response.json().then(serializedResponse => {
    uiCache.set(key, serializedResponse);
    return serializedResponse;
  });
};

/**
 * Checks the moderation status (reported, delisted, kept) of entries
 * @returns serialized response
 * @example Getting entry's moderation status
 * ```typescript
 * const response = await getEntryModerationStatus({user: 'logged-user-pubkey', contentIds: ['some-content-id-1', 'some-content-id-2', 'some-content-id-3']}, 12000);
 * ```
 */
export const getEntryModerationStatus = async (
  data: {
    user: string;
    contentIds: string[];
  },
  timeout = DEFAULT_FETCH_TIMEOUT,
): Promise<ModerationStatus[]> => {
  const rheaders = new Headers();

  const sdk = getSDK();

  const key = sdk.services.stash.computeKey({
    method: 'POST',
    url: BASE_STATUS_URL,
    data: data,
    statusOnly: false,
  });
  const uiCache = sdk.services.stash.getUiStash();
  if (uiCache.has(key)) {
    return uiCache.get(key) as ModerationStatus[];
  }
  rheaders.append('Content-Type', 'application/json');

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  const response = await fetch(BASE_STATUS_URL, {
    signal: controller.signal,
    method: 'POST',
    headers: rheaders,
    body: JSON.stringify(data),
  });

  clearTimeout(timer);

  return response.json().then(serializedResponse => {
    uiCache.set(key, serializedResponse);
    return serializedResponse;
  });
};

/**
 * Gets predefined moderation reasons
 * @returns serialized response
 * @example Getting the moderation reasons
 * ```typescript
 * // set active as true to fetch only active reasons
 * const response = await getModerationReasons({active: true}, 12000);
 * ```
 */
export const getModerationReasons = async (
  data: { active: boolean },
  timeout = DEFAULT_FETCH_TIMEOUT,
): Promise<Reason[]> => {
  const rheaders = new Headers();

  const sdk = getSDK();

  const key = sdk.services.stash.computeKey({
    method: 'POST',
    url: BASE_REASONS_URL,
    data: data,
    statusOnly: false,
  });
  const uiCache = sdk.services.stash.getUiStash();
  if (uiCache.has(key)) {
    return uiCache.get(key) as Reason[];
  }
  rheaders.append('Content-Type', 'application/json');

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  const response = await fetch(BASE_REASONS_URL, {
    signal: controller.signal,
    method: 'POST',
    headers: rheaders,
    body: JSON.stringify(data),
  });

  clearTimeout(timer);

  return response.json().then(serializedResponse => {
    uiCache.set(key, serializedResponse);
    return serializedResponse;
  });
};

/**
 * Determines if a logged in user is a moderator or not
 * @returns response HTTP status code
 * @example Checking moderator status
 * ```typescript
 * const status = await getModeratorStatus('logged-user-pubkey', 12000);
 * ```
 */
export const getModeratorStatus = async (
  loggedUser: string,
  timeout = DEFAULT_FETCH_TIMEOUT,
): Promise<number> => {
  const rheaders = new Headers();
  const sdk = getSDK();
  const key = sdk.services.stash.computeKey({
    method: 'HEAD',
    url: `${BASE_MODERATOR_URL}/${loggedUser}`,
    data: {},
    statusOnly: true,
  });
  const uiCache = sdk.services.stash.getUiStash();
  if (uiCache.has(key)) {
    return uiCache.get(key) as number;
  }
  rheaders.append('Content-Type', 'application/json');

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  const response = await fetch(`${BASE_MODERATOR_URL}/${loggedUser}`, {
    signal: controller.signal,
    method: 'HEAD',
    headers: rheaders,
  });

  clearTimeout(timer);

  uiCache.set(key, response.status);

  return response.status;
};

/**
 * Gets a detailed breakdown of moderation items
 * @returns serialized response
 * @example Getting moderation counters
 * ```typescript
 * const response = await getModerationCounters(12000);
 * ```
 */
export const getModerationCounters = async (timeout = DEFAULT_FETCH_TIMEOUT): Promise<ICount> => {
  const rheaders = new Headers();
  const sdk = getSDK();
  const key = sdk.services.stash.computeKey({
    method: 'GET',
    url: `${BASE_STATUS_URL}/counters`,
    data: {},
    statusOnly: false,
  });
  const uiCache = sdk.services.stash.getUiStash();
  if (uiCache.has(`${MODERATION_COUNT_CACHE_KEY_PREFIX}-${key}`)) {
    return uiCache.get(`${MODERATION_COUNT_CACHE_KEY_PREFIX}-${key}`) as ICount;
  }
  rheaders.append('Content-Type', 'application/json');

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  const response = await fetch(`${BASE_STATUS_URL}/counters`, {
    signal: controller.signal,
    method: 'GET',
    headers: rheaders,
  });

  clearTimeout(timer);

  return response.json().then(serializedResponse => {
    uiCache.set(`${MODERATION_COUNT_CACHE_KEY_PREFIX}-${key}`, serializedResponse);
    return serializedResponse;
  });
};

/**
 * Gets the reports for a specific entry
 * @returns serialized response
 * @example Getting entry reports
 * ```typescript
 * const response = await getEntryReports('some-entry-id', 12000);
 * ```
 */
export const getEntryReports = async (
  entryId: string,
  timeout = DEFAULT_FETCH_TIMEOUT,
): Promise<EntryReport[]> => {
  const rheaders = new Headers();
  const sdk = getSDK();
  const key = sdk.services.stash.computeKey({
    method: 'POST',
    url: `${BASE_REPORT_URL}/list/${entryId}`,
    data: {},
    statusOnly: false,
  });
  const uiCache = sdk.services.stash.getUiStash();
  if (uiCache.has(key)) {
    return uiCache.get(key) as EntryReport[];
  }
  rheaders.append('Content-Type', 'application/json');

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  const response = await fetch(`${BASE_REPORT_URL}/list/${entryId}`, {
    signal: controller.signal,
    method: 'POST',
    headers: rheaders,
  });

  clearTimeout(timer);

  return response.json().then(serializedResponse => {
    uiCache.set(key, serializedResponse);
    return serializedResponse;
  });
};

/**
 * Gets log of moderated items
 * @returns serialized response
 * @example Getting moderation log items
 * ```typescript
 * const response = await getLogItems({limit: 10, offset: 'optional-entry-id-to-start-from'}, 12000);
 * ```
 */
export const getLogItems = async (
  data: {
    limit?: number;
    offset?: string;
  },
  timeout = DEFAULT_FETCH_TIMEOUT,
): Promise<LogItemsReponse> => {
  const rheaders = new Headers();
  const sdk = getSDK();
  const key = sdk.services.stash.computeKey({
    method: 'POST',
    url: `${BASE_DECISION_URL}/log`,
    data,
    statusOnly: false,
  });
  const uiCache = sdk.services.stash.getUiStash();
  if (uiCache.has(key)) {
    return uiCache.get(key) as LogItemsReponse;
  }
  rheaders.append('Content-Type', 'application/json');

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  const response = await fetch(`${BASE_DECISION_URL}/log`, {
    signal: controller.signal,
    method: 'POST',
    headers: rheaders,
    body: JSON.stringify(data),
  });

  clearTimeout(timer);

  return response.json().then(serializedResponse => {
    uiCache.set(key, serializedResponse);
    return serializedResponse;
  });
};

/**
 * Gets pending moderation items
 * @returns serialized response
 * @example Getting pending moderation items
 * ```typescript
 * const response = await getPendingItems({limit: 10, offset: 'optional-entry-id-to-start-from'}, 12000);
 * ```
 */
export const getPendingItems = async (
  data: {
    limit?: number;
    offset?: string;
  },
  timeout = DEFAULT_FETCH_TIMEOUT,
): Promise<PendingItemsReponse> => {
  const rheaders = new Headers();

  const sdk = getSDK();
  const key = sdk.services.stash.computeKey({
    method: 'POST',
    url: `${BASE_DECISION_URL}/pending`,
    data,
    statusOnly: false,
  });

  const uiCache = sdk.services.stash.getUiStash();
  if (uiCache.has(`${PENDING_CACHE_KEY_PREFIX}-${key}`)) {
    return uiCache.get(`${PENDING_CACHE_KEY_PREFIX}-${key}`) as PendingItemsReponse;
  }
  rheaders.append('Content-Type', 'application/json');

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  const response = await fetch(`${BASE_DECISION_URL}/pending`, {
    signal: controller.signal,
    method: 'POST',
    headers: rheaders,
    body: JSON.stringify(data),
  });

  clearTimeout(timer);

  return response.json().then(serializedResponse => {
    uiCache.set(`${PENDING_CACHE_KEY_PREFIX}-${key}`, serializedResponse);

    return {
      ...serializedResponse,
      results: serializedResponse.results.map((item: IPendingItem) => {
        // formatting data to match labels already in use
        return {
          ...item,
          count: item.reports - 1, // minus reporter, to get count of other users
        };
      }),
    };
  });
};

/**
 * Gets moderated items
 * @returns serialized response
 * @example Getting moderated items
 * ```typescript
 * const response = await getModeratedItems({limit: 10, offset: 'optional-entry-id-to-start-from'}, 12000);
 * ```
 */
export const getModeratedItems = async (
  data: {
    delisted: boolean;
    limit?: number;
    offset?: string;
  },
  timeout = DEFAULT_FETCH_TIMEOUT,
): Promise<ModeratedItemsReponse> => {
  const rheaders = new Headers();

  const sdk = getSDK();
  const key = sdk.services.stash.computeKey({
    method: 'POST',
    url: `${BASE_DECISION_URL}/moderated`,
    data: data,
    statusOnly: false,
  });
  const uiCache = sdk.services.stash.getUiStash();
  if (uiCache.has(`${MODERATED_CACHE_KEY_PREFIX}-${key}`)) {
    return uiCache.get(`${MODERATED_CACHE_KEY_PREFIX}-${key}`) as ModeratedItemsReponse;
  }
  rheaders.append('Content-Type', 'application/json');

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  const response = await fetch(`${BASE_DECISION_URL}/moderated`, {
    signal: controller.signal,
    method: 'POST',
    headers: rheaders,
    body: JSON.stringify(data),
  });

  clearTimeout(timer);

  return response.json().then(serializedResponse => {
    uiCache.set(`${MODERATED_CACHE_KEY_PREFIX}-${key}`, serializedResponse);
    return {
      ...serializedResponse,
      results: serializedResponse.results.map((item: IModeratedItem) => {
        // formatting data to match labels already in use
        return {
          ...item,
          count: item.reports - 1,
        };
      }),
    };
  });
};
