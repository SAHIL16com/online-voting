import mongoose from 'mongoose';

const voteSchema = new mongoose.Schema(
  {
    voter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Voter reference is required'],
    },
    election: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Election',
      required: [true, 'Election reference is required'],
    },
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Candidate',
      required: [true, 'Candidate reference is required'],
    },
  },
  {
    timestamps: true,
  }
);

// Enforce compound index to strictly prevent double voting
voteSchema.index({ voter: 1, election: 1 }, { unique: true });

// Votes are stored in the 'voting' database
export const getVoteModel = () => {
  return mongoose.connection.useDb('voting', { useCache: true }).model('Vote', voteSchema);
};

export default getVoteModel;
