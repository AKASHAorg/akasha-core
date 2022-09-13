import { defineConfig } from 'cypress';
import { getConfigurationByFile } from './cypress/utils';

export default defineConfig({
  retries: 3,
  e2e: {
    specPattern: 'cypress/**/*.spec.{js,jsx,ts,tsx}',
    setupNodeEvents(on, config) {
      const file = config.env.configFile || 'staging';
      return getConfigurationByFile(file);
    },
  },
});
