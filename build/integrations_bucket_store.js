/* eslint-disable */
const dotenv = require('dotenv');
const buckr = require('@textile/buckr');
const fs = require('fs');
const ethers = require('ethers');
const path = require('path');
const ipfs = require('ipfs-http-client');
const format = require('multiformats/bases/base16');

(async () => {
  dotenv.config({
    override: true,
    path: path.resolve(__dirname, '..', '.env'),
  });
  const ipfsClient = ipfs.create({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    headers: {
      authorization:
        'Basic ' + Buffer.from(process.env.INFURA_IPFS_ID + ':' + process.env.INFURA_IPFS_SECRET).toString('base64'),
    },
  });
  const TYPE_APP = 0;
  const TYPE_PLUGIN = 1;
  const TYPE_WIDGET = 2;
  const sources = [
    {package: { name: 'locales'}, type: '', path: path.resolve(__dirname, '..', 'locales')},
    // apps
    {package: require('../ui/apps/akasha/package.json'), type: TYPE_APP, path: path.resolve(__dirname, '../ui/build/apps', 'akasha')},
    {package: require('../ui/apps/auth-app/package.json'), type: TYPE_APP, path: path.resolve(__dirname, '../ui/build/apps', 'auth-app')},
    {package: require('../ui/apps/moderation/package.json'), type: TYPE_APP, path: path.resolve(__dirname, '../ui/build/apps', 'moderation')},
    {package: require('../ui/apps/app-center/package.json'), type: TYPE_PLUGIN, path: path.resolve(__dirname, '../ui/build/apps', 'app-center')},
    {package: require('../ui/apps/bookmarks/package.json'), type: TYPE_PLUGIN, path: path.resolve(__dirname, '../ui/build/apps', 'bookmarks')},
    {package: require('../ui/apps/legal/package.json'), type: TYPE_PLUGIN, path: path.resolve(__dirname, '../ui/build/apps', 'legal')},
    {package: require('../ui/apps/notifications/package.json'), type: TYPE_PLUGIN, path: path.resolve(__dirname, '../ui/build/apps', 'notifications')},
    {package: require('../ui/apps/profile/package.json'), type: TYPE_PLUGIN, path: path.resolve(__dirname, '../ui/build/apps', 'profile')},
    {package: require('../ui/apps/search/package.json'), type: TYPE_PLUGIN, path: path.resolve(__dirname, '../ui/build/apps', 'search')},
    // widgets
    {package: require('../ui/widgets/layout/package.json'), type: TYPE_WIDGET, path: path.resolve(__dirname, '../ui/build/widgets', 'layout')},
    {package: require('../ui/widgets/sidebar/package.json'), type: TYPE_WIDGET, path: path.resolve(__dirname, '../ui/build/widgets', 'sidebar')},
    {package: require('../ui/widgets/top-bar/package.json'), type: TYPE_WIDGET, path: path.resolve(__dirname, '../ui/build/widgets', 'topbar')},
    {package: require('../ui/widgets/trending/package.json'), type: TYPE_WIDGET, path: path.resolve(__dirname, '../ui/build/widgets', 'trending')},
    {package: require('../ui/widgets/analytics/package.json'), type: TYPE_WIDGET, path: path.resolve(__dirname, '../ui/build/widgets', 'analytics')}
  ]
  const results = [];
  for(const source of sources) {
    const output = await buckr.execute(
      '',
      process.env.HUB_KEY,
      process.env.HUB_SECRET,
      process.env.HUB_THREAD,
      path.join(process.env.HUB_NAME,source.type.toString(), source.package.name),
      'false',
      '**/*',
      source.path,
      '',
    );
    const manifestData = {
      path: 'manifest.json',
      content: JSON.stringify({
        links: { publicRepository: source.package.homepage || "", documentation: "" },
        sources: [`/ipfs/${output.get('ipfs')}`]
      }, null, 2)
    }
    const ipfsManifest = await ipfsClient.add(manifestData, {hashAlg: 'sha3-224', cidVersion: 1, pin: true});
    results.push({
      name: source.package.name,
      id: ethers.utils.id(source.package.name),
      ipfsManifest: ipfsManifest.cid.toString(format.base16.encoder),
      type: source.type
    });
  }
  fs.writeFileSync(path.resolve(__dirname, './integrations_bucket.json'), JSON.stringify(results, null, 2));
})();
