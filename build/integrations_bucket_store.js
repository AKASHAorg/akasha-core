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
  const TYPE_APP = 'app';
  const TYPE_PLUGIN = 'plugin';
  const TYPE_WIDGET = 'widget';
  const sources = [
    {package: { name: 'locales'}, type: '', path: path.resolve(__dirname, '..', 'locales')},
    // apps
    {package: require('../apps/akasha/package.json'), type: TYPE_APP, path: path.resolve(__dirname, '../ui/build/apps', 'akasha')},
    {package: require('../apps/auth-app/package.json'), type: TYPE_APP, path: path.resolve(__dirname, '../ui/build/apps', 'auth-app')},
    {package: require('../apps/moderation/package.json'), type: TYPE_APP, path: path.resolve(__dirname, '../ui/build/apps', 'moderation')},
    // plugins
    {package: require('../ui/plugins/app-center/package.json'), type: TYPE_PLUGIN, path: path.resolve(__dirname, '../ui/build/plugins', 'app-center')},
    {package: require('../ui/plugins/bookmarks/package.json'), type: TYPE_PLUGIN, path: path.resolve(__dirname, '../ui/build/plugins', 'bookmarks')},
    {package: require('../ui/plugins/legal/package.json'), type: TYPE_PLUGIN, path: path.resolve(__dirname, '../ui/build/plugins', 'legal')},
    {package: require('../ui/plugins/notifications/package.json'), type: TYPE_PLUGIN, path: path.resolve(__dirname, '../ui/build/plugins', 'notifications')},
    {package: require('../ui/plugins/profile/package.json'), type: TYPE_PLUGIN, path: path.resolve(__dirname, '../ui/build/plugins', 'profile')},
    {package: require('../ui/plugins/search/package.json'), type: TYPE_PLUGIN, path: path.resolve(__dirname, '../ui/build/plugins', 'search')},
    // widgets
    {package: require('../ui/widgets/feed/package.json'), type: TYPE_WIDGET, path: path.resolve(__dirname, '../ui/build/widgets', 'feed')},
    {package: require('../ui/widgets/layout/package.json'), type: TYPE_WIDGET, path: path.resolve(__dirname, '../ui/build/widgets', 'layout')},
    {package: require('../ui/widgets/login-cta/package.json'), type: TYPE_WIDGET, path: path.resolve(__dirname, '../ui/build/widgets', 'login-cta')},
    {package: require('../ui/widgets/sidebar/package.json'), type: TYPE_WIDGET, path: path.resolve(__dirname, '../ui/build/widgets', 'sidebar')},
    {package: require('../ui/widgets/top-bar/package.json'), type: TYPE_WIDGET, path: path.resolve(__dirname, '../ui/build/widgets', 'topbar')},
    {package: require('../ui/widgets/trending/package.json'), type: TYPE_WIDGET, path: path.resolve(__dirname, '../ui/build/widgets', 'trending')}
  ]
  const results = [];
  for(const source of sources) {
    const output = await buckr.execute(
      '',
      process.env.HUB_KEY,
      process.env.HUB_SECRET,
      process.env.HUB_THREAD,
      path.join(process.env.HUB_NAME,source.type, source.package.name),
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
      ipfs: output.get('ipfs'),
      id: ethers.utils.id(source.package.name),
      ipfsManifest: ipfsManifest.cid.toString(format.base16.encoder)
    });
  }
  fs.writeFileSync(path.resolve(__dirname, './integrations_bucket.json'), JSON.stringify(results, null, 2));
})();
