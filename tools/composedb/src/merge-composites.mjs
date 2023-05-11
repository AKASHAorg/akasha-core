import { CeramicClient } from "@ceramicnetwork/http-client";
import { Composite } from "@composedb/devtools";
import { readEncodedComposite, writeEncodedComposite } from "@composedb/devtools-node";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);
dotenv.config({
  path: path.resolve(__dirname, "../../../.env"),
  debug: true
});
const ceramic = new CeramicClient(process.env.CERAMIC_API_ENDPOINT);

const loadSources = [
  path.resolve(__dirname, "../build/0_application.json"),
  path.resolve(__dirname, "../build/0_models.json"),
  path.resolve(__dirname, "../build/1_follow.json"),
  path.resolve(__dirname, "../build/1_application.json"),
  path.resolve(__dirname, "../build/1_beams.json"),
  path.resolve(__dirname, "../build/2_application.json"),
  path.resolve(__dirname, "../build/2_models.json"),
  path.resolve(__dirname, "../build/2_beams.json"),
  path.resolve(__dirname, "../build/3_beams.json"),
  path.resolve(__dirname, "../build/4_beams.json"),
  path.resolve(__dirname, "../build/5_beams.json")
].map(
  async (path) => await readEncodedComposite(ceramic, path)
);
const sourceComposites = await Promise.all(loadSources);
const mergedComposite = Composite.from(sourceComposites, {
  aliases: {
    "kjzl6hvfrbw6c7i4k7vffsms9flppqephozynftoaqcttt0q33xr5wbelna4bsb": "Profile",
    "kjzl6hvfrbw6c9kiklnpmjxf4tnsq6fi99sos6syajchxuybeb8ksjwohbebyyf": "AkashaApp",
    "kjzl6hvfrbw6cb51sm3goew8wbnzev9io25zm0df7kwi0pyd931vdoqxs8sh10d": "AppRelease",
    "kjzl6hvfrbw6c92pp4e2s3wnwhfm8msk74lm0t8wmip4dt5ibsvzvfivgk13pg1": "Follow",
    "kjzl6hvfrbw6c6bw7gfhlo2viqypg3hjg9sdik12w5nq044qi8xxop5xh768wq1": "Reflect",
    "kjzl6hvfrbw6c5wydt6460x8x0nj4j64mwtotfgjm6e15gevvg4ju85z72uisxm": "Reflection",
    "kjzl6hvfrbw6c7i9vkzoaekc6lmxnto4k61wy90h3zxpp1gi2zes76zok8msnw7": "Rebeam",
    "kjzl6hvfrbw6c6vxe4j9isxld71svdjqsw0ngrz31hpxfg5w0m7c7u9vz8juo2n": "ProfileMention",
    "kjzl6hvfrbw6cafhm2pw8ced1h0rix5qh1s8xhfy79lhjvf39jo83h2koyrunp2": "Beam"
  }
});

await writeEncodedComposite(mergedComposite, path.resolve(__dirname, "../build/merged-composite.json"));


