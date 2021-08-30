import React from 'react';
import './styles.css';
import WarnIcon from '../../assets/warning.svg';

export default function Snackbar({ openSnack, setOpenSnack, mensagem }) {
  return (
    <>
      <div
        className={`snackbar ${mensagem && mensagem.status} ${openSnack && 'aberta'}`}
        onClick={() => setOpenSnack(false)}
      >
        {openSnack && (
          <>
            <div className="icone-alerta">
              <img
                src={mensagem && mensagem.status === 'erro' && WarnIcon}
                alt=""
              />
            </div>
            <span>
              {mensagem && mensagem.texto}
            </span>
          </>
        )}
      </div>
    </>
  );
}
