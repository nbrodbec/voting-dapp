// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Poll {
    address public owner;
    bytes32 public title;
    bytes32[10] public pollOptionStrings;
    mapping(address => bool) public registeredVoters;
    uint public numVoters = 0;
    mapping(uint => uint) private votes;

    enum Phase {
        REGISTRATION,
        VOTING,
        LOCKED
    }
    Phase public currentPhase = Phase.REGISTRATION;

    constructor(bytes32 name, bytes32[10] memory options) {
        owner = msg.sender;
        title = name;
        pollOptionStrings = options;
    }

    function getVotes() public view returns (uint[10] memory) {
        uint[10] memory votesArray;
        for (uint i = 0; i < 10; i++) {
            votesArray[i] = votes[i];
        }
        return votesArray;
    }

    function getOptions() public view returns (bytes32[10] memory) {
        return pollOptionStrings;
    }

    function register() public {
        require(
            currentPhase == Phase.REGISTRATION,
            "Registration phase not active"
        );
        require(registeredVoters[msg.sender] == false, "Already registered");

        registeredVoters[msg.sender] = true;
        numVoters++;
        emit Register(msg.sender);
    }

    function vote(uint ballot) public {
        require(currentPhase == Phase.VOTING, "Voting phase not active");
        require(registeredVoters[msg.sender] == true, "Not registered");

        // Remove voter from eligible voters after vote. If ballot is not a valid option
        // it won't be relevant in poll results; a spoilt ballot.
        // Note: A valid option is one such that pollOptionStrings[ballot] is not an empty string.
        votes[ballot]++;
        delete registeredVoters[msg.sender];
        emit Vote(ballot);
    }

    function nextPhase() public {
        require(msg.sender == owner, "Only owner can change phase");
        if (currentPhase == Phase.REGISTRATION) {
            currentPhase = Phase.VOTING;
            emit PhaseChange(currentPhase);
        } else if (currentPhase == Phase.VOTING) {
            currentPhase = Phase.LOCKED;
            emit PhaseChange(currentPhase);
        }
    }

    event Register(address voter);
    event Vote(uint ballot);
    event PhaseChange(Phase newPhase);
}
