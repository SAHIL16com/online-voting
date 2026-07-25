import getCandidateModel from '../models/Candidate.js';
import cloudinary from '../config/cloudinary.js';

// @desc    Get all candidates
// @route   GET /api/candidates
// @access  Private
export const getCandidates = async (req, res) => {
  try {
    const Candidate = getCandidateModel();
    let filter = {};
    if (req.user) {
      if (req.user.role === 'admin') {
        filter = { adminId: req.user._id };
      } else if (req.user.role === 'voter') {
        filter = { adminId: req.user.adminId };
      }
    }
    const candidates = await Candidate.find(filter).sort({ createdAt: -1 });
    return res.json(candidates);
  } catch (error) {
    console.error('Get Candidates Error:', error);
    return res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Create a new candidate
// @route   POST /api/candidates
// @access  Private/Admin
export const createCandidate = async (req, res) => {
  try {
    const {
      name,
      gender,
      partyGroup,
      age,
      qualification,
      experience,
      biography,
      photo,
      partySymbol,
    } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Candidate name is required' });
    }

    let photoUrl = '/candidate_priya.png';
    let symbolUrl = '';

    // Upload candidate photo to Cloudinary if provided as base64/URL
    if (photo && photo.startsWith('data:image')) {
      try {
        const uploadResult = await cloudinary.uploader.upload(photo, {
          folder: 'candidate_photos',
        });
        photoUrl = uploadResult.secure_url;
      } catch (uploadErr) {
        console.error('Candidate photo upload failed, using default:', uploadErr.message);
      }
    }

    // Upload party symbol to Cloudinary if provided as base64/URL
    if (partySymbol && partySymbol.startsWith('data:image')) {
      try {
        const uploadResult = await cloudinary.uploader.upload(partySymbol, {
          folder: 'party_symbols',
        });
        symbolUrl = uploadResult.secure_url;
      } catch (uploadErr) {
        console.error('Party symbol upload failed:', uploadErr.message);
      }
    }

    const Candidate = getCandidateModel();
    const candidate = await Candidate.create({
      name,
      gender: gender !== 'Select gender' ? gender : '',
      partyGroup: partyGroup || 'General',
      age: age ? Number(age) : undefined,
      qualification: qualification || '',
      experience: experience || '',
      biography: biography || '',
      photo: photoUrl,
      partySymbol: symbolUrl,
      votes: 0,
      status: 'Active',
      adminId: req.user._id,
    });

    console.log(`[DB Action] Created candidate '${name}' in voting database`);
    return res.status(201).json(candidate);
  } catch (error) {
    console.error('Create Candidate Error:', error);
    return res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Update candidate details
// @route   PUT /api/candidates/:id
// @access  Private/Admin
export const updateCandidate = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      gender,
      partyGroup,
      age,
      qualification,
      experience,
      biography,
      photo,
      partySymbol,
      status,
    } = req.body;

    const Candidate = getCandidateModel();
    const candidate = await Candidate.findOne({ _id: id, adminId: req.user._id });

    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found or not authorized' });
    }

    if (name) candidate.name = name;
    if (gender !== undefined && gender !== 'Select gender') candidate.gender = gender;
    if (partyGroup !== undefined) candidate.partyGroup = partyGroup;
    if (age !== undefined) candidate.age = age ? Number(age) : undefined;
    if (qualification !== undefined) candidate.qualification = qualification;
    if (experience !== undefined) candidate.experience = experience;
    if (biography !== undefined) candidate.biography = biography;
    if (status !== undefined) candidate.status = status;

    // Upload candidate photo to Cloudinary if updated
    if (photo && photo.startsWith('data:image')) {
      try {
        const uploadResult = await cloudinary.uploader.upload(photo, {
          folder: 'candidate_photos',
        });
        candidate.photo = uploadResult.secure_url;
      } catch (uploadErr) {
        console.error('Candidate photo upload failed:', uploadErr.message);
      }
    }

    // Upload party symbol to Cloudinary if updated
    if (partySymbol && partySymbol.startsWith('data:image')) {
      try {
        const uploadResult = await cloudinary.uploader.upload(partySymbol, {
          folder: 'party_symbols',
        });
        candidate.partySymbol = uploadResult.secure_url;
      } catch (uploadErr) {
        console.error('Party symbol upload failed:', uploadErr.message);
      }
    }

    const updated = await candidate.save();
    return res.json(updated);
  } catch (error) {
    console.error('Update Candidate Error:', error);
    return res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Delete candidate
// @route   DELETE /api/candidates/:id
// @access  Private/Admin
export const deleteCandidate = async (req, res) => {
  try {
    const { id } = req.params;
    const Candidate = getCandidateModel();
    const candidate = await Candidate.findOneAndDelete({ _id: id, adminId: req.user._id });

    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found or not authorized' });
    }

    console.log(`[DB Action] Deleted candidate ID '${id}' from voting database`);
    return res.json({ message: 'Candidate removed successfully' });
  } catch (error) {
    console.error('Delete Candidate Error:', error);
    return res.status(500).json({ message: error.message || 'Server Error' });
  }
};
