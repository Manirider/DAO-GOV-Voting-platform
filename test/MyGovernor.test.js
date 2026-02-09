import {
    time,
    loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import hre from "hardhat";
const { ethers } = hre;

describe("DAO Governance", function () {
    async function deployFixture() {
        const [owner, otherAccount, voter1, voter2, voter3] = await ethers.getSigners();

        const GovernanceToken = await ethers.getContractFactory("GovernanceToken");
        const token = await GovernanceToken.deploy();

        const TimelockController = await ethers.getContractFactory("TimelockController");
        const timelock = await TimelockController.deploy(0, [], [], owner.address);

        const MyGovernor = await ethers.getContractFactory("MyGovernor");
        const governor = await MyGovernor.deploy(await token.getAddress(), await timelock.getAddress());

        // Setup roles
        const PROPOSER_ROLE = await timelock.PROPOSER_ROLE();
        const EXECUTOR_ROLE = await timelock.EXECUTOR_ROLE();
        const TIMELOCK_ADMIN_ROLE = await timelock.TIMELOCK_ADMIN_ROLE();

        await timelock.grantRole(PROPOSER_ROLE, await governor.getAddress());
        await timelock.grantRole(EXECUTOR_ROLE, ethers.ZeroAddress);

        // Distribute tokens and delegate
        // Mint is in constructor to msg.sender (owner)
        // Transfer some to voters
        const amount = ethers.parseEther("100");
        await token.transfer(voter1.address, amount);
        await token.transfer(voter2.address, amount);
        await token.transfer(voter3.address, amount);

        await token.connect(voter1).delegate(voter1.address);
        await token.connect(voter2).delegate(voter2.address);
        await token.connect(voter3).delegate(voter3.address);

        return { token, timelock, governor, owner, otherAccount, voter1, voter2, voter3 };
    }

    describe("GovernanceToken", function () {
        it("Should mint initial supply to owner", async function () {
            const { token, owner } = await loadFixture(deployFixture);
            expect(await token.balanceOf(owner.address)).to.be.above(0);
        });

        it("Should support delegation", async function () {
            const { token, voter1 } = await loadFixture(deployFixture);
            expect(await token.getVotes(voter1.address)).to.equal(ethers.parseEther("100"));
        });
    });

    describe("MyGovernor - Standard Voting", function () {
        it("Should create and execute a standard proposal", async function () {
            const { token, governor, timelock, owner, voter1 } = await loadFixture(deployFixture);

            const grantAmount = ethers.parseEther("1");
            const transferCalldata = token.interface.encodeFunctionData("transfer", [owner.address, grantAmount]);

            const description = "Proposal #1: Give owner 1 token";
            const tx = await governor.connect(owner).propose(
                [await token.getAddress()],
                [0],
                [transferCalldata],
                description
            );

            const receipt = await tx.wait();
            const event = receipt.logs.find(x => x.eventName === 'ProposalCreated'); // Incorrect, need to check abi
            // For simplicity in finding ID, we can re-fetch or look at logs.
            // Easiest is to calculate ID deterministically or parse logs properly.
            // But let's just use the helper:
            const proposalId = await governor.hashProposal(
                [await token.getAddress()],
                [0],
                [transferCalldata],
                ethers.keccak256(ethers.toUtf8Bytes(description))
            );

            // Advance delay
            await time.increase(7200 + 1);

            // Vote
            // 0 = Against, 1 = For, 2 = Abstain
            await governor.connect(voter1).castVote(proposalId, 1);

            // Advance voting period
            await time.increase(50400 + 1);

            // Queue
            await governor.queue(
                [await token.getAddress()],
                [0],
                [transferCalldata],
                ethers.keccak256(ethers.toUtf8Bytes(description))
            );

            // Execute
            // Timelock delay is 0
            await governor.execute(
                [await token.getAddress()],
                [0],
                [transferCalldata],
                ethers.keccak256(ethers.toUtf8Bytes(description))
            );

            expect(await governor.state(proposalId)).to.equal(7); // Executed
        });
    });

    describe("MyGovernor - Quadratic Voting", function () {
        it("Should correctly enforce quadratic cost", async function () {
            const { token, governor, owner, voter1 } = await loadFixture(deployFixture);

            const description = "Proposal #2: QV Test #QV"; // Contains #QV tag
            const transferCalldata = token.interface.encodeFunctionData("transfer", [owner.address, ethers.parseEther("1")]);

            await governor.connect(owner).propose(
                [await token.getAddress()],
                [0],
                [transferCalldata],
                description
            );

            const proposalId = await governor.hashProposal(
                [await token.getAddress()],
                [0],
                [transferCalldata],
                ethers.keccak256(ethers.toUtf8Bytes(description))
            );

            await time.increase(7200 + 1);

            // Voter1 has 100 tokens. Sqrt(100) = 10 votes max.
            // Try to vote with 11 votes -> Cost 121 > 100 -> Should revert.
            // NOTE: We need to pass params for QV!
            // params = abi.encode(desiredVotes)

            const desiredVotesTooHigh = 11;
            const paramsTooHigh = ethers.AbiCoder.defaultAbiCoder().encode(["uint256"], [desiredVotesTooHigh]);

            await expect(
                governor.connect(voter1).castVoteWithParams(proposalId, 1, paramsTooHigh)
            ).to.be.revertedWith("QV: Insufficient voting power");

            // Try with 10 votes -> Cost 100 <= 100 -> Should succeed.
            const desiredVotesOK = 10;
            const paramsOK = ethers.AbiCoder.defaultAbiCoder().encode(["uint256"], [desiredVotesOK]);

            await expect(
                governor.connect(voter1).castVoteWithParams(proposalId, 1, paramsOK)
            ).to.emit(governor, "VoteCast");

            // Verify votes counted
            // Check proposal votes
            const votes = await governor.proposalVotes(proposalId);
            expect(votes.forVotes).to.equal(desiredVotesOK); // Should be 10, not 100
        });
    });
});
