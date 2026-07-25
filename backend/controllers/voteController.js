import getVoteModel from '../models/Vote.js';
import getCandidateModel from '../models/Candidate.js';
import getElectionModel from '../models/Election.js';

// @desc    Cast a vote in an election
// @route   POST /api/votes/cast
// @access  Private/Voter
export const castVote = async (req, res) => {
  try {
    const { electionId, candidateId } = req.body;
    const voterId = req.user._id;

    if (!electionId || !candidateId) {
      return res.status(400).json({ message: 'Election ID and Candidate ID are required' });
    }

    const Vote = getVoteModel();
    const Candidate = getCandidateModel();
    const Election = getElectionModel();

    // 1. Verify election exists and is currently Active
    const election = await Election.findById(electionId);
    if (!election) {
      return res.status(404).json({ message: 'Election not found' });
    }
    if (election.status !== 'Active') {
      return res.status(400).json({ message: 'Voting is not active for this election' });
    }

    // Verify ecosystem boundary: voter's adminId must match election's adminId
    if (election.adminId && req.user.adminId && election.adminId.toString() !== req.user.adminId.toString()) {
      return res.status(403).json({ message: 'You are not authorized to vote in this election (ecosystem mismatch)' });
    }

    // 2. Check if the voter has already voted in this election
    const alreadyVoted = await Vote.findOne({ voter: voterId, election: electionId });
    if (alreadyVoted) {
      return res.status(400).json({ message: 'You have already casted your vote in this election' });
    }

    // 3. Verify candidate is shortlisted for this election
    const isCandidateShortlisted = election.candidates.some(
      (cId) => cId.toString() === candidateId.toString()
    );
    if (!isCandidateShortlisted) {
      return res.status(400).json({ message: 'Selected candidate is not shortlisted for this election' });
    }

    // 4. Create Vote record
    const voteRecord = await Vote.create({
      voter: voterId,
      election: electionId,
      candidate: candidateId,
    });

    // 5. Increment Candidate's votes count
    const candidate = await Candidate.findById(candidateId);
    if (candidate) {
      candidate.votes = (candidate.votes || 0) + 1;
      await candidate.save();
    }

    console.log(`[DB Action] Voter '${req.user.email}' casted vote for Candidate '${candidate?.name}' in election '${election.name}'`);
    return res.status(201).json({ message: 'Vote casted successfully!', vote: voteRecord });
  } catch (error) {
    console.error('Cast Vote Error:', error);
    return res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Check if voter has voted in a particular election
// @route   GET /api/votes/check/:electionId
// @access  Private/Voter
export const checkHasVoted = async (req, res) => {
  try {
    const { electionId } = req.params;
    const voterId = req.user._id;

    const Vote = getVoteModel();
    const voteRecord = await Vote.findOne({ voter: voterId, election: electionId });

    return res.json({
      hasVoted: !!voteRecord,
      vote: voteRecord || null,
    });
  } catch (error) {
    console.error('Check Vote Status Error:', error);
    return res.status(500).json({ message: error.message || 'Server Error' });
  }
};
