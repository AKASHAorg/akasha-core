import { IPendingEntry } from '../hooks/use-entry-publisher';
import { delay } from './dummy-data';

export const savePending = (ethAddress: string, entries: any[]): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      localStorage.setItem(ethAddress, JSON.stringify(entries));
      resolve();
    } catch (err) {
      reject(err);
    }
  });
};

export const getPending = (ethAddress: string): Promise<IPendingEntry[]> => {
  return new Promise((resolve, _reject) => {
    try {
      const resp = localStorage.getItem(ethAddress);
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
  const { localId, entry, ethAddress } = entryObj;
  return new Promise((resolve, _reject) => {
    resolve({
      data: {
        localId,
        ethAddress,
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
  return delay(2000).then(() => {
    return {
      data: {
        ethAddress: pendingEntry.ethAddress,
        entryId: '0x0013414123124123',
        localId: pendingEntry.localId,
        entry: pendingEntry.entry,
        step: pendingEntry.step,
      },
    };
  });
};
