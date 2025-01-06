import React from "react";

interface ToolButtonProps {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  onClick: () => void;
  disabled: boolean;
  title: string;
}

const ToolButton: React.FC<ToolButtonProps> = ({ icon: Icon, onClick, disabled = false, title }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
    >
      <Icon className={disabled ? "group-disabled:fill-white" : ""} />
    </button>
  );
};

export default ToolButton;
