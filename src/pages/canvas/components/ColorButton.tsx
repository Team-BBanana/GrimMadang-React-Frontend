import CheckIcon from "@/assets/svgs/check.svg?react";

type PenColorTypes = "red" | "orange" | "yellow" | "green" | "blue" | "indigo" | "purple" | "black";

export const COLOR_CODE = {
    red: "#FF0000",
    orange: "#FFA500",
    yellow: "#F7E600",
    green: "#008000",
    blue: "#0000FF",
    indigo: "#4B0082",
    purple: "#800080",
    black: "#000000"
};

interface ColorButtonProps {
    color: PenColorTypes;
    penColor: PenColorTypes;
    setPenColor: (color: PenColorTypes) => void;
}

const ColorButton = ({ color, penColor, setPenColor }: ColorButtonProps) => (
    <button
        className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform`}
        style={{ backgroundColor: COLOR_CODE[color] , border : "10px" , borderRadius : "50%", width: "40px" , height: "40px", margin : "3px"}}
        onClick={() => setPenColor(color)}
    >
        {penColor === color && <CheckIcon className="w-4 h-4 text-white" />}
    </button>
);

export default ColorButton;
export type { PenColorTypes };