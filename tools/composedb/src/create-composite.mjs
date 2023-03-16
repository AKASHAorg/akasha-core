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
// const integrationComposite = await createComposite(ceramic, path.resolve(__dirname, '../models/base/0_integration.graphql'))
//
// await writeEncodedComposite(integrationComposite, path.resolve(__dirname, '../build/0_integration.json'))


// const _1_follow = await createComposite(ceramic, path.resolve(__dirname, '../models/1_follow.graphql'))
//
// await writeEncodedComposite(_1_follow, path.resolve(__dirname, '../build/1_follow.json'))
//
// const _1_integration = await createComposite(ceramic, path.resolve(__dirname, '../models/1_integration.graphql'))
//
// await writeEncodedComposite(_1_integration, path.resolve(__dirname, '../build/1_integration.json'))
//
// const _1_posts = await createComposite(ceramic, path.resolve(__dirname, '../models/1_posts.graphql'))
//
// await writeEncodedComposite(_1_posts, path.resolve(__dirname, '../build/1_posts.json'))

// const _2_models = await createComposite(ceramic, path.resolve(__dirname, '../models/2_models.graphql'))
//
// await writeEncodedComposite(_2_models, path.resolve(__dirname, '../build/2_models.json'))
//
// const _2_integration = await createComposite(ceramic, path.resolve(__dirname, '../models/2_integration.graphql'))
//
// await writeEncodedComposite(_2_integration, path.resolve(__dirname, '../build/2_integration.json'))
//
// const _2_posts = await createComposite(ceramic, path.resolve(__dirname, '../models/2_posts.graphql'))
//
// await writeEncodedComposite(_2_posts, path.resolve(__dirname, '../build/2_posts.json'))

// const _3_posts = await createComposite(ceramic, path.resolve(__dirname, '../models/3_posts.graphql'))
//
// await writeEncodedComposite(_3_posts, path.resolve(__dirname, '../build/3_posts.json'))

// const _4_posts = await createComposite(ceramic, path.resolve(__dirname, '../models/4_posts.graphql'))
//
// await writeEncodedComposite(_4_posts, path.resolve(__dirname, '../build/4_posts.json'))

// const _5_posts = await createComposite(ceramic, path.resolve(__dirname, '../models/5_posts.graphql'))
//
// await writeEncodedComposite(_5_posts, path.resolve(__dirname, '../build/5_posts.json'))
