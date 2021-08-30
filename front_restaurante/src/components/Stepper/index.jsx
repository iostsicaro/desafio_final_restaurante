import React from 'react';
import './styles.css';

export default function Stepper({ step }) {
  return (
    <div className="stepbox">
      {
        step.map((elemento) => (
          <div className={`step ${elemento.status}`}>
            {elemento.valor}
          </div>
        ))
      }
    </div>
  );
}
