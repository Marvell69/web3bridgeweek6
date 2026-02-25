import { expect } from "chai";
import { ethers } from "hardhat";

describe("SaveAsset with ERC20", function () {
  let snow: any;
  let saveAsset: any;
  let owner: any;
  let alice: any;

  async function setup() {
    [owner, alice] = await ethers.getSigners();

    // Deploy Snow
    const Snow = await ethers.getContractFactory("Snow");
    snow = await Snow.deploy(1000);
    await snow.deployed();

    // Deploy SaveAsset
    const SaveAsset = await ethers.getContractFactory("SaveAsset");
    saveAsset = await SaveAsset.deploy(snow.address);
    await saveAsset.deployed();
  }

  beforeEach(async function () {
    await setup();
  });

  //  Snow Tests

  describe("Snow Token", function () {
    it("Should have correct name", async function () {
      expect(await snow.name()).to.equal("Snow");
    });

    it("Should have correct symbol", async function () {
      expect(await snow.symbol()).to.equal("SNW");
    });

    it("Should have 18 decimals", async function () {
      expect(await snow.decimals()).to.equal(18);
    });
  });

//  SaveAsset Tests

  describe("SaveAsset", function () {
    it("Should be deployed with token address", async function () {
      expect(await saveAsset.token_address())
        .to.equal(snow.address);
    });

    it("Should allow ETH deposit", async function () {
      const depositAmount = ethers.utils.parseEther("1");

      await saveAsset.connect(alice).deposit({ value: depositAmount });

      expect(await saveAsset.balances(alice.address))
        .to.equal(depositAmount);
    });

    it("Should allow ETH withdrawal", async function () {
      const depositAmount = ethers.utils.parseEther("5");
      const withdrawAmount = ethers.utils.parseEther("2");

      await saveAsset.connect(alice).deposit({ value: depositAmount });
      await saveAsset.connect(alice).withdraw(withdrawAmount);

      expect(await saveAsset.balances(alice.address))
        .to.equal(ethers.utils.parseEther("3"));
    });
  });
});