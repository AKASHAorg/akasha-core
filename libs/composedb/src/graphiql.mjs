import { serveEncodedDefinition } from "@composedb/devtools-node";
import { fromString } from 'uint8arrays/from-string';
import { DID } from 'dids';
import { getResolver } from 'key-did-resolver';
import { Ed25519Provider } from 'key-did-provider-ed25519';
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

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
/**
 * Runs GraphiQL server to view & query composites.
 */
const server = await serveEncodedDefinition({
  ceramicURL: process.env.PUBLIC_CERAMIC_API_ENDPOINT || "http://127.0.0.1:7007",
  graphiql: true,
  path: path.resolve(__dirname, '../lib/runtime-definition.json'),
  port: 5001,
  did: did
});

console.log(`Server started on http://localhost:${server.port}/graphql`);

process.on("SIGTERM", () => {
  server.close(() => {
    console.log("Server stopped");
  });
});
