import getElectionModel from '../models/Election.js';
import getCandidateModel from '../models/Candidate.js';
import getVoteModel from '../models/Vote.js';
import cloudinary from '../config/cloudinary.js';

// Helper to populate candidates and calculate their election-specific vote counts
const populateElectionWithSeparateVotes = async (electionDoc) => {
  if (!electionDoc) return null;
  const Vote = getVoteModel();
  
  // Populate candidates first
  const populated = await electionDoc.populate('candidates');
  const electionObj = populated.toObject();
  
  const processedCandidates = [];
  for (let cand of electionObj.candidates) {
    const voteCount = await Vote.countDocuments({ election: electionDoc._id, candidate: cand._id });
    processedCandidates.push({
      ...cand,
      votes: voteCount
    });
  }
  electionObj.candidates = processedCandidates;
  return electionObj;
};

// @desc    Get all elections
// @route   GET /api/elections
// @access  Private
export const getElections = async (req, res) => {
  try {
    const Election = getElectionModel();
    // Pre-load Candidate model on same DB to ensure populate works correctly
    getCandidateModel();

    let filter = {};
    if (req.user) {
      if (req.user.role === 'admin') {
        filter = { adminId: req.user._id };
      } else if (req.user.role === 'voter') {
        filter = { adminId: req.user.adminId };
      }
    }

    const elections = await Election.find(filter).sort({ createdAt: -1 });
    
    const processedElections = [];
    for (let election of elections) {
      const populated = await populateElectionWithSeparateVotes(election);
      processedElections.push(populated);
    }
    
    return res.json(processedElections);
  } catch (error) {
    console.error('Get Elections Error:', error);
    return res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Create a new election
// @route   POST /api/elections
// @access  Private/Admin
export const createElection = async (req, res) => {
  try {
    const {
      name,
      type,
      description,
      startDate,
      startTime,
      endDate,
      candidates,
      banner,
    } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Election name is required' });
    }

    let bannerUrl = '';
    if (banner && banner.startsWith('data:image')) {
      try {
        const uploadResult = await cloudinary.uploader.upload(banner, {
          folder: 'election_banners',
        });
        bannerUrl = uploadResult.secure_url;
      } catch (err) {
        console.error('Banner upload failed:', err.message);
      }
    }

    const Election = getElectionModel();
    const election = await Election.create({
      name,
      type: type !== 'Select type' ? type : 'Student',
      description: description || '',
      startDate: startDate || '',
      startTime: startTime || '',
      endDate: endDate || '',
      status: 'Upcoming',
      candidates: candidates || [],
      banner: bannerUrl,
      adminId: req.user._id,
    });

    const populated = await Election.findById(election._id);
    const processed = await populateElectionWithSeparateVotes(populated);
    return res.status(201).json(processed);
  } catch (error) {
    console.error('Create Election Error:', error);
    return res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Update election
// @route   PUT /api/elections/:id
// @access  Private/Admin
export const updateElection = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      type,
      description,
      startDate,
      startTime,
      endDate,
      candidates,
      banner,
      status,
      isPublished,
    } = req.body;

    const Election = getElectionModel();
    const election = await Election.findOne({ _id: id, adminId: req.user._id });

    if (!election) {
      return res.status(404).json({ message: 'Election not found or not authorized' });
    }

    if (name) election.name = name;
    if (type !== undefined && type !== 'Select type') election.type = type;
    if (description !== undefined) election.description = description;
    if (startDate !== undefined) election.startDate = startDate;
    if (startTime !== undefined) election.startTime = startTime;
    if (endDate !== undefined) election.endDate = endDate;
    if (candidates !== undefined) election.candidates = candidates;
    if (status !== undefined) election.status = status;
    if (isPublished !== undefined) election.isPublished = isPublished;

    if (banner && banner.startsWith('data:image')) {
      try {
        const uploadResult = await cloudinary.uploader.upload(banner, {
          folder: 'election_banners',
        });
        election.banner = uploadResult.secure_url;
      } catch (err) {
        console.error('Banner upload failed:', err.message);
      }
    }

    const updated = await election.save();
    const populated = await Election.findById(updated._id);
    const processed = await populateElectionWithSeparateVotes(populated);
    return res.json(processed);
  } catch (error) {
    console.error('Update Election Error:', error);
    return res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Toggle election status (Start/Stop)
// @route   PUT /api/elections/:id/toggle-status
// @access  Private/Admin
export const toggleElectionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const Election = getElectionModel();
    const election = await Election.findOne({ _id: id, adminId: req.user._id });

    if (!election) {
      return res.status(404).json({ message: 'Election not found or not authorized' });
    }

    // Toggle between Active & Completed
    if (election.status === 'Active') {
      election.status = 'Completed';
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const dd = String(today.getDate()).padStart(2, '0');
      election.endDate = `${yyyy}-${mm}-${dd}`;
    } else {
      election.status = 'Active';
      election.endDate = 'TBD';
    }

    const updated = await election.save();
    const populated = await Election.findById(updated._id);
    const processed = await populateElectionWithSeparateVotes(populated);
    console.log(`[DB Action] Toggled election '${election.name}' status to ${election.status}`);
    return res.json(processed);
  } catch (error) {
    console.error('Toggle Status Error:', error);
    return res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Delete election
// @route   DELETE /api/elections/:id
// @access  Private/Admin
export const deleteElection = async (req, res) => {
  try {
    const { id } = req.params;
    const Election = getElectionModel();
    const election = await Election.findOneAndDelete({ _id: id, adminId: req.user._id });

    if (!election) {
      return res.status(404).json({ message: 'Election not found or not authorized' });
    }

    console.log(`[DB Action] Deleted election ID '${id}'`);
    return res.json({ message: 'Election deleted successfully' });
  } catch (error) {
    console.error('Delete Election Error:', error);
    return res.status(500).json({ message: error.message || 'Server Error' });
  }
};
