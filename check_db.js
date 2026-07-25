import dotenv from 'dotenv';
dotenv.config({ path: './backend/.env' });

import mongoose from 'mongoose';
import connectDB from './backend/config/db.js';
import getElectionModel from './backend/models/Election.js';
import getCandidateModel from './backend/models/Candidate.js';

const run = async () => {
  try {
    await connectDB();
    const Election = getElectionModel();
    const Candidate = getCandidateModel();
    
    const elections = await Election.find({}).populate('candidates');
    console.log('ALL ELECTIONS:', JSON.stringify(elections, null, 2));
    
    const allCands = await Candidate.find({});
    console.log('ALL CANDIDATES:', JSON.stringify(allCands, null, 2));
    
    mongoose.connection.close();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

run();
