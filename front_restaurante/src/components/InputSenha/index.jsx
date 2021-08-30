import React, { useState } from 'react';
import './styles.css';
import IconEyeOpen from '../../assets/eyeOpen.svg';
import IconEyeClosed from '../../assets/eyeClosed.svg';

export default function InputSenha({
  label, placeholder, value, setValue,
}) {
  const [mostrarSenha, setMostrarSenha] = useState(false);

  return (
    <div className="flex-column input-password">
      <label htmlFor="password">{label}</label>
      <input
        id="password"
        type={mostrarSenha ? 'text' : 'password'}
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <img
        src={mostrarSenha ? IconEyeOpen : IconEyeClosed}
        className="eye-password"
        onClick={() => setMostrarSenha(!mostrarSenha)}
        alt="olhos"
      />
    </div>
  );
}
