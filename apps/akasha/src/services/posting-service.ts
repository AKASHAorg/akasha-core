import { IPendingEntry } from '../hooks/use-entry-publisher';
import { delay, genEthAddress } from './dummy-data';

export const savePending = (ethAddress: string, entries: any[]): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      localStorage.setItem(`${ethAddress}_pending_publish`, JSON.stringify(entries));
      resolve();
    } catch (err) {
      reject(err);
    }
  });
};

export const removePending = async (ethAddess: string, localId: string) => {
  try {
    const items = await getPending(ethAddess);
    const filtered = items.filter(it => it.localId !== localId);
    return savePending(ethAddess, filtered);
  } catch (err) {
    throw err;
  }
};

export const updatePending = async (ethAddress: string, entry: IPendingEntry) => {
  try {
    const items = await getPending(ethAddress);
    items.splice(
      items.findIndex(it => it.localId === entry.localId),
      1,
      entry,
    );
    return savePending(ethAddress, items);
  } catch (err) {
    throw err;
  }
};

export const getPending = (ethAddress: string): Promise<IPendingEntry[]> => {
  return new Promise((resolve, _reject) => {
    try {
      const resp = localStorage.getItem(`${ethAddress}_pending_publish`);
      if (resp) {
        return resolve(JSON.parse(resp));
      }
      return resolve([]);
    } catch (err) {
      throw err;
    }
  });
};

export const addToIPFS = (entryObj: IPendingEntry): Promise<{ data: IPendingEntry }> => {
  const { localId, entry } = entryObj;
  return new Promise((resolve, _reject) => {
    resolve({
      data: {
        localId,
        step: entryObj.step,
        entry: {
          ...entry,
          ipfsHash: 'QmSOMEIPFSHASH',
        },
      },
    });
  });
};

export const publishEntry = (pendingEntry: IPendingEntry) => {
  const ethAddress = genEthAddress()(true);
  return delay(2000).then(() => {
    return {
      data: {
        localId: pendingEntry.localId,
        entry: { ...pendingEntry.entry, entryId: ethAddress },
        step: pendingEntry.step,
      },
    };
  });
};

export const serializeToSlate = (
  entryData: { excerpt: string; featuredImage: any; post: any },
  ipfsGateway: string,
) => {
  const serializedContent = [];

  if (entryData.excerpt) {
    serializedContent.push({
      type: 'paragraph',
      children: [{ text: JSON.parse(entryData.excerpt) }],
    });
  }
  if (entryData.featuredImage && JSON.parse(entryData.featuredImage).xs?.src) {
    serializedContent.push({
      type: 'image',
      url: `${ipfsGateway}/${JSON.parse(entryData.featuredImage).xs?.src}`,
      children: [{ text: '' }],
    });
  }
  if (entryData.post && JSON.parse(entryData.post).tags?.length > 0) {
    JSON.parse(entryData.post).tags.forEach((tag: string, idx: number) => {
      if (idx > 0) {
        serializedContent.push({ text: ' ' });
      }
      serializedContent.push({
        type: 'tag',
        value: tag,
        children: [{ text: '' }],
      });
    });
  }

  return serializedContent;
};
