import React, { useState, useRef } from 'react';
import './styles.css';
import Snackbar from '../Snackbar';
import editarPreco from '../../functions/editarPreco';
import { del } from '../../services/ApiClient';
import useAuth from '../../hooks/useAuth';

export default function Card({ produto, setModalEditarProduto, setProdutoEditado }) {
  const { token } = useAuth();

  const {
    id, nome, preco, descricao, url_imagem: urlImagem,
  } = produto;
  const [editando, setEditando] = useState(false);
  const novoPreco = preco.toString();
  const precoFormatado = useRef(editarPreco(novoPreco, true));

  const [mensagem, setMensagem] = useState('');
  const [openSnack, setOpenSnack] = useState(false);

  async function excluirProduto() {
    try {
      const resposta = await del(`produtos/${id}`, token);

      if (!resposta.ok) {
        const msg = await resposta.json();

        setMensagem({ texto: msg, status: 'erro' });
        setOpenSnack(true);
        return;
      }
      setMensagem({ texto: 'Produto excluído com sucesso.', status: 'sucesso' });
      setOpenSnack(true);
    } catch (error) {
      setMensagem({ texto: error.message, status: 'erro' });
      setOpenSnack(true);
    }
  }
  return (
    <>
      <div style={{ position: 'relative' }}>
        {editando && (
          <div className="botoes-edicao">
            <button
              className="excluir"
              type="button"
              onClick={() => excluirProduto(produto)}
            >
              Excluir produto do catálogo
            </button>
            <button
              className="aceitar"
              type="button"
              onClick={() => {
                setModalEditarProduto(true);
                setProdutoEditado(produto);
              }}
            >
              Editar produto
            </button>
          </div>
        )}
        <div
          className={editando ? 'card blur' : 'card'}
          onClick={() => setEditando(!editando)}
        >
          <div className="flex-column">
            <span className="card-titulo">{nome}</span>
            <span className="card-texto">{descricao}</span>
            <div className="card-preco">{precoFormatado.current}</div>
          </div>
          <div className="imagem-card">
            <img src={urlImagem} alt={nome} />
          </div>
        </div>
      </div>
      <Snackbar
        mensagem={mensagem}
        openSnack={openSnack}
        setOpenSnack={setOpenSnack}
      />
    </>
  );
}
