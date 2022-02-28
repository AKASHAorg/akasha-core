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
    const pkgName = "@akashaproject/ui-plugin";
    await ir.release(pkgName, "v0.1.0", "0x0155171c399a82fe5cc1ea7a7f0dbdb715066aac26060828f96593e098cc3ef4", 1);
    const f = await ir.getAllPackageIds(0);
    expect(f.next.toString()).to.equal('0');
    expect(f.integrationIds.length).to.equal(16);
    expect((await ir.numPackageIds()).toString()).to.equal('1');
    const pkgInfo = await ir.getPackageInfo(f.integrationIds[0]);

    expect(pkgInfo.enabled).to.be.true;
    const releaseData = await ir.getReleaseData(pkgInfo.latestReleaseId);
    console.log(releaseData);
    expect(releaseData.integrationName).to.equal(pkgName);


  });
});
