import React, { createContext, useContext, useState, useEffect } from 'react';

const ElectionsContext = createContext();

export const ElectionsProvider = ({ children }) => {
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchElections = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/elections');
      if (response.ok) {
        const data = await response.json();
        setElections(data);
      }
    } catch (err) {
      console.error('Failed to fetch elections:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchElections();
  }, []);

  const addElection = async (electionData, token) => {
    setLoading(true);
    try {
      const response = await fetch('/api/elections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(electionData),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Failed to create election');
      }

      const newElection = await response.json();
      setElections((prev) => [newElection, ...prev]);
      return newElection;
    } finally {
      setLoading(false);
    }
  };

  const updateElection = async (id, electionData, token) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/elections/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(electionData),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Failed to update election');
      }

      const updated = await response.json();
      setElections((prev) =>
        prev.map((item) => (item._id === id ? updated : item))
      );
      return updated;
    } finally {
      setLoading(false);
    }
  };

  const toggleElectionStatus = async (id, token) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/elections/${id}/toggle-status`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Failed to toggle election status');
      }

      const updated = await response.json();
      setElections((prev) =>
        prev.map((item) => (item._id === id ? updated : item))
      );
      return updated;
    } finally {
      setLoading(false);
    }
  };

  const deleteElection = async (id, token) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/elections/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Failed to delete election');
      }

      setElections((prev) => prev.filter((item) => item._id !== id));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ElectionsContext.Provider
      value={{
        elections,
        loading,
        fetchElections,
        addElection,
        updateElection,
        toggleElectionStatus,
        deleteElection,
      }}
    >
      {children}
    </ElectionsContext.Provider>
  );
};

export const useElections = () => useContext(ElectionsContext);
