const { ethers } = require('@nomiclabs/buidler');

async function main() {
  // const IntegrationRegistry = await ethers.getContractFactory('IntegrationRegistry');
  // const akRegistrar = await IntegrationRegistry.deploy();
  // const integrationRegistry = await IntegrationRegistry.attach(
  //   '0x9D6cE57DAc0499286d18323F7eAEbf40F9412BF5',
  // );
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
  // console.log('IntegrationRegistry deployed to:', akRegistrar.address, akRegistrar.txhash);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
