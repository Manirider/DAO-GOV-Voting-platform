
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/governance/Governor.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorSettings.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorCountingSimple.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotes.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotesQuorumFraction.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorTimelockControl.sol";

contract MyGovernor is
    Governor,
    GovernorSettings,
    GovernorCountingSimple,
    GovernorVotes,
    GovernorVotesQuorumFraction,
    GovernorTimelockControl
{
    enum VotingType {
        Standard,
        Quadratic
    }

    mapping(uint256 => VotingType) public proposalVotingType;

    constructor(
        IVotes _token,
        TimelockController _timelock
    )
        Governor("MyGovernor")
        GovernorSettings(7200, 50400, 100e18)
        GovernorVotes(_token)
        GovernorVotesQuorumFraction(4)
        GovernorTimelockControl(_timelock)
    {}

    function propose(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        string memory description
    ) public override(Governor) returns (uint256) {
        uint256 proposalId = super.propose(
            targets,
            values,
            calldatas,
            description
        );

        if (contains(description, "#QV")) {
            proposalVotingType[proposalId] = VotingType.Quadratic;
        } else {
            proposalVotingType[proposalId] = VotingType.Standard;
        }

        return proposalId;
    }

    function _getVotes(
        address account,
        uint256 timepoint,
        bytes memory params
    ) internal view override(Governor, GovernorVotes) returns (uint256) {
        uint256 rawBalance = super._getVotes(account, timepoint, params);
        return rawBalance;
    }

    function _countVote(
        uint256 proposalId,
        address account,
        uint8 support,
        uint256 weight,
        bytes memory params
    ) internal override(Governor, GovernorCountingSimple) returns (uint256) {
        if (proposalVotingType[proposalId] == VotingType.Standard) {
            return super._countVote(proposalId, account, support, weight, params);
        } else {
            uint256 desiredVotes = 1;

            if (params.length > 0) {
                desiredVotes = abi.decode(params, (uint256));
            } else {
                desiredVotes = sqrt(weight);
            }

            uint256 cost = desiredVotes * desiredVotes;
            require(weight >= cost, "QV: Insufficient voting power");

            return super._countVote(
                proposalId,
                account,
                support,
                desiredVotes,
                params
            );
        }
    }

    function sqrt(uint256 x) internal pure returns (uint256 y) {
        uint256 z = (x + 1) / 2;
        y = x;
        while (z < y) {
            y = z;
            z = (x / z + z) / 2;
        }
    }

    function contains(
        string memory what,
        string memory where
    ) internal pure returns (bool) {
        bytes memory whatBytes = bytes(what);
        bytes memory whereBytes = bytes(where);

        if (whereBytes.length < whatBytes.length) return false;

        bool found = false;
        for (uint i = 0; i <= whereBytes.length - whatBytes.length; i++) {
            bool flag = true;
            for (uint j = 0; j < whatBytes.length; j++) {
                if (whereBytes[i + j] != whatBytes[j]) {
                    flag = false;
                    break;
                }
            }
            if (flag) {
                found = true;
                break;
            }
        }
        return found;
    }

    function votingDelay()
        public
        view
        override(Governor, GovernorSettings)
        returns (uint256)
    {
        return super.votingDelay();
    }

    function votingPeriod()
        public
        view
        override(Governor, GovernorSettings)
        returns (uint256)
    {
        return super.votingPeriod();
    }

    function quorum(
        uint256 blockNumber
    )
        public
        view
        override(Governor, GovernorVotesQuorumFraction)
        returns (uint256)
    {
        return super.quorum(blockNumber);
    }

    function state(
        uint256 proposalId
    )
        public
        view
        override(Governor, GovernorTimelockControl)
        returns (ProposalState)
    {
        return super.state(proposalId);
    }

    function proposalNeedsQueuing(
        uint256 proposalId
    ) public view override(Governor, GovernorTimelockControl) returns (bool) {
        return super.proposalNeedsQueuing(proposalId);
    }

    function proposalThreshold()
        public
        view
        override(Governor, GovernorSettings)
        returns (uint256)
    {
        return super.proposalThreshold();
    }

    function _queueOperations(
        uint256 proposalId,
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    ) internal override(Governor, GovernorTimelockControl) returns (uint48) {
        return
            super._queueOperations(
                proposalId,
                targets,
                values,
                calldatas,
                descriptionHash
            );
    }

    function _executeOperations(
        uint256 proposalId,
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    ) internal override(Governor, GovernorTimelockControl) {
        super._executeOperations(
            proposalId,
            targets,
            values,
            calldatas,
            descriptionHash
        );
    }

    function _cancel(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    ) internal override(Governor, GovernorTimelockControl) returns (uint256) {
        return super._cancel(targets, values, calldatas, descriptionHash);
    }

    function _executor()
        internal
        view
        override(Governor, GovernorTimelockControl)
        returns (address)
    {
        return super._executor();
    }
}
