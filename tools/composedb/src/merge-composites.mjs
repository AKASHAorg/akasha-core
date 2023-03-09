import {CeramicClient} from '@ceramicnetwork/http-client'
import {Composite} from '@composedb/devtools'
import {readEncodedComposite, writeEncodedComposite} from '@composedb/devtools-node'
import path from "path";
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const ceramic = new CeramicClient(process.env.CERAMIC_API_ENDPOINT)

const loadSources = [
  path.resolve(__dirname, '../build/profile-composite.json'),
  path.resolve(__dirname, '../build/integration-composite.json'),
  path.resolve(__dirname, '../build/follow-composite.json'),
  path.resolve(__dirname, '../build/interests-composite.json'),
  path.resolve(__dirname, '../build/posts-composite.json')
].map(
  async (path) => await readEncodedComposite(ceramic, path)
)
const sourceComposites = await Promise.all(loadSources)
const mergedComposite = Composite.from(sourceComposites)

await writeEncodedComposite(mergedComposite, path.resolve(__dirname, '../build/merged-composite.json'))


