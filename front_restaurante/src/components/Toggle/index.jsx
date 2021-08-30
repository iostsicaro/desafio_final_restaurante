import React from 'react';
import './styles.css';

export default function Toggle({
  label, value, setValue,
}) {
  return (
    <div className="flex-row">
      <div
        className={`toggle-out ${value && 'ativada'}`}
        onClick={() => setValue(!value)}
      >
        <div className={`toggle-in ${value && 'ativada'}`} />
      </div>
      <span className="toggle-text">{label}</span>
    </div>
  );
}
