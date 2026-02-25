import {loadFixture} from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import hre  from "hardhat";

describe( "SaveEther", function (){
    
    // let saveEther: any;
    // let owner: any;
    // let alice: any;

    async function deploySaveEther() {
        const [owner] = await hre.ethers.getSigners();
        const SaveEther = await hre.ethers.getContractFactory("SaveEther");
        const saveEther = await SaveEther.deploy();
        return { saveEther, owner };
    //  [owner, alice] = await ethers.getSigners();

    //  const SaveEther = await ethers.getContractFactory("SaveEther");
    //  saveEther = await SaveEther.deploy();
    //  await saveEther.deployed();
    }
    describe("Deployment", function () { 
        it("should deposit ether", async function() {
            const {saveEther} = await loadFixture(deploySaveEther);
            await saveEther.deposit({value: hre.ethers.utils.parseEther("1")});
            const balance = await saveEther.getUserSavings();
            expect(balance).to.equal(hre.ethers.utils.parseEther("1"));
        })
        it("should withdraw ether", async function (){
            const {saveEther} = await loadFixture(deploySaveEther);
            await saveEther.deposit({value: hre.ethers.utils.parseEther("1")});
            await saveEther.withdraw(1000000000000000000n);
            const balance = await saveEther.getUserSavings();
            expect(balance).to.equal(hre.ethers.utils.parseEther("0"));
        })
    })
    
   
})
//     beforeEach (async function () {
//         await setup();
//     });

//     describe("SaveEther", function () { 
//         it("should allow ETH deposit", async function (){
//             const depositeAmount = ethers.utils.parseEther("1");

//             await saveEther.connect(alice).deposit({value: depositeAmount});

//             expect (await saveEther.balances(alice.address)).to.equal(depositeAmount);
//         })
//     })
// }

