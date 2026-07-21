import React, { createContext, useContext, useState } from 'react';

const ElectionsContext = createContext();

export const ElectionsProvider = ({ children }) => {
  const [elections, setElections] = useState([
    {
      id: 1,
      name: 'College President Election 2024',
      type: 'Student',
      startDate: '01 May 2024',
      endDate: '31 May 2024',
      status: 'Active',
      isPublished: false
    },
    {
      id: 2,
      name: 'Student Council Election 2024',
      type: 'Student',
      startDate: '10 May 2024',
      endDate: '25 May 2024',
      status: 'Active',
      isPublished: false
    },
    {
      id: 3,
      name: 'Sports Head Election 2024',
      type: 'Student',
      startDate: '15 May 2024',
      endDate: '30 May 2024',
      status: 'Active',
      isPublished: false
    },
    {
      id: 4,
      name: 'Cultural Head Election 2024',
      type: 'Student',
      startDate: '20 May 2024',
      endDate: '05 Jun 2024',
      status: 'Upcoming',
      isPublished: false
    },
    {
      id: 5,
      name: 'Department Head Election',
      type: 'Staff',
      startDate: '01 Apr 2024',
      endDate: '20 Apr 2024',
      status: 'Completed',
      isPublished: true
    }
  ]);

  const addElection = (newElection) => {
    setElections((prev) => [newElection, ...prev]);
  };

  const togglePublishResult = (id) => {
    setElections((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isPublished: !item.isPublished } : item
      )
    );
  };

  return (
    <ElectionsContext.Provider
      value={{
        elections,
        addElection,
        togglePublishResult
      }}
    >
      {children}
    </ElectionsContext.Provider>
  );
};

export const useElections = () => useContext(ElectionsContext);
