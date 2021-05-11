import * as React from 'react';
import { IMetadata } from '@akashaproject/design-system/lib/components/Editor/index';

export interface IPendingEntry {
  localId: string;
  step: 'PUBLISH_START' | 'IPFS_ADDED';
  entry: {
    author: {
      ethAddress: string;
    };
    metadata: IMetadata;
    content: any;
    textContent: string;
    ipfsHash?: string;
    entryId?: string;
  };
}

export interface IEntryPublisherProps {
  ethAddress: string | null;
  publishEntry: (entry: IPendingEntry) => Promise<{ data: IPendingEntry }>;
  getPendingEntries: (ethAddress: string) => Promise<IPendingEntry[]>;
  addToIPFS: (entry: IPendingEntry) => Promise<{ data: IPendingEntry }>;
  onPublishComplete: (ethAddress: string, entry: IPendingEntry) => void;
  onStep: (ethAddress: string, entry: IPendingEntry) => void;
}

export interface IPendingActions {
  addEntry: (entry: IPendingEntry) => void;
  removeEntry: (localId: string) => void;
}

const useEntryPublisher = (props: IEntryPublisherProps): [IPendingEntry[], IPendingActions] => {
  const {
    ethAddress,
    getPendingEntries,
    publishEntry,
    addToIPFS,
    onPublishComplete,
    onStep,
  } = props;
  const [pendingEntries, setPendingEntries] = React.useState<IPendingEntry[]>([]);

  const actions: IPendingActions = {
    addEntry: entry => {
      const currEntries = pendingEntries.slice();
      currEntries.unshift(entry);
      setPendingEntries(currEntries);
    },
    removeEntry: localId => {
      setPendingEntries(prev => prev.filter(v => v.localId !== localId));
    },
  };

  React.useEffect(() => {
    if (ethAddress) {
      getPendingEntries(ethAddress).then(entries => {
        setPendingEntries(entries);
      });
    }
  }, [ethAddress]);

  React.useEffect(() => {
    if (pendingEntries.length && ethAddress) {
      pendingEntries.forEach(async (entryObj, index) => {
        switch (entryObj.step) {
          case 'PUBLISH_START':
            try {
              const resp = await addToIPFS(entryObj);
              const pending = pendingEntries.slice();
              pending.splice(index, 1, { ...resp.data, step: 'IPFS_ADDED' });
              setPendingEntries(pending);
              onStep(ethAddress, entryObj);
              return;
            } catch (err) {
              throw err;
            }
          case 'IPFS_ADDED':
            try {
              const resp = await publishEntry(entryObj);
              onPublishComplete(ethAddress as string, resp.data);
              return;
            } catch (err) {
              throw err;
            }
          default:
            break;
        }
      });
    }
  }, [JSON.stringify(pendingEntries), ethAddress]);

  return [pendingEntries, actions];
};

export default useEntryPublisher;
