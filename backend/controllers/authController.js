import jwt from 'jsonwebtoken';
import User, { getUserModelByRole, getUserModelByDb } from '../models/User.js';
import cloudinary from '../config/cloudinary.js';

// Helper to generate JWT token
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'super_secret_jwt_voting_system_key_2026',
    {
      expiresIn: process.env.JWT_EXPIRE || '30d',
    }
  );
};

// @desc    Register a new user (Voter goes to 'test' DB, Admin goes to 'voting' DB)
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  try {
    const { fullName, email, password, role, voterId, phone } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: 'Please provide full name, email, and password' });
    }

    const userRole = role === 'admin' ? 'admin' : 'voter';
    
    // Disallow public voter registration
    if (userRole === 'voter') {
      return res.status(400).json({ message: 'Voter registration is disabled. Voter accounts must be created by an Administrator.' });
    }

    const UserModel = getUserModelByRole(userRole);

    // Check if user already exists in target database or alternate database
    const userExistsInTarget = await UserModel.findOne({ email });
    const userExistsInAlt = await getUserModelByDb(userRole === 'admin' ? 'test' : 'voting').findOne({ email });

    if (userExistsInTarget || userExistsInAlt) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Check voterId uniqueness if provided
    if (voterId) {
      const voterIdExists = await UserModel.findOne({ voterId });
      if (voterIdExists) {
        return res.status(400).json({ message: 'Voter ID is already registered' });
      }
    }

    const user = await UserModel.create({
      fullName,
      email,
      password,
      role: userRole,
      voterId: voterId || undefined,
      phone: phone || '',
    });

    if (user) {
      console.log(`[DB Action] Registered ${userRole} '${email}' in database: ${userRole === 'admin' ? 'voting' : 'test'}`);
      return res.status(201).json({
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        voterId: user.voterId,
        phone: user.phone,
        address: user.address,
        avatar: user.avatar,
        token: generateToken(user._id),
      });
    } else {
      return res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Registration Error:', error);
    return res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Authenticate user & get token (Voter / Admin)
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const userRole = role === 'admin' ? 'admin' : 'voter';
    let UserModel = getUserModelByRole(userRole);
    let user = await UserModel.findOne({
      $or: [{ email: email }, { voterId: email }]
    });

    // Fallback to check alternate database if not found in expected role database
    if (!user) {
      const altRole = userRole === 'admin' ? 'voter' : 'admin';
      UserModel = getUserModelByRole(altRole);
      user = await UserModel.findOne({
        $or: [{ email: email }, { voterId: email }]
      });
    }

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Optional role check if client specified expected role
    if (role && user.role !== role) {
      return res.status(403).json({
        message: `Account found, but role mismatch. Expected '${role}', but account is '${user.role}'`,
      });
    }

    // Check password match
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    return res.json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      voterId: user.voterId,
      phone: user.phone,
      address: user.address,
      avatar: user.avatar,
      adminId: user.adminId,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error('Login Error:', error);
    return res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/profile
// @access  Private
export const getUserProfile = async (req, res) => {
  try {
    const UserModel = getUserModelByRole(req.user.role);
    const user = await UserModel.findById(req.user._id).select('-password');
    if (user) {
      return res.json(user);
    } else {
      return res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Update user profile data
// @route   PUT /api/auth/profile
// @access  Private
export const updateUserProfile = async (req, res) => {
  try {
    const UserModel = getUserModelByRole(req.user.role);
    const user = await UserModel.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { fullName, email, phone, address, voterId } = req.body;

    if (email && email !== user.email) {
      const emailExistsInVoting = await getUserModelByDb('voting').findOne({ email });
      const emailExistsInTest = await getUserModelByDb('test').findOne({ email });

      if (emailExistsInVoting || emailExistsInTest) {
        return res.status(400).json({ message: 'Email address is already in use' });
      }
      user.email = email;
    }

    if (fullName) user.fullName = fullName;
    if (phone !== undefined) user.phone = phone;
    if (address !== undefined) user.address = address;
    if (voterId !== undefined) user.voterId = voterId || undefined;

    const updatedUser = await user.save();

    return res.json({
      _id: updatedUser._id,
      fullName: updatedUser.fullName,
      email: updatedUser.email,
      role: updatedUser.role,
      voterId: updatedUser.voterId,
      phone: updatedUser.phone,
      address: updatedUser.address,
      avatar: updatedUser.avatar,
      token: generateToken(updatedUser._id),
    });
  } catch (error) {
    console.error('Update Profile Error:', error);
    return res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Upload avatar image strictly to Cloudinary and store returned URL link in MongoDB
// @route   POST /api/auth/upload-avatar
// @access  Private
export const uploadAvatar = async (req, res) => {
  try {
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({ message: 'Please provide image file data to upload' });
    }

    const UserModel = getUserModelByRole(req.user.role);
    const user = await UserModel.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Upload image to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(image, {
      folder: 'voting_profiles',
      resource_type: 'auto',
    });

    if (!uploadResult || !uploadResult.secure_url) {
      return res.status(500).json({ message: 'Failed to obtain image URL from Cloudinary' });
    }

    const cloudinaryUrl = uploadResult.secure_url;
    console.log(`[Cloudinary Success] Image saved to Cloudinary: ${cloudinaryUrl}`);

    // Store ONLY Cloudinary URL link in MongoDB target DB
    user.avatar = cloudinaryUrl;
    await user.save();

    return res.json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      voterId: user.voterId,
      phone: user.phone,
      address: user.address,
      avatar: user.avatar, // Cloudinary image URL link
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error('Cloudinary Upload Error:', error);
    return res.status(400).json({ 
      message: `Cloudinary Upload Failed: ${error.message || 'Invalid signature or credentials'}. Please verify CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET in backend/.env` 
    });
  }
};

// @desc    Get all voters
// @route   GET /api/auth/voters
// @access  Private/Admin
export const getVoters = async (req, res) => {
  try {
    const VoterModel = getUserModelByDb('test');
    const voters = await VoterModel.find({ role: 'voter', adminId: req.user._id }).sort({ createdAt: -1 });
    return res.json(voters);
  } catch (error) {
    console.error('Get Voters Error:', error);
    return res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Create a new voter (Admin only)
// @route   POST /api/auth/voters
// @access  Private/Admin
export const createVoter = async (req, res) => {
  try {
    const { fullName, email, password, voterId, phone, address, dob, gender, status } = req.body;

    if (!fullName || !email || !password || !voterId) {
      return res.status(400).json({ message: 'Please provide full name, email, password, and voter ID' });
    }

    const VoterModel = getUserModelByDb('test');

    // Check if voter already exists by email or voterId in test database
    const voterExists = await VoterModel.findOne({
      $or: [{ email }, { voterId }]
    });

    if (voterExists) {
      return res.status(400).json({ message: 'A voter with this email or Voter ID already exists' });
    }

    const voter = await VoterModel.create({
      fullName,
      email,
      password,
      role: 'voter',
      voterId,
      phone: phone || '',
      address: address || '',
      dob: dob || '',
      gender: gender !== 'Select gender' ? gender : '',
      isVerified: true,
      adminId: req.user._id
    });

    console.log(`[DB Action] Admin created voter account '${email}' with Voter ID '${voterId}'`);
    return res.status(201).json(voter);
  } catch (error) {
    console.error('Create Voter Error:', error);
    return res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Update a voter (Admin only)
// @route   PUT /api/auth/voters/:id
// @access  Private/Admin
export const updateVoter = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, email, password, voterId, phone, address, dob, gender } = req.body;

    const VoterModel = getUserModelByDb('test');
    const voter = await VoterModel.findOne({ _id: id, adminId: req.user._id });

    if (!voter) {
      return res.status(404).json({ message: 'Voter not found or not authorized' });
    }

    // Check unique email and voter ID if modified
    if (email && email !== voter.email) {
      const emailExists = await VoterModel.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ message: 'Email address is already in use' });
      }
      voter.email = email;
    }

    if (voterId && voterId !== voter.voterId) {
      const idExists = await VoterModel.findOne({ voterId });
      if (idExists) {
        return res.status(400).json({ message: 'Voter ID is already in use' });
      }
      voter.voterId = voterId;
    }

    if (fullName) voter.fullName = fullName;
    if (phone !== undefined) voter.phone = phone;
    if (address !== undefined) voter.address = address;
    if (dob !== undefined) voter.dob = dob;
    if (gender !== undefined && gender !== 'Select gender') voter.gender = gender;
    
    if (password) {
      voter.password = password;
    }

    const updated = await voter.save();
    return res.json(updated);
  } catch (error) {
    console.error('Update Voter Error:', error);
    return res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Delete a voter (Admin only)
// @route   DELETE /api/auth/voters/:id
// @access  Private/Admin
export const deleteVoter = async (req, res) => {
  try {
    const { id } = req.params;
    const VoterModel = getUserModelByDb('test');
    const voter = await VoterModel.findOneAndDelete({ _id: id, adminId: req.user._id });

    if (!voter) {
      return res.status(404).json({ message: 'Voter not found or not authorized' });
    }

    console.log(`[DB Action] Deleted voter account ID '${id}'`);
    return res.json({ message: 'Voter account deleted successfully' });
  } catch (error) {
    console.error('Delete Voter Error:', error);
    return res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Please provide current and new passwords' });
    }

    const UserModel = getUserModelByRole(req.user.role);
    const user = await UserModel.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    console.log(`[DB Action] User '${user.email}' updated their password successfully`);
    return res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change Password Error:', error);
    return res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Delete user account (Voter or Admin) after password confirmation
// @route   POST /api/auth/delete-account
// @access  Private
export const deleteAccount = async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: 'Please confirm password to delete account' });
    }

    const UserModel = getUserModelByRole(req.user.role);
    const user = await UserModel.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Password confirmation failed' });
    }

    await UserModel.findByIdAndDelete(req.user._id);
    console.log(`[DB Action] Profile completely removed from database: '${user.email}'`);

    return res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Delete Account Error:', error);
    return res.status(500).json({ message: error.message || 'Server Error' });
  }
};
