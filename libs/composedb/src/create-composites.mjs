import { readdirSync, writeFileSync } from 'fs';
import { CeramicClient } from '@ceramicnetwork/http-client'
import path, { extname } from 'path'
import ora from 'ora';
import {
  createComposite,
  readEncodedComposite,
  writeEncodedComposite,
  writeEncodedCompositeRuntime,
  mergeEncodedComposites,
  writeGraphQLSchema
} from '@composedb/devtools-node';

import { DID } from 'dids';
import { Ed25519Provider } from 'key-did-provider-ed25519';
import { getResolver } from 'key-did-resolver';
import { fromString } from 'uint8arrays/from-string';
import appLinks from '../composites/akasha-app-links.mjs';
import appRelease from '../composites/akasha-app-release.mjs';
import akashaBeam from '../composites/akasha-beam.mjs';
import akashaContentBlock from '../composites/akasha-content-block.mjs';
import akashaFollow from '../composites/akasha-follow.mjs';
import akashaProfileLinks from '../composites/akasha-profile-links.mjs';
import akashaReflect from '../composites/akasha-reflect.mjs';
import akashaBeamLinks from '../composites/akasha-beam-links.mjs';
import akashaStreams from '../composites/akasha-streams.mjs';


import dotenv from 'dotenv'
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.resolve(__dirname, '../../../.env')
})

// Hexadecimal-encoded private key for a DID having admin access to the target Ceramic node
const privateKey = fromString(process.env.DID_ADMIN_PRIVATE_KEY, "base16")

const did = new DID({
  resolver: getResolver(),
  provider: new Ed25519Provider(privateKey),
})
await did.authenticate()

const ceramic = new CeramicClient(process.env.CERAMIC_API_ENDPOINT)
// An authenticated DID with admin access must be set on the Ceramic instance
ceramic.did = did
const spinner = ora();

export const fillModels = async () => {
  const akashaProfile = await createComposite(ceramic, './composites/akasha-profile.graphql');
  await writeEncodedComposite(akashaProfile, './src/__generated__/akasha-profile.json');
  const { AkashaProfile, AkashaProfileInterface } = akashaProfile.toRuntime().models

  spinner.info(`AkashaProfileInterface: ${AkashaProfileInterface.id}`);
  spinner.info(`AkashaProfile: ${AkashaProfile.id}`);

  const akashaApp = await createComposite(ceramic, './composites/akasha-app.graphql');
  await writeEncodedComposite(akashaApp, './src/__generated__/akasha-app.json');
  const { AkashaApp, AkashaAppInterface  } = akashaApp.toRuntime().models;
  spinner.info(`AkashaAppInterface: ${AkashaAppInterface.id}`);
  spinner.info(`AkashaApp: ${AkashaApp.id}`);

  const akashaAppR = appRelease(AkashaAppInterface.id);
  const akashaAppRPath = path.resolve(__dirname, '../composites/akasha-app-release.graphql');
  writeFileSync(akashaAppRPath, akashaAppR);
  const akashaAppRComposite = await createComposite(ceramic, akashaAppRPath);
  const { AkashaAppRelease, AkashaAppReleaseInterface } = akashaAppRComposite.toRuntime().models;
  spinner.info(`AkashaAppReleaseInterface: ${AkashaAppReleaseInterface.id}`);
  spinner.info(`AkashaAppRelease: ${AkashaAppRelease.id}`);

  const akashaAppLinks = appLinks(AkashaAppReleaseInterface.id, AkashaApp.id);
  const akashaAppLinksPath = path.resolve(__dirname, '../composites/akasha-app-links.graphql');
  writeFileSync(akashaAppLinksPath, akashaAppLinks);
  await createComposite(ceramic, akashaAppLinksPath);
  spinner.info(`AkashaAppLinks done`);

  const akashaF = akashaFollow(AkashaProfileInterface.id);
  const akashaFPath = path.resolve(__dirname, '../composites/akasha-follow.graphql');
  writeFileSync(akashaFPath, akashaF);
  const akashaFollowComposite = await createComposite(ceramic, akashaFPath);
  const { AkashaFollow, AkashaFollowInterface } = akashaFollowComposite.toRuntime().models;
  spinner.info(`AkashaFollowInterface: ${AkashaFollowInterface.id}`);
  spinner.info(`AkashaFollow: ${AkashaFollow.id}`);

  const akashaFLinks = akashaProfileLinks(AkashaFollowInterface.id, AkashaProfile.id);
  const akashaFLinksPath = path.resolve(__dirname, '../composites/akasha-profile-links.graphql');
  writeFileSync(akashaFLinksPath, akashaFLinks);
  await createComposite(ceramic, akashaFLinksPath);
  spinner.info(`AkashaFollowLinks done`);


  const contentBl = akashaContentBlock(AkashaAppReleaseInterface.id);
  const contentBlPath = path.resolve(__dirname, '../composites/akasha-content-block.graphql');
  writeFileSync(contentBlPath, contentBl);
  const akashaContentBlockComposite = await createComposite(ceramic, contentBlPath);
  const {
    AkashaContentBlock,
    AkashaContentBlockInterface,
    AkashaBlockStorage  } = akashaContentBlockComposite.toRuntime().models;
  spinner.info(`AkashaContentBlockInterface: ${AkashaContentBlockInterface.id}`);
  spinner.info(`AkashaBlockStorage: ${AkashaBlockStorage.id}`);
  spinner.info(`AkashaContentBlock: ${AkashaContentBlock.id}`);

  const beamC = akashaBeam(AkashaContentBlockInterface.id);
  const beamCPath = path.resolve(__dirname, '../composites/akasha-beam.graphql');
  writeFileSync(beamCPath, beamC);
  const akashaBeamComposite = await createComposite(ceramic, beamCPath);
  const { AkashaBeam, AkashaBeamInterface } = akashaBeamComposite.toRuntime().models;
  spinner.info(`AkashaBeamInterface: ${AkashaBeamInterface.id}`);
  spinner.info(`AkashaBeam: ${AkashaBeam.id}`);


  const reflectC = akashaReflect(AkashaBeamInterface.id);
  const reflectCPath = path.resolve(__dirname, '../composites/akasha-reflect.graphql');
  writeFileSync(reflectCPath, reflectC);
  const akashaReflectComposite = await createComposite(ceramic, reflectCPath);
  const { AkashaReflect, AkashaReflectInterface } = akashaReflectComposite.toRuntime().models;
  spinner.info(`AkashaReflectInterface: ${AkashaReflectInterface.id}`);
  spinner.info(`AkashaReflect: ${AkashaReflect.id}`);


  const beamLinksC = akashaBeamLinks(AkashaBeam.id, AkashaReflectInterface.id);
  const beamLinksCPath = path.resolve(__dirname, '../composites/akasha-beam-links.graphql');
  writeFileSync(beamLinksCPath, beamLinksC);
  await createComposite(ceramic, beamLinksCPath);
  spinner.info(`AkashaBeamLinks done`);


  const streamsC = akashaStreams(AkashaBeamInterface.id, AkashaProfileInterface.id, AkashaContentBlockInterface.id, AkashaReflectInterface.id, AkashaAppInterface.id);
  const streamsCPath = path.resolve(__dirname, '../composites/akasha-streams.graphql');
  writeFileSync(streamsCPath, streamsC);
  await createComposite(ceramic, streamsCPath);
  spinner.info(`AkashaStreams done`);

}

