import {CeramicClient} from '@ceramicnetwork/http-client'
import {Composite} from '@composedb/devtools'
import {readEncodedComposite, writeEncodedComposite} from '@composedb/devtools-node'
import path from "path";
import {fileURLToPath} from 'url';
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);
dotenv.config({
  path: path.resolve(__dirname, '../../../.env'),
  debug: true
})
const ceramic = new CeramicClient(process.env.CERAMIC_API_ENDPOINT)

const loadSources = [
  path.resolve(__dirname, '../build/0_integration.json'),
  path.resolve(__dirname, '../build/0_models.json'),
  path.resolve(__dirname, '../build/1_follow.json'),
  path.resolve(__dirname, '../build/1_integration.json'),
  path.resolve(__dirname, '../build/1_posts.json'),
  path.resolve(__dirname, '../build/2_integration.json'),
  path.resolve(__dirname, '../build/2_models.json'),
  path.resolve(__dirname, '../build/2_posts.json'),
  path.resolve(__dirname, '../build/3_posts.json'),
  path.resolve(__dirname, '../build/4_posts.json'),
  path.resolve(__dirname, '../build/5_posts.json')
].map(
  async (path) => await readEncodedComposite(ceramic, path)
)
const sourceComposites = await Promise.all(loadSources)
const mergedComposite = Composite.from(sourceComposites)

await writeEncodedComposite(mergedComposite, path.resolve(__dirname, '../build/merged-composite.json'))


