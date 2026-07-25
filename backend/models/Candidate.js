import mongoose from 'mongoose';

const candidateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Candidate name is required'],
      trim: true,
    },
    gender: {
      type: String,
      default: '',
    },
    partyGroup: {
      type: String,
      default: 'General',
      trim: true,
    },
    age: {
      type: Number,
    },
    partySymbol: {
      type: String,
      default: '',
    },
    qualification: {
      type: String,
      default: '',
    },
    experience: {
      type: String,
      default: '',
    },
    biography: {
      type: String,
      default: '',
    },
    photo: {
      type: String,
      default: '/candidate_priya.png',
    },
    votes: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive'],
      default: 'Active',
    },
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// Candidates are stored in the 'voting' database
export const getCandidateModel = () => {
  return mongoose.connection.useDb('voting', { useCache: true }).model('Candidate', candidateSchema);
};

export default getCandidateModel;
