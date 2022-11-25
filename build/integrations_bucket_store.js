/* eslint-disable */
const dotenv = require("dotenv");
const buckr = require("@textile/buckr");
const fs = require("fs");
const ethers = require("ethers");
const path = require("path");
const ipfs = require("ipfs-http-client");
const format = require("multiformats/bases/base16");
const formatb36 = require("multiformats/bases/base36");
const cid = require("multiformats/cid");
const stream = require("stream");
const { Web3Storage, getFilesFromPath } = require("web3.storage");

(async () => {
  dotenv.config({
    override: true,
    path: path.resolve(__dirname, "..", ".env")
  });
  const ipfsClient = ipfs.create({
    host: "ipfs.infura.io",
    port: 5001,
    protocol: "https",
    headers: {
      authorization:
        "Basic " + Buffer.from(process.env.INFURA_IPFS_ID + ":" + process.env.INFURA_IPFS_SECRET).toString("base64")
    }
  });
  const web3Storage = new Web3Storage({ token: process.env.WEB3_STORAGE_KEY });
  const TYPE_APP = 0;
  const TYPE_PLUGIN = 1;
  const TYPE_WIDGET = 2;
  const DESCRIPTION_MD_FILE = "DESCRIPTION.md";

  function* generateSources () {
    yield {
      package: { name: "locales" },
      type: "",
      path: path.resolve(__dirname, "..", "locales")
    };
    // apps
    yield {
      package: require("../ui/apps/akasha/package.json"),
      type: TYPE_APP,
      path: path.resolve(__dirname, "../ui/build/apps", "akasha")
    };
    yield {
      package: require("../ui/apps/auth-app/package.json"),
      type: TYPE_APP,
      path: path.resolve(__dirname, "../ui/build/apps", "auth-app")
    };
    yield {
      package: require("../ui/apps/moderation/package.json"),
      type: TYPE_APP,
      path: path.resolve(__dirname, "../ui/build/apps", "moderation")
    };
    yield {
      package: require("../ui/apps/app-center/package.json"),
      type: TYPE_APP,
      path: path.resolve(__dirname, "../ui/build/apps", "app-center")
    };
    yield {
      package: require("../ui/apps/bookmarks/package.json"),
      type: TYPE_APP,
      path: path.resolve(__dirname, "../ui/build/apps", "bookmarks")
    };
    yield {
      package: require("../ui/apps/legal/package.json"),
      type: TYPE_APP,
      path: path.resolve(__dirname, "../ui/build/apps", "legal")
    };
    yield {
      package: require("../ui/apps/notifications/package.json"),
      type: TYPE_APP,
      path: path.resolve(__dirname, "../ui/build/apps", "notifications")
    };
    yield {
      package: require("../ui/apps/profile/package.json"),
      type: TYPE_APP,
      path: path.resolve(__dirname, "../ui/build/apps", "profile")
    };
    yield {
      package: require("../ui/apps/search/package.json"),
      type: TYPE_APP,
      path: path.resolve(__dirname, "../ui/build/apps", "search")
    };
    yield {
      package: require("../ui/apps/settings-app/package.json"),
      type: TYPE_APP,
      path: path.resolve(__dirname, "../ui/build/apps", "settings-app")
    };
    yield {
      package: require("../ui/apps/translation/package.json"),
      type: TYPE_APP,
      path: path.resolve(__dirname, "../ui/build/apps", "translation")
    };
    yield {
      package: require("../ui/apps/routing/package.json"),
      type: TYPE_APP,
      path: path.resolve(__dirname, "../ui/build/apps", "routing")
    };
    yield {
      package: require("../ui/apps/messaging/package.json"),
      type: TYPE_APP,
      path: path.resolve(__dirname, "../ui/build/apps", "messaging")
    };
    yield {
      package: require("../ui/apps/articles/package.json"),
      type: TYPE_APP,
      path: path.resolve(__dirname, "../ui/build/apps", "articles")
    };
    yield {
      package: require("../ui/apps/dev-dashboard/package.json"),
      type: TYPE_APP,
      path: path.resolve(__dirname, "../ui/build/apps", "dev-dashboard")
    };
    // widgets
    yield {
      package: require("../ui/widgets/layout/package.json"),
      type: TYPE_WIDGET,
      path: path.resolve(__dirname, "../ui/build/widgets", "layout")
    };
    yield {
      package: require("../ui/widgets/sidebar/package.json"),
      type: TYPE_WIDGET,
      path: path.resolve(__dirname, "../ui/build/widgets", "sidebar")
    };
    yield {
      package: require("../ui/widgets/top-bar/package.json"),
      type: TYPE_WIDGET,
      path: path.resolve(__dirname, "../ui/build/widgets", "topbar")
    };
    yield {
      package: require("../ui/widgets/trending/package.json"),
      type: TYPE_WIDGET,
      path: path.resolve(__dirname, "../ui/build/widgets", "trending")
    };
    yield {
      package: require("../ui/widgets/analytics/package.json"),
      type: TYPE_WIDGET,
      path: path.resolve(__dirname, "../ui/build/widgets", "analytics")
    };
    yield {
      package: require("../ui/widgets/mini-profile/package.json"),
      type: TYPE_WIDGET,
      path: path.resolve(__dirname, "../ui/build/widgets", "mini-profile")
    };
    yield {
      package: require("../ui/widgets/my-apps/package.json"),
      type: TYPE_WIDGET,
      path: path.resolve(__dirname, "../ui/build/widgets", "my-apps")
    };
  }

  const sources = generateSources();
  const results = [];
  for (const source of sources) {
    console.time(`[textile.bucket]${ source.package.name }`);
    // const output = await buckr.execute(
    //   "",
    //   process.env.HUB_KEY,
    //   process.env.HUB_SECRET,
    //   process.env.HUB_THREAD,
    //   path.join(process.env.HUB_NAME, source.type.toString(), source.package.name),
    //   "false",
    //   "**/*",
    //   source.path,
    //   ""
    // );
    console.timeEnd(`[textile.bucket]${ source.package.name }`);
    console.time(`[web3.storage]${ source.package.name }`);
    const files = await getFilesFromPath(source.path);
    const web3StorageCID = await web3Storage.put(files, {
      wrapWithDirectory: false,
      name: source.package.name
    });
    console.timeEnd(`[web3.storage]${ source.package.name }`);
    const b36Web3StorageCID = cid.CID.parse(web3StorageCID).toString(formatb36.base36.encoder);
    console.info(`${ source.package.name } - web3.storage CID: ${ b36Web3StorageCID }`);
    const descriptionFile = path.join(source.path, DESCRIPTION_MD_FILE);
    let descriptionFileHash = "";
    if (fs.existsSync(descriptionFile)) {
      descriptionFileHash = await ipfsClient.add({
        path: DESCRIPTION_MD_FILE,
        content: fs.readFileSync(descriptionFile)
      }, {
        onlyHash: true,
        cidVersion: 1
      });
    }
    const manifestData = {
      path: "manifest.json",
      content: JSON.stringify({
        links: {
          publicRepository: source.package.homepage || "",
          documentation: "",
          detailedDescription: descriptionFileHash ? `ipfs://${ descriptionFileHash.cid.toString(formatb36.base36.encoder) }` : ""
        },
        sources: [
          `ipfs://${ b36Web3StorageCID }`
          //`ipfs://${ output.get("ipfs") }`
        ]
      }, null, 2)
    };
    console.time(`[infura.storage]${ source.package.name }`);
    const ipfsManifest = await ipfsClient.add(manifestData, {
      hashAlg: "sha3-224",
      cidVersion: 1,
      pin: true
    });
    console.timeEnd(`[infura.storage]${ source.package.name }`);
    const web3ManifestCID = await web3Storage.put(
      [
        {
          name: manifestData.path,
          stream: () => {
            return stream.Readable.from([manifestData.content]);
          }
        }], {
        name: '[manifest]'+source.package.name,
        wrapWithDirectory: false
      });
    console.info("deployed: ", source.package.name, ipfsManifest.cid.toString(), web3ManifestCID, "\n");
    results.push({
      name: source.package.name,
      id: ethers.utils.id(source.package.name),
      ipfsManifest: ipfsManifest.cid.toString(format.base16.encoder),
      type: source.type
    });
  }
  let outputFile;
  if (process.env.NODE_ENV === "production") {
    outputFile = "./integrations_bucket_prod.json";
  } else {
    outputFile = "./integrations_bucket.json";
  }
  fs.writeFileSync(path.resolve(__dirname, outputFile), JSON.stringify(results, null, 2));
})();
