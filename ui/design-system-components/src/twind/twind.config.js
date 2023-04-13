import { defineConfig } from '@twind/core';
import presetAutoprefix from '@twind/preset-autoprefix';
import presetTailwind from '@twind/preset-tailwind';
import twindBaseConfig from '../../../../twindBaseConfig';
export default defineConfig({
  presets: [presetAutoprefix(), presetTailwind()],
  ...twindBaseConfig,
});
