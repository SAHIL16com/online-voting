import React, { createContext, useContext, useState, useEffect } from 'react';

const CandidatesContext = createContext();

export const CandidatesProvider = ({ children }) => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCandidates = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/candidates');
      if (response.ok) {
        const data = await response.json();
        setCandidates(data);
      }
    } catch (err) {
      console.error('Failed to fetch candidates:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  const addCandidate = async (candData, token) => {
    setLoading(true);
    try {
      const response = await fetch('/api/candidates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(candData),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Failed to add candidate');
      }

      const newCand = await response.json();
      setCandidates((prev) => [newCand, ...prev]);
      return newCand;
    } finally {
      setLoading(false);
    }
  };

  const updateCandidate = async (id, candData, token) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/candidates/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(candData),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Failed to update candidate');
      }

      const updated = await response.json();
      setCandidates((prev) =>
        prev.map((item) => (item._id === id ? updated : item))
      );
      return updated;
    } finally {
      setLoading(false);
    }
  };

  const deleteCandidate = async (id, token) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/candidates/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Failed to delete candidate');
      }

      setCandidates((prev) => prev.filter((item) => item._id !== id));
    } finally {
      setLoading(false);
    }
  };

  const getProcessedCandidates = () => {
    const totalVotes = candidates.reduce((sum, c) => sum + (c.votes || 0), 0);
    return candidates.map((c) => {
      const v = c.votes || 0;
      const pct = totalVotes > 0 ? ((v / totalVotes) * 100).toFixed(1) : '0.0';
      return {
        id: c._id,
        _id: c._id,
        name: c.name,
        department: c.partyGroup || 'General',
        votes: v,
        displayVotes: `${v.toLocaleString()} Votes`,
        percent: `${pct}%`,
        progress: parseFloat(pct),
        photo: c.photo || '/candidate_priya.png',
        status: c.status || 'Active',
        gender: c.gender || '',
        age: c.age || '',
        partySymbol: c.partySymbol || '',
        qualification: c.qualification || '',
        experience: c.experience || '',
        biography: c.biography || ''
      };
    });
  };

  return (
    <CandidatesContext.Provider
      value={{
        candidates: getProcessedCandidates(),
        rawCandidates: candidates,
        loading,
        fetchCandidates,
        addCandidate,
        updateCandidate,
        deleteCandidate
      }}
    >
      {children}
    </CandidatesContext.Provider>
  );
};

export const useCandidates = () => useContext(CandidatesContext);
