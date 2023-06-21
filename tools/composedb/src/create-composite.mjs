import { CeramicClient } from '@ceramicnetwork/http-client'
import { DID } from 'dids'
import { Ed25519Provider } from 'key-did-provider-ed25519'
import { getResolver } from 'key-did-resolver'
import { fromString } from 'uint8arrays/from-string'

import { createComposite, writeEncodedComposite } from '@composedb/devtools-node'

import dotenv from 'dotenv'
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.resolve(__dirname, '../../../.env'),
  debug: true
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

// Replace by the path to the source schema file
// const profileComposite = await createComposite(ceramic, path.resolve(__dirname, '../models/base/0_models.graphql'))
//
// // Replace by the path to the encoded composite file
// await writeEncodedComposite(profileComposite, path.resolve(__dirname, '../build/0_models.json'))
//
//
// const applicationComposite = await createComposite(ceramic, path.resolve(__dirname, '../models/base/0_application.graphql'))
//
// await writeEncodedComposite(applicationComposite, path.resolve(__dirname, '../build/0_application.json'))


// const _1_follow = await createComposite(ceramic, path.resolve(__dirname, '../models/1_follow.graphql'))
//
// await writeEncodedComposite(_1_follow, path.resolve(__dirname, '../build/1_follow.json'))
//
// const _1_application = await createComposite(ceramic, path.resolve(__dirname, '../models/1_application.graphql'))
//
// await writeEncodedComposite(_1_application, path.resolve(__dirname, '../build/1_application.json'))
//
// const _1_beams = await createComposite(ceramic, path.resolve(__dirname, '../models/1_beams.graphql'))
//
// await writeEncodedComposite(_1_beams, path.resolve(__dirname, '../build/1_beams.json'))

// const _2_models = await createComposite(ceramic, path.resolve(__dirname, '../models/2_models.graphql'))
//
// await writeEncodedComposite(_2_models, path.resolve(__dirname, '../build/2_models.json'))
//
// const _2_application = await createComposite(ceramic, path.resolve(__dirname, '../models/2_application.graphql'))
//
// await writeEncodedComposite(_2_application, path.resolve(__dirname, '../build/2_application.json'))
//
// const _2_beams = await createComposite(ceramic, path.resolve(__dirname, '../models/2_beams.graphql'))
//
// await writeEncodedComposite(_2_beams, path.resolve(__dirname, '../build/2_beams.json'))

// const _3_beams = await createComposite(ceramic, path.resolve(__dirname, '../models/3_beams.graphql'))
//
// await writeEncodedComposite(_3_beams, path.resolve(__dirname, '../build/3_beams.json'))

// const _4_beams = await createComposite(ceramic, path.resolve(__dirname, '../models/4_beams.graphql'))
//
// await writeEncodedComposite(_4_beams, path.resolve(__dirname, '../build/4_beams.json'))

// const _5_beams = await createComposite(ceramic, path.resolve(__dirname, '../models/5_beams.graphql'))
//
// await writeEncodedComposite(_5_beams, path.resolve(__dirname, '../build/5_beams.json'))


// const _6_main_blocks = await createComposite(ceramic, path.resolve(__dirname, '../models/6_main_blocks.graphql'))
//
// await writeEncodedComposite(_6_main_blocks, path.resolve(__dirname, '../build/6_main_blocks.json'))




const _8_blocks = await createComposite(ceramic, path.resolve(__dirname, '../models/8_blocks.graphql'))

await writeEncodedComposite(_8_blocks, path.resolve(__dirname, '../build/8_blocks.json'))
