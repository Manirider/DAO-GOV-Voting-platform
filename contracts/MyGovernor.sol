// SPDX-License-Identifier: MIT
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
        GovernorSettings(7200, /* 1 day */ 50400, 100e18) // 100 tokens threshold
        GovernorVotes(_token)
        GovernorVotesQuorumFraction(4)
        GovernorTimelockControl(_timelock)
    {}

    // Override propose to allow specifying voting type via description or just default to Standard
    // Ideally we would pass it as an argument, but the standard interface is fixed.
    // We can parse the description for a tag like "#QV" to enable Quadratic Voting.
    function propose(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        string memory description
    ) public override(Governor, IGovernor) returns (uint256) {
        uint256 proposalId = super.propose(
            targets,
            values,
            calldatas,
            description
        );

        // Simple check for Quadratic Voting tag in description
        if (contains(description, "#QV")) {
            proposalVotingType[proposalId] = VotingType.Quadratic;
        } else {
            proposalVotingType[proposalId] = VotingType.Standard;
        }

        return proposalId;
    }

    // Override _getVotes to handle Quadratic Voting logic
    // This ensures the weight passed to counting and emitted in events is the effective votes.
    function _getVotes(
        address account,
        uint256 timepoint,
        bytes memory params
    ) internal view override(Governor, GovernorVotes) returns (uint256) {
        // Default to standard votes (balance)
        uint256 rawBalance = super._getVotes(account, timepoint, params);

        // We can't access proposalVotingType here easily because _getVotes doesn't know the proposalId.
        // The `Governor` calls `_getVotes` inside `_castVote` with `params`.
        // `proposalId` is passed to `_castVote` but NOT to `_getVotes` in the standard OZ implementation?
        // Wait, checking OZ 5.0 source:
        // function _castVote(...) internal virtual returns (uint256) {
        //     ...
        //     uint256 weight = _getVotes(account, proposalId, params); // WAIT, does it pass proposalId?
        // }
        // Actually, OZ Governor `_getVotes` signature is:
        // function _getVotes(address account, uint256 blockNumber, bytes memory params) ...
        // It DOES NOT take proposalId.

        // This is a problem for the `_getVotes` strategy if we need per-proposal logic.
        // If I cannot see proposalId in _getVotes, I cannot switch logic based on proposal type.

        // REVERTING STRATEGY:
        // I must use `_countVote` or `_castVote` override where I have `proposalId`.
        // I will revert to overriding `_countVote` as originally planned.
        // It's the most reliable place where I have `proposalId`, `account`, and `params`.
        // And I will accept that the core `VoteCast` event emits the raw balance (weight returned by _getVotes).
        // OR, I can emit a separate event `QuadraticVoteCast` for clarity.

        return rawBalance;
    }

    function _countVote(
        uint256 proposalId,
        address account,
        uint8 support,
        uint256 weight,
        bytes memory params
    ) internal override(Governor, GovernorCountingSimple) {
        if (proposalVotingType[proposalId] == VotingType.Standard) {
            super._countVote(proposalId, account, support, weight, params);
        } else {
            uint256 desiredVotes = 1;
            // params is encoded valid votes?
            // If the user uses a standard interface they might not pass params.
            // If params is empty, default to 1 vote (min cost 1 token)? Or sqrt(balance)?
            // Let's assume if params is empty, we try to use max possible votes? No, that's dangerous/expensive.
            // Default to 1 vote if no params.

            if (params.length > 0) {
                desiredVotes = abi.decode(params, (uint256));
            } else {
                // Fallback or error?
                // Let's calculate max votes: int(sqrt(weight))
                desiredVotes = sqrt(weight);
            }

            uint256 cost = desiredVotes * desiredVotes;
            require(weight >= cost, "QV: Insufficient voting power");

            // We count 'desiredVotes'
            super._countVote(
                proposalId,
                account,
                support,
                desiredVotes,
                params
            );
        }
    }

    // Math helper
    function sqrt(uint256 x) internal pure returns (uint256 y) {
        uint256 z = (x + 1) / 2;
        y = x;
        while (z < y) {
            y = z;
            z = (x / z + z) / 2;
        }
    }

    // Helper to check string contains
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

    // The following functions are overrides required by Solidity.

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
