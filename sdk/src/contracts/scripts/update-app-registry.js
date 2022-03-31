/* eslint-disable */
const { ethers } = require('hardhat');
const semver = require('semver');
const pkgInfos = require('../../../../build/integrations_bucket.json');
async function main() {
  const IntegrationRegistry = await ethers.getContractFactory('IntegrationRegistry');
  const integrationRegistry = await IntegrationRegistry.attach(
    process.env.INTEGRATION_REGISTRY_ADDRESS,
  );

  for(const pkg of pkgInfos){
    if(typeof pkg.type !== "number"){
      continue;
    }
    const packageInfo = await integrationRegistry.getPackageInfo(pkg.id);
    let version;
    if(!packageInfo || !packageInfo.integrationName){
      version = 'v0.1.0';
    } else {
      const currentRelease = await integrationRegistry.getReleaseData(packageInfo.latestReleaseId);
      version = 'v' + semver.inc(currentRelease.version, 'minor');
    }
    console.log('deploying: ', pkg.name, ' version: ',version )
    await integrationRegistry.release(
      pkg.name,
      version,
      '0x'+pkg.ipfsManifest.substring(1),
      pkg.type,
    );
    console.log('deployed: ', pkg.name)
  }
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
