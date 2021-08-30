import React from 'react';
import './styles.css';

export default function InputValor({
  label, placeholder, value, setValue,
}) {
  return (
    <div className="flex-column input-value">
      <label htmlFor="value">{label}</label>
      <input
        id="value"
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <div className="cifrao">
        <span>R$</span>
      </div>
    </div>
  );
}
