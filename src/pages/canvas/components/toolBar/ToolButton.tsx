import React from "react";

interface ToolButtonProps {
  onClick: () => void;
  disabled?: boolean;
  title?: string;
  children: React.ReactNode;
  'data-tool'?: string;
}

const ToolButton: React.FC<ToolButtonProps> = ({ onClick, disabled, title, children, 'data-tool': dataTool }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      data-tool={dataTool}
    >
      {children}
    </button>
  );
};

export default ToolButton;
