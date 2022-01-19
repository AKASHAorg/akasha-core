/* eslint-disable */
const { expect } = require('chai');
const { ethers, upgrades } = require('hardhat');

let IR;
let ir;

// Start test block
describe('IntegrationRegistry', function () {
  beforeEach(async function () {
    IR = await ethers.getContractFactory("IntegrationRegistry");
    ir = await upgrades.deployProxy(IR);
    await ir.deployed();
  });

  it('creates a new release', async function () {
    await ir.release("@akashaproject/ui-plugin", "v0.1.0", "0x0155171c399a82fe5cc1ea7a7f0dbdb715066aac26060828f96593e098cc3ef4", 1);
    const f = await ir.getAllPackageIds(0);
    expect(f.next.toString()).to.equal('0');
    expect(f.packageIds.length).to.equal(16);
    expect((await ir.numPackageIds()).toString()).to.equal('1');

  });
});
