async function main() {
  // We get the contract to deploy
  const ENS = await ethers.getContractFactory("ENS");
  const ens = await ENS.attach("0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e");

  await ens.deployed();

  await ens.setOwner("0x43bba60d9ee890bd3cd87a2a11df3f21a591ec3a99af5532f3795352370d266b", "0x9005a15eb865e8378e5cb9f45e8849ef1eC4F90B")

  console.log("ENS available at:", ens.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
