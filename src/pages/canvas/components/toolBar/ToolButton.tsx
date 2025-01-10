import React from "react";

interface ToolButtonProps {
  onClick: () => void;
  disabled: boolean;
  title: string;
  children?: React.ReactNode; 
}

const ToolButton: React.FC<ToolButtonProps> = ({ onClick, disabled = false, title, children }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
    >
      {children}
    </button>
  );
};

export default ToolButton;
