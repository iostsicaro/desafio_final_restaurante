/* eslint-disable react/button-has-type */
import React, { useState, useEffect } from 'react';
import './styles.css';
import { get } from '../../services/ApiClient';
import SetaSelect from '../../assets/select-seta.svg';

export default function InputSelect({
  label, placeholder, value, setValue,
}) {
  const [drop, setDrop] = useState(false);
  const [categorias, setCategorias] = useState([]);

  async function listarCategorias() {
    try {
      const resposta = await get('categorias');
      const arrayCategorias = await resposta.json();
      setCategorias(arrayCategorias);
      return;
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    listarCategorias();
  }, []);

  function ativarDrop() {
    setDrop(!drop);
  }

  function selecionarCategoria(item) {
    setValue(item);
    setDrop(false);
  }

  return (
    <div className="flex-column input-select">
      <label htmlFor="select">{label}</label>
      <button
        type="button"
        onClick={() => ativarDrop()}
      >
        <input
          id="select"
          type="text"
          placeholder={placeholder}
          value={value.nome}
          onChange={(e) => setValue(e.target.value.nome)}
          disabled
        />
      </button>

      {drop && (
        <div className="select-drop">
          {
            categorias.map((item) => (
              <>
                <div
                  key={item.nome}
                  className="drop-itens"
                  onClick={() => selecionarCategoria(item)}
                >
                  {item.nome}
                </div>
              </>
            ))
          }
        </div>
      )}
      <img
        src={SetaSelect}
        className={`select-seta ${drop && 'baixo'}`}
        alt="seta"
        onClick={() => ativarDrop()}
      />
    </div>
  );
}
