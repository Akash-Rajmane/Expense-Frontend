import React from 'react';
import "./Dropdown.css";

const Dropdown = ({selectedOption,onChangeHandler,options,label,showLabelInSameRow=false}) => {

  return (
    <div className={showLabelInSameRow ? 'labelSameRow' : 'labelNewRow'}>
        <label htmlFor="dropdown" className={!showLabelInSameRow?'ddLabelNewRow':'ddLabelSameRow'}>{label}</label>
        <select 
            id="dropdown" 
            value={selectedOption}
            onChange={onChangeHandler}
            className="dropdownSelect"
        >
            {options.map(el=>{
                return <option key={el} value={el}>{el}</option>
            })}
        </select>
    </div>
  )
}

export default Dropdown;