/**
 * @return {Promise<void>} - return void when composite finishes deploying.
 */
export const writeComposites = async () => {
  spinner.info('writing composite to Ceramic')
  await fillModels(spinner);
  await encodeComposites(readdirSync(path.resolve(__dirname, '../composites')))
  await mergeComposites()

  spinner.succeed('composite deployed & ready for use');
}

const encodeComposites = async (files) => {
  let composite
  await Promise.all(files.map(async (file, _id) => {
    try {
      if (!file.endsWith(`graphql`)) {
        return Promise.resolve();
      }
      composite = await createComposite(ceramic, path.resolve(__dirname, `../composites/${ file }`))
      return await writeEncodedComposite(
        composite,
        path.resolve(__dirname, `../src/__generated__/${ file.split('.graphql')[0] }.json`)
      )
      // const deployedComposite = await readEncodedComposite(ceramic, `./src/__generated__/${file.split('.graphql')[0]}.json`)
      // deployedComposite.startIndexingOn(ceramic)
    } catch (err) {
      console.error(err)
    }
  }))
}

const mergeComposites = async () => {
  const files = readdirSync(path.resolve(__dirname, '../src/__generated__/')).filter(file => {
    return extname(file).toLowerCase() === '.json'
  })
  const fil = [
    path.resolve(__dirname, '../src/__generated__/akasha-app.json'),
    path.resolve(__dirname, '../src/__generated__/akasha-profile.json'),
  ]
  setTimeout(async () => {
    await mergeEncodedComposites(
      ceramic,
      files.map(file => (path.resolve(__dirname, `../src/__generated__/${ file }`))),
      path.resolve(__dirname, '../lib/runtime-definition.json')
    )
    await writeEncodedCompositeRuntime(
      ceramic,
      path.resolve(__dirname, '../lib/runtime-definition.json'),
      path.resolve(__dirname, '../src/runtime-definition.ts')
    )
    // await writeGraphQLSchema(
    //   path.resolve(__dirname, '../lib/runtime-definition.json'),
    //   path.resolve(__dirname, '../lib/schemas.graphql')
    //   )
    const deployedComposite = await readEncodedComposite(ceramic, path.resolve(__dirname, '../lib/runtime-definition.json'))
    await deployedComposite.startIndexingOn(ceramic)
  }, 3000)
}

await writeComposites();
