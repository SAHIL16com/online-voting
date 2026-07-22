import React, { createContext, useContext, useState, useEffect } from 'react';

const VotersContext = createContext();

export const VotersProvider = ({ children }) => {
  const [voters, setVoters] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchVoters = async (token) => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/voters', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setVoters(data);
      }
    } catch (err) {
      console.error('Failed to fetch voters:', err);
    } finally {
      setLoading(false);
    }
  };

  const addVoter = async (voterData, token) => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/voters', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(voterData),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Failed to add voter');
      }

      const newVoter = await response.json();
      setVoters((prev) => [newVoter, ...prev]);
      return newVoter;
    } finally {
      setLoading(false);
    }
  };

  const updateVoter = async (id, voterData, token) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/auth/voters/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(voterData),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Failed to update voter');
      }

      const updated = await response.json();
      setVoters((prev) =>
        prev.map((item) => (item._id === id ? updated : item))
      );
      return updated;
    } finally {
      setLoading(false);
    }
  };

  const deleteVoter = async (id, token) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/auth/voters/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Failed to delete voter');
      }

      setVoters((prev) => prev.filter((item) => item._id !== id));
    } finally {
      setLoading(false);
    }
  };

  const getProcessedVoters = () => {
    return voters.map((v) => ({
      id: v._id,
      _id: v._id,
      name: v.fullName,
      voterId: v.voterId,
      email: v.email,
      status: v.isVerified ? 'Active' : 'Pending',
      verification: v.isVerified ? 'Verified' : 'Un-verified',
      avatar: v.avatar || '/candidate_priya.png',
      phone: v.phone || '',
      address: v.address || '',
      dob: v.dob || '',
      gender: v.gender || ''
    }));
  };

  return (
    <VotersContext.Provider
      value={{
        voters: getProcessedVoters(),
        rawVoters: voters,
        loading,
        fetchVoters,
        addVoter,
        updateVoter,
        deleteVoter,
      }}
    >
      {children}
    </VotersContext.Provider>
  );
};

export const useVoters = () => useContext(VotersContext);
