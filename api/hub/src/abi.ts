export const ICRegistryAbi = [
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'integrationId',
        type: 'bytes32',
      },
    ],
    name: 'getPackageInfo',
    outputs: [
      {
        internalType: 'string',
        name: 'integrationName',
        type: 'string',
      },
      {
        internalType: 'address',
        name: 'author',
        type: 'address',
      },
      {
        internalType: 'bool',
        name: 'enabled',
        type: 'bool',
      },
      {
        internalType: 'bytes32',
        name: 'latestReleaseId',
        type: 'bytes32',
      },
      {
        internalType: 'enum AbstractIntegrationRegistry.IntegrationType',
        name: 'integrationType',
        type: 'uint8',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'releaseId',
        type: 'bytes32',
      },
    ],
    name: 'getReleaseData',
    outputs: [
      {
        internalType: 'string',
        name: 'integrationName',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'version',
        type: 'string',
      },
      {
        internalType: 'bytes32',
        name: 'manifestHash',
        type: 'bytes32',
      },
      {
        internalType: 'enum AbstractIntegrationRegistry.IntegrationType',
        name: 'integrationType',
        type: 'uint8',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
];
