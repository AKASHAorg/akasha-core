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
const profileComposite = await createComposite(ceramic, path.resolve(__dirname, '../models/profile.graphql'))

// Replace by the path to the encoded composite file
await writeEncodedComposite(profileComposite, path.resolve(__dirname, '../build/profile-composite.json'))


const integrationComposite = await createComposite(ceramic, path.resolve(__dirname, '../models/integration.graphql'))

await writeEncodedComposite(integrationComposite, path.resolve(__dirname, '../build/integration-composite.json'))

const followComposite = await createComposite(ceramic, path.resolve(__dirname, '../models/follow.graphql'))

await writeEncodedComposite(followComposite, path.resolve(__dirname, '../build/follow-composite.json'))

const interestsComposite = await createComposite(ceramic, path.resolve(__dirname, '../models/interests.graphql'))

await writeEncodedComposite(interestsComposite, path.resolve(__dirname, '../build/interests-composite.json'))

const postsComposite = await createComposite(ceramic, path.resolve(__dirname, '../models/posts.graphql'))

await writeEncodedComposite(postsComposite, path.resolve(__dirname, '../build/posts-composite.json'))
