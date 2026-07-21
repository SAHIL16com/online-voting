import React, { createContext, useContext, useState } from 'react';

const CandidatesContext = createContext();

export const CandidatesProvider = ({ children }) => {
  const [candidates, setCandidates] = useState([
    {
      id: 1,
      name: 'Priya Sharma',
      department: 'Computer Science',
      votes: 1601,
      displayVotes: '1,601',
      percentage: '40.5%',
      progress: 40.5,
      photo: '/candidate_priya.png',
      status: 'Active'
    },
    {
      id: 2,
      name: 'Rahul Verma',
      department: 'Mechanical',
      votes: 987,
      displayVotes: '987',
      percentage: '32.1%',
      progress: 32.1,
      photo: '/candidate_rahul.png',
      status: 'Active'
    },
    {
      id: 3,
      name: 'Aman Patel',
      department: 'Commerce',
      votes: 654,
      displayVotes: '654',
      percentage: '21.3%',
      progress: 21.3,
      photo: '/candidate_aman.png',
      status: 'Active'
    },
    {
      id: 4,
      name: 'Neha Singh',
      department: 'Science',
      votes: 196,
      displayVotes: '196',
      percentage: '6.1%',
      progress: 6.1,
      photo: '/candidate_neha.png',
      status: 'Active'
    }
  ]);

  const addCandidate = (newCand) => {
    setCandidates((prev) => [newCand, ...prev]);
  };

  const castVoteForCandidate = (candidateId) => {
    setCandidates((prev) => {
      const updated = prev.map((item) => {
        if (item.id === candidateId) {
          const newVoteCount = item.votes + 1;
          return {
            ...item,
            votes: newVoteCount,
            displayVotes: newVoteCount.toLocaleString()
          };
        }
        return item;
      });
      const total = updated.reduce((sum, c) => sum + c.votes, 0);
      return updated.map((c) => {
        const pct = ((c.votes / total) * 100).toFixed(1);
        return {
          ...c,
          percentage: `${pct}%`,
          progress: parseFloat(pct)
        };
      });
    });
  };

  return (
    <CandidatesContext.Provider
      value={{
        candidates,
        addCandidate,
        castVoteForCandidate
      }}
    >
      {children}
    </CandidatesContext.Provider>
  );
};

export const useCandidates = () => useContext(CandidatesContext);
