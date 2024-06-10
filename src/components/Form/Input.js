import React from 'react';
import "./Input.css";

const Input = ({value,type,label,className,...props}) => {
    
  return (
    <div className={`inputComponent ${className}`}>
     <input
        placeholder={label && label}
        type={type}
        value={value}
        {...props}
      />
    </div>
  )
}

export default Input;