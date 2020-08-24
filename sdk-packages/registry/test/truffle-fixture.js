// const ENS = artifacts.require('@ensdomains/ens/ENSRegistry');
// const FIFSRegistrar = artifacts.require('@ensdomains/ens/FIFSRegistrar');
// const ReverseRegistrar = artifacts.require('@ensdomains/ens/ReverseRegistrar');
// const PublicResolver = artifacts.require('@ensdomains/resolver/PublicResolver');
// const AkashaRegistrar = artifacts.require('AkashaRegistrar');
//
// const utils = require('web3-utils');
// const namehash = require('eth-ens-namehash');
//
// const tld = 'eth';
//
// module.exports = async() => {
//   let ens;
//   let resolver;
//   let registrar;
//   let akRegistrar;
//
//   ens = await ENS.new();
//   ENS.setAsDeployed(ens);
//   console.log('Ens addr', ens);
//   resolver = await PublicResolver.new(ens);
//   PublicResolver.setAsDeployed(resolver);
//
//   const awaitRes = await setupResolver(ens, resolver, ethers.getSigners());
//   registrar = await FIFSRegistrar.new(ens, namehash.hash(tld));
//   await setupRegistrar(ens, registrar);
//   const rRegistrar = await ReverseRegistrar.new(ens, resolver);
//   await setupReverseRegistrar(ens, resolver, rRegistrar, ethers.getSigners());
//   akRegistrar = AkashaRegistrar.new(ens.address);
//   await registerRootNode(registrar, akRegistrar);
// };
//
// async function setupResolver (ens, resolver, accounts) {
//   const resolverNode = namehash.hash('resolver');
//   const resolverLabel = utils.sha3('resolver');
//
//   await ens.setSubnodeOwner('0x0000000000000000000000000000000000000000', resolverLabel, accounts[0]);
//   await ens.setResolver(resolverNode, resolver.address);
//   await resolver.setAddr(resolverNode, resolver.address);
// }
//
// async function setupRegistrar (ens, registrar) {
//   await ens.setSubnodeOwner('0x0000000000000000000000000000000000000000', utils.sha3(tld), registrar.address);
// }
//
// async function setupReverseRegistrar (ens, resolver, reverseRegistrar, accounts) {
//   await ens.setSubnodeOwner('0x0000000000000000000000000000000000000000', utils.sha3('reverse'), accounts[0]);
//   await ens.setSubnodeOwner(namehash.hash('reverse'), utils.sha3('addr'), reverseRegistrar.address);
// }
//
// async function registerRootNode (registrar, akRegistrar) {
//   await registrar.register(utils.sha3('akasha'), akRegistrar.address);
// }
