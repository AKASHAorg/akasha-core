const { ethers } = require('@nomiclabs/buidler');

async function main() {
  const AkashaRegistrar = await ethers.getContractFactory('AkashaRegistrar');
  const akRegistrar = await AkashaRegistrar.deploy('0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e');

  await akRegistrar.deployed();

  console.log('AkashaRegistrar deployed to:', akRegistrar.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
