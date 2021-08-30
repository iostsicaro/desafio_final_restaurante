import React from 'react';
import './styles.css';

export default function InputTexto({
  label, placeholder, value, setValue,
}) {
  return (
    <div className="flex-column">
      <label htmlFor="text">{label}</label>
      <input
        id="text"
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />

    </div>
  );
}
