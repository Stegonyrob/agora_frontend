// CustomInput.tsx
import React, { useState } from 'react';
import './CustomInput.scss';

interface CustomInputProps {
 type: string;
 modelValue: string;
 placeholder: string;
 required: boolean;
 icon: boolean;
 onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const CustomInput: React.FC<CustomInputProps> = ({ onChange, type, modelValue, placeholder, required, icon }) => {
 const [value, setValue] = useState(modelValue);

 const updateValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
    // Aquí puedes emitir el evento de actualización si es necesario
 };

 return (
    <div className="form-group">
      <input
        className={`form-control ${icon ? 'field-icon' : ''}`}
        type={type}
        value={value}
        placeholder={placeholder}
        required={required}
        onChange={updateValue}
      />
      {icon && <span className="fa fa-fw fa-eye field-icon toggle-password"></span>}
    </div>
 );
};

export default CustomInput;