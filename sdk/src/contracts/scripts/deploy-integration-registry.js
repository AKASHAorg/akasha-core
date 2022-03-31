/* eslint-disable */
// const { ethers, upgrades } = require('hardhat');
// const semver = require('semver');
// const pkgInfos = require('../../../../build/integrations_bucket.json');
async function main() {
  // const IntegrationRegistry = await ethers.getContractFactory('IntegrationRegistry');
  //const IntRegistrar = await upgrades.deployProxy(IntegrationRegistry);
  // const safe = '0x4941D523fa837A536B8bed834F6e6c807FAba24C';
  // await upgrades.admin.transferProxyAdminOwnership(safe);
  // const integrationRegistry = await IntegrationRegistry.attach(
  //    '0xFB0b97933e5e94b0b0b8dEF09403222b5009bDED',
  //  );
  //
  // for(const pkg of pkgInfos){
  //   if(typeof pkg.type !== "number"){
  //     continue;
  //   }
  //   const packageInfo = await integrationRegistry.getPackageInfo(pkg.id);
  //   let version;
  //   if(!packageInfo || !packageInfo.integrationName){
  //     version = 'v0.1.0';
  //   } else {
  //     const currentRelease = await integrationRegistry.getReleaseData(packageInfo.latestReleaseId);
  //     version = 'v' + semver.inc(currentRelease.version, 'minor');
  //   }
  //   console.log('deploying: ', pkg.name, ' version: ',version )
  //   await integrationRegistry.release(
  //     pkg.name,
  //     version,
  //     '0x'+pkg.ipfsManifest.substring(1),
  //     pkg.type,
  //   );
  //   console.log('deployed: ', pkg.name)
  // }
  // const readIntegrationRegistry = await ethers.getContractAt(
  //   'IntegrationRegistry',
  //   '0xFB0b97933e5e94b0b0b8dEF09403222b5009bDED',
  // );
  // const releases = await readIntegrationRegistry.getAllPackageIds(0, 15);
  // await integrationRegistry.release(
  //   'testPackageHehe',
  //   'v0.1.1',
  //   '0x0170171c23281b16a3c58934162488ad6d039df686eca806f21eba0cebd03486',
  //   0,
  // );
  // const packageId = await integrationRegistry.generateIntegrationId('testPackageHehe');
  // console.log('packageId', packageId);
  // const packageInfo = await integrationRegistry.getPackageInfo(packageId);
  // console.log('packageInfo', packageInfo);
  // const releaseData = await integrationRegistry.getReleaseData(packageInfo.latestReleaseId);
  // console.log('releaseData', releaseData);
  //await akRegistrar.deployed();
  //console.log('IntegrationRegistry deployed to:', IntRegistrar.address);

  // const proxyAddress = '0xFB0b97933e5e94b0b0b8dEF09403222b5009bDED';
  //
  // const IntegrationRegV1 = await ethers.getContractFactory('IntegrationRegistry');
  // console.log('Preparing upgrade...');
  // const integrationRegAddr = await upgrades.prepareUpgrade(proxyAddress, IntegrationRegV1);
  // console.log('IntegrationRegAddr at:', integrationRegAddr);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
