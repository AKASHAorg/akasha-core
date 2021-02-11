const DEFAULT_CIRCUIT_RELAYS = [
  '/p2p-circuit/ipfs/QmSgTsiHrubEkLKEvdEjNtWHRasU1dUSgPfMjJpkR8KkBU',
  '/p2p-circuit/ipfs/QmUjM53zcSRhsA8BCK28DchCdSJCNmEU6W6jPJHiSgxwTW',
  '/p2p-circuit/ipfs/QmTfTyKZXjzRo2C8NV6p21HCsxZF54Mm5cZ9GsfY3zpG3T',
  '/p2p-circuit/ipfs/QmTMSgsyw3zzVbcQnkoN5SRZk7WYUMorJ7EqkqVBLgn13i',
  '/p2p-circuit/ipfs/QmYfXRuVWMWFRJxUSFPHtScTNR9CU2samRsTK15VFJPpvh',
];

const AKASHA_BOOTSTRAP_PEERS = [
  '/dns4/akasha.online/tcp/443/wss/ipfs/QmSgTsiHrubEkLKEvdEjNtWHRasU1dUSgPfMjJpkR8KkBU',
  '/dns4/akasha.observer/tcp/443/wss/ipfs/QmUjM53zcSRhsA8BCK28DchCdSJCNmEU6W6jPJHiSgxwTW',
];
const IPFS_BOOTSTRAP_PEERS = [
  '/dns4/ams-1.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLer265NRgSp2LA3dPaeykiS1J6DifTC88f5uVQKNAd',
  '/dns4/lon-1.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLMeWqB7YGVLJN3pNLQpmmEk35v6wYtsMGLzSr5QBU3',
  '/dns4/sfo-3.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLPppuBtQSGwKDZT2M73ULpjvfd3aZ6ha4oFGL1KrGM',
  '/dns4/sgp-1.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLSafTMBsPKadTEgaXctDQVcqN88CNLHXMkTNwMKPnu',
  '/dns4/nyc-1.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLueR4xBeUbY9WZ9xGUUxunbKWcrNFTDAadQJmocnWm',
  '/dns4/nyc-2.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLV4Bbm51jM9C4gDYZQ9Cy3U6aXMJDAbzgu2fzaDs64',
  '/dns4/node0.preload.ipfs.io/tcp/443/wss/ipfs/QmZMxNdpMkewiVZLMRxaNxUeZpDUb34pWjZ1kZvsd16Zic',
  '/dns4/node1.preload.ipfs.io/tcp/443/wss/ipfs/Qmbut9Ywz9YEDrz8ySBSgWyJk41Uvm2QJPhwDJzJyGFsD6',
];

const DEFAULT_IPFS_CONFIG = {
  Bootstrap: IPFS_BOOTSTRAP_PEERS.concat(AKASHA_BOOTSTRAP_PEERS).concat(DEFAULT_CIRCUIT_RELAYS),
};
export const ipfsGateway = 'https://gateway.pinata.cloud/ipfs';
export default DEFAULT_IPFS_CONFIG;
