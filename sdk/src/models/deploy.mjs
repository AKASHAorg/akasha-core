import { ModelManager } from '@glazed/devtools';

import { CeramicClient } from '@ceramicnetwork/http-client';
import { DID } from 'dids';
import { getResolver } from 'key-did-resolver';
import { fromString } from 'uint8arrays/from-string';
import { Ed25519Provider } from 'key-did-provider-ed25519';

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { createRequire } from "module";
const require = createRequire(import.meta.url);

const postSchema = require('./schema/post.json');
const basicProfileSchema = require('./schema/profile.json');
const cryptoAccountsSchema = require('./schema/crypto-accounts.json');
const webAccountsModelSchema = require('./schema/web-links.json');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ceramic = new CeramicClient('http://localhost:7007');

const privateKey = fromString(process.env.DID_KEY, 'hex')

const did = new DID({
  resolver: getResolver(),
  provider: new Ed25519Provider(privateKey),
})
await did.authenticate()

// An authenticated DID with admin access must be set on the Ceramic instance
ceramic.did = did


const manager = new ModelManager({ ceramic });

const postSchemaId = await manager.createSchema(postSchema.title, postSchema);
await manager.createDefinition('post', {
  schema: manager.getSchemaURL(postSchemaId),
  name: 'Post',
  description: 'Post schema used by AKASHA framework',
});

const profileSchemaId = await manager.createSchema(basicProfileSchema.title, basicProfileSchema);
await manager.createDefinition('basicProfile', {
  schema: manager.getSchemaURL(profileSchemaId),
  name: 'Basic Profile',
  description: 'Basic Profile schema used by AKASHA framework',
});

const cryptoAccountsSchemaID = await manager.createSchema(cryptoAccountsSchema.title, cryptoAccountsSchema);
await manager.createDefinition('cryptoAccounts', {
  schema: manager.getSchemaURL(cryptoAccountsSchemaID),
  name: 'Crypto Accounts',
  description: 'Crypto Accounts schema used by AKASHA framework',
});

const webAccountsModelSchemaID = await manager.createSchema(webAccountsModelSchema.title, webAccountsModelSchema);
await manager.createDefinition('alsoKnownAs', {
  schema: manager.getSchemaURL(webAccountsModelSchemaID),
  name: webAccountsModelSchema.title,
  description: 'AlsoKnownAs schema used by AKASHA framework',
});

const modelAliases = await manager.deploy();
console.log(modelAliases);
const model = manager.toJSON();

fs.writeFileSync(path.resolve(__dirname, "./schema.dev.json"), JSON.stringify(model, null, 2));
fs.writeFileSync(path.resolve(__dirname, "./model.dev.json"), JSON.stringify(modelAliases, null, 2))
