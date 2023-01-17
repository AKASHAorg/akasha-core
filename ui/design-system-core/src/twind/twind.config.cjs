var twind = require('@twind/core');
var presetAutoprefix = require('@twind/preset-autoprefix');
var presetTailwind = require('@twind/preset-tailwind');
var twindBaseConfig = require('../../../../twindBaseConfig');
module.exports = twind.defineConfig({
  presets: [presetAutoprefix(), presetTailwind()],
  ...twindBaseConfig,
});
