async function main() {
  // We get the contract to deploy
  const ReverseRegistrar = await ethers.getContractFactory("ReverseRegistrar");
  const AkashaRegistrar = await ethers.getContractFactory("AkashaRegistrar");
  const rRegistrar = await ReverseRegistrar .attach("0x6F628b68b30Dc3c17f345c9dbBb1E483c2b7aE5c");
  const akRegistrar = await AkashaRegistrar.attach("0x9005a15eb865e8378e5cb9f45e8849ef1eC4F90B");
  await rRegistrar.deployed();
  await akRegistrar.deployed();

  await akRegistrar.register("first", "0xf6305c19e814d2a75429Fd637d01F7ee0E77d615")
  await rRegistrar.setName(`first.akasha.eth`)
  console.log("rRegistrar deployed to:", rRegistrar.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
