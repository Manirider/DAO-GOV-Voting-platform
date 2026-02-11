const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
    console.log("Seeding initial data...");

    const configPath = path.join(__dirname, "../frontend/config/contract-address.json");
    if (!fs.existsSync(configPath)) {
        throw new Error("Contract addresses not found. Deploy first.");
    }

    const { governorAddress, tokenAddress } = JSON.parse(fs.readFileSync(configPath, "utf8"));
    const [deployer] = await hre.ethers.getSigners();

    console.log("Using account:", deployer.address);

    const MyGovernor = await hre.ethers.getContractFactory("MyGovernor");
    const governor = MyGovernor.attach(governorAddress);

    const GovernanceToken = await hre.ethers.getContractFactory("GovernanceToken");
    const token = GovernanceToken.attach(tokenAddress);

    const votes = await token.getVotes(deployer.address);
    console.log(`Current voting power: ${hre.ethers.formatEther(votes)} tokens`);

    const proposalDescription = "Proposal #1: Seed Proposal for Testing Realtime Features #QV";
    const transferCalldata = token.interface.encodeFunctionData("transfer", [deployer.address, hre.ethers.parseEther("100")]);
    
    console.log("Creating proposal...");
    const tx = await governor.propose(
        [tokenAddress],
        [0],
        [transferCalldata],
        proposalDescription
    );
    const receipt = await tx.wait();
    const proposalId = receipt.logs[0].args.proposalId;
    console.log(`Proposal created with ID: ${proposalId}`);

    console.log("Mining blocks for voting delay...");
    await hre.network.provider.send("evm_mine"); 
    await hre.network.provider.send("evm_mine");

    console.log("Seeding complete!");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
