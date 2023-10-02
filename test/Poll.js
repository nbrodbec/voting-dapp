const {
  time,
  loadFixture,
} = require('@nomicfoundation/hardhat-toolbox/network-helpers');
const { anyValue } = require('@nomicfoundation/hardhat-chai-matchers/withArgs');
const { expect } = require('chai');
const { EtherscanProvider } = require('ethers');
const { ethers } = require('hardhat');

describe('Poll', function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployPoll() {
    const pollOptions = [
      'Jane',
      'Alfred',
      'Steven',
      'Kimberly',
      '',
      '',
      '',
      '',
      '',
      '',
    ];
    const pollOptionsBytes32 = pollOptions.map((s) =>
      ethers.encodeBytes32String(s)
    );

    const title = 'General Election';
    const titleBytes32 = ethers.encodeBytes32String(title);
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const Poll = await ethers.getContractFactory('Poll');
    const poll = await Poll.deploy(titleBytes32, pollOptionsBytes32);

    return { poll, pollOptions, title, owner, otherAccount };
  }

  async function deployPollInVotingPhaseUnregistered() {
    const fixture = await loadFixture(deployPoll);

    await fixture.poll.connect(fixture.owner).nextPhase();

    return fixture;
  }

  async function deployPollInVotingPhaseRegistered() {
    const fixture = await loadFixture(deployPoll);

    await fixture.poll.connect(fixture.otherAccount).register();
    await fixture.poll.connect(fixture.owner).nextPhase();

    return fixture;
  }

  async function deployPollInLockedPhase() {
    const fixture = await loadFixture(deployPollInVotingPhaseUnregistered);

    await fixture.poll.connect(fixture.owner).nextPhase();

    return fixture;
  }

  describe('Deployment', () => {
    it('Should set the right poll options', async () => {
      const { poll, pollOptions } = await loadFixture(deployPoll);

      expect(
        (await poll.getOptions()).map((s) => ethers.decodeBytes32String(s))
      ).to.deep.equal(pollOptions);
    });

    it('Should set the right title', async () => {
      const { poll, title } = await loadFixture(deployPoll);

      expect(ethers.decodeBytes32String(await poll.title())).to.equal(title);
    });

    it('Should set the right owner', async () => {
      const { poll, owner } = await loadFixture(deployPoll);

      expect(await poll.owner()).to.equal(owner.address);
    });

    it('Should set the initial phase to registration', async () => {
      const { poll } = await loadFixture(deployPoll);

      expect(await poll.currentPhase()).to.equal(0);
    });
  });

  describe('Registration', () => {
    it('Should revert with right error if called in voting phase', async () => {
      const { poll, otherAccount } = await loadFixture(
        deployPollInVotingPhaseUnregistered
      );

      await expect(poll.connect(otherAccount).register()).to.be.revertedWith(
        'Registration phase not active'
      );
    });

    it('Should revert with right error if called in locked phase', async () => {
      const { poll, otherAccount } = await loadFixture(deployPollInLockedPhase);

      await expect(poll.connect(otherAccount).register()).to.be.revertedWith(
        'Registration phase not active'
      );
    });

    it('Should revert with right error if already registered', async () => {
      const { poll, otherAccount } = await loadFixture(deployPoll);

      await poll.connect(otherAccount).register();

      await expect(poll.connect(otherAccount).register()).to.be.revertedWith(
        'Already registered'
      );
    });

    it('Should not revert if unregistered', async () => {
      const { poll, otherAccount } = await loadFixture(deployPoll);

      await expect(poll.connect(otherAccount).register()).not.to.be.reverted;
    });

    it('Should update registered map', async () => {
      const { poll, otherAccount } = await loadFixture(
        deployPollInVotingPhaseRegistered
      );

      expect(await poll.registeredVoters(otherAccount)).to.equal(true);
    });

    it('Should update voter count', async () => {
      const { poll } = await loadFixture(deployPollInVotingPhaseRegistered);

      expect(await poll.numVoters()).to.equal(1);
    });
  });

  describe('Voting', () => {
    it('Should revert with right error if called in registration phase', async () => {
      const { poll, owner } = await loadFixture(deployPoll);

      await expect(poll.connect(owner).vote(1)).to.be.revertedWith(
        'Voting phase not active'
      );
    });

    it('Should be reverted with right error if called in locked phase', async () => {
      const { poll, owner } = await loadFixture(deployPollInLockedPhase);

      await expect(poll.connect(owner).vote(1)).to.be.revertedWith(
        'Voting phase not active'
      );
    });

    it('Should be reverted with right error if called by unregistered voter', async () => {
      const { poll, otherAccount } = await loadFixture(
        deployPollInVotingPhaseUnregistered
      );

      await expect(poll.connect(otherAccount).vote(1)).to.be.revertedWith(
        'Not registered'
      );
    });

    it('Should not be reverted if called in voting phase', async () => {
      const { poll, otherAccount } = await loadFixture(
        deployPollInVotingPhaseRegistered
      );

      await expect(poll.connect(otherAccount).vote(1)).not.to.be.reverted;
    });

    it('Should update votes list', async () => {
      const { poll, otherAccount } = await loadFixture(
        deployPollInVotingPhaseRegistered
      );

      await poll.connect(otherAccount).vote(1);

      expect(await poll.getVotes()).to.deep.equal([
        0, 1, 0, 0, 0, 0, 0, 0, 0, 0,
      ]);
    });

    it('Should remove voter from registered voters', async () => {
      const { poll, otherAccount } = await loadFixture(
        deployPollInVotingPhaseRegistered
      );

      await poll.connect(otherAccount).vote(1);

      expect(await poll.registeredVoters(otherAccount)).to.equal(false);
    });
  });

  describe('Events', () => {
    it('Should emit an event on registration', async () => {
      const { poll, otherAccount } = await loadFixture(deployPoll);

      await expect(poll.connect(otherAccount).register())
        .to.emit(poll, 'Register')
        .withArgs(otherAccount.address);
    });

    it('Should emit an event on vote', async () => {
      const { poll, otherAccount } = await loadFixture(
        deployPollInVotingPhaseRegistered
      );

      await expect(poll.connect(otherAccount).vote(1))
        .to.emit(poll, 'Vote')
        .withArgs(1);
    });

    it('Should emit an event on change to voting phase', async () => {
      const { poll, owner } = await loadFixture(deployPoll);

      await expect(poll.connect(owner).nextPhase())
        .to.emit(poll, 'PhaseChange')
        .withArgs(1);
    });

    it('Should emit an event on change to locked phase', async () => {
      const { poll, owner } = await loadFixture(
        deployPollInVotingPhaseRegistered
      );

      await expect(poll.connect(owner).nextPhase())
        .to.emit(poll, 'PhaseChange')
        .withArgs(2);
    });
  });
});
