const PackageRegistry = artifacts.require('PackageRegistry');

module.exports = function(deployer) {
  deployer.deploy(PackageRegistry);
};
