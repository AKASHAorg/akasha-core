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
    const manifestHash = '0x'+pkg.ipfsManifest.substring(1);
    let version;
    if(!packageInfo || !packageInfo.integrationName){
      version = 'v0.1.0';
    } else {
      const currentRelease = await integrationRegistry.getReleaseData(packageInfo.latestReleaseId);
      version = 'v' + semver.inc(currentRelease.version, 'minor');
      if(currentRelease.manifestHash === manifestHash){
        console.info('skipping new release for ', pkg.name);
        continue;
      }
    }
    console.log('deploying: ', pkg.name, ' version: ',version )
    const tx = await integrationRegistry.release(
      pkg.name,
      version,
      manifestHash,
      pkg.type,
    );
    await tx.wait(1);
    console.log('deployed: ', pkg.name);
  }
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
