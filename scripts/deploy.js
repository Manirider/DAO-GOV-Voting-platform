const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    // 1. Deploy Governance Token
    const GovernanceToken = await hre.ethers.getContractFactory("GovernanceToken");
    const token = await GovernanceToken.deploy();
    await token.waitForDeployment();
    const tokenAddress = await token.getAddress();
    console.log("GovernanceToken deployed to:", tokenAddress);

    // 2. Deploy Timelock (TimelockController)
    const minDelay = 0;
    const proposers = [];
    const executors = [];
    const Timelock = await hre.ethers.getContractFactory("TimelockController");
    const timelock = await Timelock.deploy(minDelay, proposers, executors, deployer.address);
    await timelock.waitForDeployment();
    const timelockAddress = await timelock.getAddress();
    console.log("TimelockController deployed to:", timelockAddress);

    // 3. Deploy Governor
    const MyGovernor = await hre.ethers.getContractFactory("MyGovernor");
    const governor = await MyGovernor.deploy(tokenAddress, timelockAddress);
    await governor.waitForDeployment();
    const governorAddress = await governor.getAddress();
    console.log("MyGovernor deployed to:", governorAddress);

    // 4. Setup Roles
    const PROPOSER_ROLE = await timelock.PROPOSER_ROLE();
    const EXECUTOR_ROLE = await timelock.EXECUTOR_ROLE();
    // const CANCELLER_ROLE = await timelock.CANCELLER_ROLE();
    const ALL_ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

    console.log("Setting up Timelock roles...");
    let tx = await timelock.grantRole(PROPOSER_ROLE, governorAddress);
    await tx.wait();

    tx = await timelock.grantRole(EXECUTOR_ROLE, ALL_ZERO_ADDRESS);
    await tx.wait();

    // 5. Delegate votes to self (deployer)
    console.log("Delegating votes to deployer...");
    tx = await token.delegate(deployer.address);
    await tx.wait();

    // 6. Save Contract Addresses for Frontend
    const configDir = path.join(__dirname, "../frontend/config");
    if (!fs.existsSync(configDir)) {
        fs.mkdirSync(configDir, { recursive: true });
    }

    const addressData = {
        tokenAddress,
        timelockAddress,
        governorAddress
    };

    fs.writeFileSync(
        path.join(configDir, "contract-address.json"),
        JSON.stringify(addressData, null, 2)
    );

    console.log("Contract addresses saved to frontend/config/contract-address.json");

    // 7. Save ABIs
    const abiDir = path.join(__dirname, "../frontend/abi");
    if (!fs.existsSync(abiDir)) {
        fs.mkdirSync(abiDir, { recursive: true });
    }

    const saveAbi = (name, contract) => {
        const artifact = hre.artifacts.readArtifactSync(name);
        fs.writeFileSync(
            path.join(abiDir, `${name}.json`),
            JSON.stringify(artifact.abi, null, 2)
        );
    };

    saveAbi("GovernanceToken", token);
    saveAbi("MyGovernor", governor);
    saveAbi("TimelockController", timelock);

    console.log("ABIs saved to frontend/abi/");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
