import mongoose from 'mongoose';

const electionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Election name is required'],
      trim: true,
    },
    type: {
      type: String,
      default: 'Student',
    },
    description: {
      type: String,
      default: '',
    },
    startDate: {
      type: String,
      default: '',
    },
    startTime: {
      type: String,
      default: '',
    },
    endDate: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['Upcoming', 'Active', 'Completed', 'Cancelled'],
      default: 'Upcoming',
    },
    candidates: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Candidate',
      },
    ],
    banner: {
      type: String,
      default: '',
    },
    isPublished: {
      type: Boolean,
      default: false,
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

// Elections are stored in the 'voting' database
export const getElectionModel = () => {
  return mongoose.connection.useDb('voting', { useCache: true }).model('Election', electionSchema);
};

export default getElectionModel;
