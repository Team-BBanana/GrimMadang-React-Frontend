import React from 'react';
import style from './Button.module.css';

interface ButtonProps {
    type: 'button' | 'submit' | 'reset';
    onClick?: () => void;
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties; // 인라인 스타일을 추가
}

const Button: React.FC<ButtonProps> = ({ type, onClick, children, style: inlineStyle, className }) => {
    return (
        <button
            type={type}
            onClick={onClick}
            className={`${style.buttonContainer} ${className}`} // className을 추가로 지원
            style={inlineStyle} // 인라인 스타일을 버튼에 적용
        >
            {children}
        </button>
    );
};

export default Button;
