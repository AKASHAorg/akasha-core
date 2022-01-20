/* eslint-disable */
const { ethers, upgrades } = require('hardhat');
async function main() {
  //const IntegrationRegistry = await ethers.getContractFactory('IntegrationRegistry');
  //const IntRegistrar = await upgrades.deployProxy(IntegrationRegistry);
  // const safe = '0x4941D523fa837A536B8bed834F6e6c807FAba24C';
  // await upgrades.admin.transferProxyAdminOwnership(safe);
  // const integrationRegistry = await IntegrationRegistry.attach(
  //   '0x5E49595D7B3593a61Ed8e947c2cC23091cAB8BfC',
  // );
  // const readIntegrationRegistry = await ethers.getContractAt(
  //   'IntegrationRegistry',
  //   '0xFB6a190732f54d50bE96AaAb57Eb97e824319eB9',
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

  // const proxyAddress = '0xFB6a190732f54d50bE96AaAb57Eb97e824319eB9';
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
