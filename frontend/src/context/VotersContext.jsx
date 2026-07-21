import React, { createContext, useContext, useState } from 'react';

const VotersContext = createContext();

export const VotersProvider = ({ children }) => {
  const [voters, setVoters] = useState([
    {
      id: 1,
      name: 'Priya Sharma',
      voterId: 'VOT01212343',
      email: 'priya@gmail.com',
      status: 'Active',
      verification: 'Verified',
      avatar: '/candidate_priya.png'
    },
    {
      id: 2,
      name: 'Rohit Verma',
      voterId: 'VOT01212344',
      email: 'rohit@gmail.com',
      status: 'Active',
      verification: 'Verified',
      avatar: '/candidate_rahul.png'
    },
    {
      id: 3,
      name: 'Neha Singh',
      voterId: 'VOT01212345',
      email: 'neha@gmail.com',
      status: 'Active',
      verification: 'Verified',
      avatar: '/candidate_neha.png'
    },
    {
      id: 4,
      name: 'Aman Kumar',
      voterId: 'VOT01212346',
      email: 'aman@gmail.com',
      status: 'Active',
      verification: 'Verified',
      avatar: '/candidate_aman.png'
    },
    {
      id: 5,
      name: 'John Doe',
      voterId: 'VOT01212347',
      email: 'john@gmail.com',
      status: 'Active',
      verification: 'Verified',
      avatar: '/candidate_aman.png'
    }
  ]);

  const addVoter = (newVoter) => {
    setVoters((prev) => [newVoter, ...prev]);
  };

  return (
    <VotersContext.Provider
      value={{
        voters,
        addVoter
      }}
    >
      {children}
    </VotersContext.Provider>
  );
};

export const useVoters = () => useContext(VotersContext);
