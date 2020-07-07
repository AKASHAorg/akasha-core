const AkashaRegistrar = artifacts.require("AkashaRegistrar");
const PublicResolver = artifacts.require("@ensdomains/resolver/PublicResolver");
const FifsRegistrar = artifacts.require("@ensdomains/ens/FIFSRegistrar");
const ENS = artifacts.require("@ensdomains/ens/ENSRegistry");
// const ReverseRegistrar = artifacts.require("@ensdomains/ens/ReverseRegistrar");

const namehash = require('eth-ens-namehash');
const utils = require('web3-utils');
contract('EnsRegistry', accounts => {
  it('should register a subdomain', async () => {
    const akashaRegistrar = await AkashaRegistrar.deployed();
    const publicResolver = await PublicResolver.deployed();
    const ens = await ENS.deployed();
    const fifsR = await FifsRegistrar.deployed();
    const tldOwner = await ens.owner.call(namehash.hash("eth"));
    assert.equal(tldOwner, fifsR.address, "no registrar set for TLD");

    await akashaRegistrar.register("testsubdomain", publicResolver.address, {from: accounts[1]});
    const subOwner = await akashaRegistrar.owner(utils.sha3("testsubdomain"));
    const ensSubOwner = await ens.owner.call(namehash.hash("testsubdomain.akasha.eth"));
    assert.equal(subOwner, ensSubOwner, "it should resolve to the same address")
  });

  it('retakes ownership of the root domain', async () => {
    const akashaRegistrar = await AkashaRegistrar.deployed();
    const ens = await ENS.deployed();
    const rootOwner = await ens.owner.call(namehash.hash("akasha.eth"));
    assert.equal(rootOwner, akashaRegistrar.address, "no registrar set for main domain");

    await akashaRegistrar.reclaimRoot({from: accounts[0]});

    const rootOwnerAfter = await ens.owner.call(namehash.hash("akasha.eth"));
    assert.equal(rootOwnerAfter, accounts[0], "could not retake ownership");
  })
})

contract('AkashaRegistrar', accounts => {
  it('should resolve to an address', async () => {
    const akashaRegistrar = await AkashaRegistrar.deployed();
    const publicResolver = await PublicResolver.deployed();
    await akashaRegistrar.register("testsubdomain1", publicResolver.address, {from: accounts[2]});
    const subOwner = await akashaRegistrar.owner(utils.sha3("testsubdomain1"));
    assert.equal(subOwner, accounts[2], "could not resolve name");
  })
})
