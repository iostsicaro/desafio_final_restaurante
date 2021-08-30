import React from 'react';
import './styles.css';

export default function Textarea({
  label, placeholder, value, setValue, maxLength,
}) {
  return (
    <div className="flex-column">
      <label htmlFor="textarea">{label}</label>
      <textarea
        id="textarea"
        placeholder={placeholder}
        maxLength={maxLength}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <span className="contagem">{`Max.: ${maxLength} caracteres`}</span>
    </div>
  );
}
