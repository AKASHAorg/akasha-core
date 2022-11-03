/* eslint-disable */
const { ethers } = require('hardhat');
const semver = require('semver');

const pkgInfos = process.env.DEPLOY_PRODUCTION_REGISTRY
  ? require('../../../../build/integrations_bucket_prod.json')
  : require('../../../../build/integrations_bucket.json');

async function main () {
  const IntegrationRegistry = await ethers.getContractFactory("IntegrationRegistry");
  const integrationRegistry = await IntegrationRegistry.attach(
    process.env.INTEGRATION_REGISTRY_ADDRESS
  );
  const gasEstimate = await ethers.provider.getFeeData();
  const gasSettings = {
    maxFeePerGas: gasEstimate.maxFeePerGas,
    maxPriorityFeePerGas: gasEstimate.maxPriorityFeePerGas,
  };
  // const priorityTxGas = {
  //   maxFeePerGas: gasEstimate.maxFeePerGas.add(gasEstimate.maxFeePerGas.div(6)),
  //   maxPriorityFeePerGas: gasEstimate.maxPriorityFeePerGas.add(gasEstimate.maxPriorityFeePerGas.div(6)),
  //   //gasPrice: gasEstimate.gasPrice.add(gasEstimate.gasPrice.div(5))
  // }
  for (const pkg of pkgInfos) {
    if (typeof pkg.type !== "number") {
      continue;
    }
    const packageInfo = await integrationRegistry.getPackageInfo(pkg.id);
    const manifestHash = "0x" + pkg.ipfsManifest.substring(1);
    let version;
    if (!packageInfo || !packageInfo.integrationName) {
      version = "v0.1.0";
    } else {
      const currentRelease = await integrationRegistry.getReleaseData(packageInfo.latestReleaseId);
      version = "v" + semver.inc(currentRelease.version, "minor");
      if (currentRelease.manifestHash === manifestHash) {
        console.info("skipping new release for ", pkg.name);
        continue;
      }
    }
    console.log("deploying: ", pkg.name, " version: ", version);
    const tx = await integrationRegistry.release(
      pkg.name,
      version,
      manifestHash,
      pkg.type,
      gasSettings
    );
    console.info("tx.hash:", tx.hash);
    await tx.wait(1);
    console.log("deployed: ", pkg.name, "\n");
  }
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
