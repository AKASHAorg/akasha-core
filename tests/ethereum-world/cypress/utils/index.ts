const fs = require('fs-extra');
const path = require('path');

export function getConfigurationByFile(file) {
  const pathToConfigFile = path.resolve('./', 'cypress', `${file}.json`);

  return fs.readJson(pathToConfigFile);
}
