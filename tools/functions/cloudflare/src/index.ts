import { CarReader } from '@ipld/car';
import * as DID from '@ipld/dag-ucan/did';
import { importDAG } from '@ucanto/core/delegation';
import * as Signer from '@ucanto/principal/ed25519';
import * as Client from '@web3-storage/w3up-client';
import { Hono } from 'hono';
import { Block } from 'multiformats';
import { fromString } from 'uint8arrays/from-string';
import { StoreMemory } from '@web3-storage/access/stores/store-memory';
import { ServiceAbility } from '@web3-storage/capabilities/types';

type Bindings = {
  PROOFS_BUCKET: R2Bucket;
  KEY: string;
  PROOF_FILE: string;
};

const app = new Hono<{ Bindings: Bindings }>();

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,HEAD,POST,OPTIONS',
  'Access-Control-Max-Age': '86400',
};

async function parseProof(data: R2ObjectBody) {
  const blocks = [];
  const buf = await data.arrayBuffer();
  const uint8_buf = new Uint8Array(buf);
  const reader = await CarReader.fromBytes(uint8_buf);
  for await (const block of reader.blocks() as AsyncIterable<Block>) {
    blocks.push(block);
  }
  return importDAG(blocks);
}

app.post('/create-proof/:did', async c => {
  const did = c.req.param('did');

  async function backend(did: string) {
    const secret = fromString(c.env.KEY, 'base16');
    const principal = await Signer.derive(secret);
    const client = await Client.create({ principal, store: new StoreMemory() });
    const proofFile = await c.env.PROOFS_BUCKET.get(c.env.PROOF_FILE);

    if (!proofFile) {
      console.error('Proof file not found');
      return;
    }

    // Add proof that this agent has been delegated capabilities on the space
    const proof = await parseProof(proofFile);
    const space = await client.addSpace(proof);
    await client.setCurrentSpace(space.did());

    // Create a delegation for a specific DID
    const audience = DID.parse(did);
    const abilities: ServiceAbility[] = [
      'space/blob/add',
      'space/index/add',
      'store/add',
      'upload/add',
    ];
    const expiration = Math.floor(Date.now() / 1000) + 60 * 60 * 24; // 24 hours from now
    const delegation = await client.createDelegation(audience, abilities, {
      expiration,
    });

    // Serialize the delegation and send it to the client
    const archive = await delegation.archive();
    return archive.ok;
  }

  const parsed = await backend(did);
  if (!parsed) {
    return c.text('UCAN proof could not be generated', { status: 401, headers: corsHeaders });
  }
  return c.stream(
    async stream => {
      await stream.write(parsed);
    },
    { headers: corsHeaders },
  );
});

export default app;
