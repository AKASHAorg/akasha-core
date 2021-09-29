import getSDK from '@akashaproject/awf-sdk';

import constants from './constants';

const {
  BASE_REPORT_URL,
  BASE_STATUS_URL,
  BASE_DECISION_URL,
  BASE_MODERATOR_URL,
  BASE_REASONS_URL,
  DEFAULT_FETCH_TIMEOUT,
} = constants;

export const createModeration = async (
  url: string,
  data: {
    contentId: string;
    contentType: string;
    data: { [key: string]: string };
    signature: string;
  },
  timeout = DEFAULT_FETCH_TIMEOUT,
) => {
  const rheaders = new Headers();

  const sdk = getSDK();

  const key = sdk.services.stash.computeKey({
    method: 'POST',
    url,
    data: data,
    statusOnly: true,
  });
  const uiCache = sdk.services.stash.getUiStash();
  if (uiCache.has(key)) {
    return uiCache.get(key) as number;
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

  uiCache.set(key, response.status);

  return response.status;
};

export const getEntryModerationStatus = async (
  data: {
    user: string;
    contentIds: string[];
  },
  timeout = DEFAULT_FETCH_TIMEOUT,
) => {
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
    return uiCache.get(key) as number;
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

export const getModerationReasons = async (
  data: Record<string, unknown>,
  timeout = DEFAULT_FETCH_TIMEOUT,
) => {
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
    return uiCache.get(key) as number;
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

export const getModeratorStatus = async (loggedUser: string, timeout = DEFAULT_FETCH_TIMEOUT) => {
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

export const getModerationCounters = async (timeout = DEFAULT_FETCH_TIMEOUT) => {
  const rheaders = new Headers();
  const sdk = getSDK();
  const key = sdk.services.stash.computeKey({
    method: 'GET',
    url: `${BASE_STATUS_URL}/counters`,
    data: {},
    statusOnly: false,
  });
  const uiCache = sdk.services.stash.getUiStash();
  if (uiCache.has(key)) {
    return uiCache.get(key) as number;
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
    uiCache.set(key, serializedResponse);
    return serializedResponse;
  });
};

export const getEntryReports = async (entryId: string, timeout = DEFAULT_FETCH_TIMEOUT) => {
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
    return uiCache.get(key) as number;
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

export const getLogItems = async (
  data: {
    limit?: number;
    offset?: string;
  },
  timeout = DEFAULT_FETCH_TIMEOUT,
) => {
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
    return uiCache.get(key) as number;
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

export const getPendingItems = async (
  data: {
    limit?: number;
    offset?: string;
  },
  timeout = DEFAULT_FETCH_TIMEOUT,
) => {
  const rheaders = new Headers();

  const sdk = getSDK();
  const ipfsGateway = sdk.services.common.ipfs.getSettings().gateway;
  const key = sdk.services.stash.computeKey({
    method: 'POST',
    url: `${BASE_DECISION_URL}/pending`,
    data,
    statusOnly: false,
  });

  const uiCache = sdk.services.stash.getUiStash();
  if (uiCache.has(key)) {
    return uiCache.get(key) as number;
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
    uiCache.set(key, serializedResponse);
    return {
      ...serializedResponse,
      results: serializedResponse.results.map((item, idx: number) => {
        // formatting data to match labels already in use
        return {
          id: idx,
          type: item.contentType,
          entryId: item.contentID,
          reasons: item.reasons,
          reporter: item.reportedBy,
          reporterProfile: {
            ...item.reportedByProfile,
            avatar:
              item.reportedByProfile.avatar.length > 0
                ? `${ipfsGateway}/${item.reportedByProfile.avatar}`
                : null,
          },
          count: item.reports - 1, // minus reporter, to get count of other users
          entryDate: item.reportedDate,
        };
      }),
    };
  });
};

export const getModeratedItems = async (
  data: {
    delisted: boolean;
    limit?: number;
    offset?: string;
  },
  timeout = DEFAULT_FETCH_TIMEOUT,
) => {
  const rheaders = new Headers();

  const sdk = getSDK();
  const ipfsGateway = sdk.services.common.ipfs.getSettings().gateway;
  const key = sdk.services.stash.computeKey({
    method: 'POST',
    url: `${BASE_DECISION_URL}/moderated`,
    data: data,
    statusOnly: false,
  });
  const uiCache = sdk.services.stash.getUiStash();
  if (uiCache.has(key)) {
    return uiCache.get(key) as number;
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
    uiCache.set(key, serializedResponse);
    return {
      ...serializedResponse,
      results: serializedResponse.results.map((item, idx: number) => {
        // formatting data to match labels already in use
        return {
          id: idx,
          type: item.contentType,
          entryId: item.contentID,
          reasons: item.reasons,
          description: item.explanation,
          reporter: item.reportedBy,
          reporterProfile: {
            ...item.reportedByProfile,
            avatar:
              item.reportedByProfile.avatar.length > 0
                ? `${ipfsGateway}/${item.reportedByProfile.avatar}`
                : null,
          },
          count: item.reports - 1,
          moderator: item.moderator,
          moderatorProfile: {
            ...item.moderatorProfile,
            avatar:
              item.moderatorProfile.avatar.length > 0
                ? `${ipfsGateway}/${item.moderatorProfile.avatar}`
                : null,
          },
          entryDate: item.reportedDate,
          evaluationDate: item.moderatedDate,
          delisted: item.delisted,
        };
      }),
    };
  });
};
