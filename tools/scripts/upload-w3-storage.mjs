import * as Client from '@web3-storage/w3up-client';
import { StoreMemory } from '@web3-storage/w3up-client/stores/memory';
import { importDAG } from '@ucanto/core/delegation';
import { CarReader } from '@ipld/car';
import * as Signer from '@ucanto/principal/ed25519';
import { filesFromPaths } from 'files-from-path';
import semver from 'semver';
import { AkashaAppApplicationType, SortOrder } from '@akashaorg/typings/lib/sdk/graphql-types-new.js';
import getSDK from '@akashaorg/awf-sdk';
//import path from 'path';
import pkgMapping from './pkg.mapping.mjs';
import { fromString } from 'uint8arrays/from-string';
import { DID } from 'dids';
import { getResolver } from 'key-did-resolver';
import { Ed25519Provider } from 'key-did-provider-ed25519';

const defaultVersion = '0.0.1';

/**
 * Creates a new W3 Storage client with the provided DID key and delegate proof.
 * @returns {Promise<Client>} A new W3 Storage client instance.
 */
async function createClient () {
  if (!process.env.W3_STORAGE_DID_KEY) {
    throw new Error('W3_STORAGE_DID_KEY env var not set');
  }
  if (!process.env.W3_STORAGE_DELEGATE) {
    throw new Error('W3_STORAGE_DELEGATE env var not set');
  }
  const principal = Signer.parse(process.env.W3_STORAGE_DID_KEY);
  const store = new StoreMemory();
  const client = await Client.create({ principal, store });
  const proof = await parseProof(process.env.W3_STORAGE_DELEGATE);
  const space = await client.addSpace(proof);
  await client.setCurrentSpace(space.did());
  return client;
}

/**
 * Parses the provided data and returns a proof.
 *
 * @param data -  Base64 encoded CAR file data to parse.
 * @returns A proof.
 */
async function parseProof (data) {
  const blocks = [];
  const d = Buffer.from(data, 'base64');
  const reader = await CarReader.fromBytes(d);
  for await (const block of reader.blocks()) {
    blocks.push(block);
  }
  return importDAG(blocks);
}

async function authenticate () {
  if (!process.env.DID_PUBLISHER_PRIVATE_KEY) {
    throw new Error('DID_PUBLISHER_PRIVATE_KEY env var not set');
  }
  const privateKey = fromString(process.env.DID_PUBLISHER_PRIVATE_KEY, "base16")

  const did = new DID({
    resolver: getResolver(),
    provider: new Ed25519Provider(privateKey),
  });
  await did.authenticate();
  return did;
}

/**
 * Uploads extensions to the W3 storage service.
 *
 * This function retrieves a list of affected projects from the `AFFECTED_PROJECTS` environment variable,
 * and for each affected project, it checks if the project exists in the package mapping. If the project
 * is found, it checks if the project already exists in the registry. If not, it creates a new project
 * in the registry. Finally, it uploads the project files to the W3 storage service and creates a new
 * release for the project.
 */
async function uploadExtensions () {
  const client = await createClient();
  console.info(process.env.AFFECTED_EXTENSIONS);
  if (!process.env.AFFECTED_EXTENSIONS) {
    throw new Error('AFFECTED_PROJECTS env var not set');
  }
  const affected = JSON.parse(process.env.AFFECTED_EXTENSIONS);
  const sdk = getSDK();
  const did = await authenticate();
  sdk.services.ceramic.getComposeClient().setDID(did);
  if (affected.length && Array.isArray(affected)) {
    for (const pkgName of affected) {
      if (!pkgMapping[pkgName]) {
        console.warn(`Could not find ${ pkgName } in pkg.mapping.js`);
        continue;
      }
      let pkgID;
      const pkgInfo = await sdk.services.gql.client.GetAppsByPublisherDID({
        id: did.id.toString(),
        first: 1,
        filters: { where: { name: { equalTo: pkgName.toString() } } },
        sorting: { createdAt: SortOrder.Desc },
      }, { context: { source: sdk.services.gql.contextSources.composeDB }});
      pkgID = pkgInfo?.node?.akashaAppList?.edges
        ? pkgInfo?.node?.akashaAppList?.edges[0]?.node?.id
        : undefined;
      if (!pkgID) {
        console.info(`Could not find ${ pkgName } in the registry`);
        const {default: pkgInfo} = await import(`${ pkgMapping[pkgName] }/manifest.json`, {
          with: {
            type: 'json',
          },
        });
        const newPkg = await sdk.services.gql.client.CreateApp({
          i: {
            content: {
              name: pkgName,
              description: pkgInfo.description,
              license: pkgInfo.license,
              applicationType: AkashaAppApplicationType.App,
              createdAt: new Date().toISOString(),
              displayName: pkgInfo.displayName,
            },
          },
        }, { context: { source: sdk.services.gql.contextSources.composeDB }});
        pkgID = newPkg.setAkashaApp.document.id;
        console.info(`Created ${ pkgName } with ID ${ pkgID }`);
      }
      console.log(`Uploading ${ pkgName }`);
      const files = await filesFromPaths([pkgMapping[pkgName]]);
      const directoryCid = await client.uploadDirectory(files);

      console.log(`Uploaded ${ pkgName } ${ directoryCid }`);

      const appRelease = await sdk.services.gql.client.GetAppsReleasesByPublisherDID({
        id: did.id,
        filters: { where: { applicationID: { equalTo: pkgID } } },
        first: 1,
        sorting: { createdAt: SortOrder.Desc },
      }, { context: { source: sdk.services.gql.contextSources.composeDB }});

      const version = appRelease?.node?.akashaAppReleaseList?.edges[0]?.node?.version
        ? semver.inc(appRelease?.node?.akashaAppReleaseList?.edges[0]?.node?.version, 'patch')
        : defaultVersion;
      await sdk.services.gql.client.SetAppRelease({
        i: {
          content: {
            source: `ipfs://${ directoryCid }`,
            version: version,
            createdAt: new Date().toISOString(),
            applicationID: pkgID,
          },
        },
      }, { context: { source: sdk.services.gql.contextSources.composeDB }});
      console.log(`Release new version for ${ pkgName } ${ version }`);
    }
  }
}

uploadExtensions().then(() => {
  console.log('Done!');
});
