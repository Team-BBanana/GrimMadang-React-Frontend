import React, { createContext, useContext, useState } from 'react';

interface ButtonPosition {
  top: number;
  left: number;
  width: number;
  height: number;
}

interface ToolPositions {
  [key: string]: ButtonPosition;
}

const ToolPositionContext = createContext<{
  positions: ToolPositions;
  updatePositions: (newPositions: ToolPositions) => void;
}>({
  positions: {},
  updatePositions: () => {},
});

export const ToolPositionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [positions, setPositions] = useState<ToolPositions>({});

  const updatePositions = (newPositions: ToolPositions) => {
    setPositions(newPositions);
  };

  return (
    <ToolPositionContext.Provider value={{ positions, updatePositions }}>
      {children}
    </ToolPositionContext.Provider>
  );
};

export const useToolPosition = () => useContext(ToolPositionContext);
