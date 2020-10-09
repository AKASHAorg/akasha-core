import * as React from 'react';

export interface IPendingEntry {
  ethAddress: string;
  localId: string;
  step: 'PUBLISH_START' | 'IPFS_ADDED';
  entry: {
    author: {
      ethAddress: string;
    };
    content: any;
    ipfsHash?: string;
  };
}

export interface IEntryPublisherProps {
  ethAddress: string;
  publishEntry: (entry: IPendingEntry) => Promise<{ data: IPendingEntry }>;
  getPendingEntries: (ethAddress: string) => Promise<IPendingEntry[]>;
  addToIPFS: (entry: IPendingEntry) => Promise<{ data: IPendingEntry }>;
  onPublishComplete: (localId: string) => void;
}

export interface IPendingActions {
  addEntry: (entry: IPendingEntry) => void;
}

const useEntryPublisher = (props: IEntryPublisherProps): [IPendingEntry[], IPendingActions] => {
  const { ethAddress, getPendingEntries, publishEntry, addToIPFS, onPublishComplete } = props;
  const [pendingEntries, setPendingEntries] = React.useState<IPendingEntry[]>([]);

  const actions: IPendingActions = {
    addEntry: entry => {
      const currEntries = pendingEntries.slice();
      currEntries.unshift(entry);
      setPendingEntries(currEntries);
    },
  };

  React.useEffect(() => {
    getPendingEntries(ethAddress).then(entries => {
      setPendingEntries(entries);
    });
  }, [ethAddress]);

  React.useEffect(() => {
    if (pendingEntries.length) {
      pendingEntries.forEach(async (entryObj, index) => {
        switch (entryObj.step) {
          case 'PUBLISH_START':
            try {
              const resp = await addToIPFS(entryObj);
              const pending = pendingEntries.slice();
              pending.splice(index, 1, { ...resp.data, step: 'IPFS_ADDED' });
              return setPendingEntries(pending);
            } catch (err) {
              throw err;
            }
          case 'IPFS_ADDED':
            try {
              const resp = await publishEntry(entryObj);
              onPublishComplete(resp.data.localId);
              return setPendingEntries(prev => prev.filter((_v, i) => i !== index));
            } catch (err) {
              throw err;
            }
          default:
            break;
        }
      });
    }
  }, [JSON.stringify(pendingEntries)]);

  return [pendingEntries, actions];
};

export default useEntryPublisher;
