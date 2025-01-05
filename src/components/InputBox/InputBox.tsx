import React, { forwardRef } from 'react';
import style from "./InputBox.module.css"

interface InputProps {
    type: string;
    id: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
    placeholder?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
    type, id, name, value, onChange, required = false, placeholder}, ref) => {

    return (
        <div className={style.inputBoxContainer} >
            <input className={style.inputBox}
                   type={type}
                   id={id}
                   name={name}
                   value={value}
                   onChange={onChange}
                   ref={ref}
                   required={required}
                   placeholder={placeholder}
            />
        </div>
    );
});
Input.displayName = "InputBox"

export default Input;