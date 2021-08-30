/* eslint-disable max-len */
import React, { useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import { get } from '../../services/ApiClient';
import './styles.css';
import Cabecalho from '../../components/Cabecalho';
import Card from '../../components/Card';
import ModalCadastrarProduto from '../../components/ModalCadastrarProduto';
import ModalEditarProduto from '../../components/ModalEditarProduto';
import Snackbar from '../../components/Snackbar';

export default function Dashboard() {
  const { token } = useAuth();

  const [produtos, setProdutos] = useState([]);

  const [modalCadastrarProduto, setModalCadastrarProduto] = useState(false);
  const [modalEditarProduto, setModalEditarProduto] = useState(false);
  const [produtoEditado, setProdutoEditado] = useState(null);
  const [cadastroProduto, setCadastroProduto] = useState(null);

  const [mensagem, setMensagem] = useState('');
  const [openSnack, setOpenSnack] = useState(false);

  async function onLoad() {
    try {
      const resposta = await get('produtos', token);

      if (resposta) {
        const arrayProdutos = await resposta.json();
        if (arrayProdutos.length === 0) {
          setProdutos();
          return;
        }
        setProdutos(arrayProdutos);
        return;
      }
    } catch (error) {
      setMensagem({ texto: error.message, status: 'erro' });
    }
  }

  useEffect(() => {
    onLoad();
  }, [
    modalCadastrarProduto,
    modalEditarProduto,
    cadastroProduto]);

  return (
    <div>
      {modalCadastrarProduto && (
        <ModalCadastrarProduto
          produto={cadastroProduto}
          setModalCadastrarProduto={setModalCadastrarProduto}
          setProdutoEditado={setCadastroProduto}
        />
      )}
      {modalEditarProduto && (
        <ModalEditarProduto
          produto={produtoEditado}
          setModalEditarProduto={setModalEditarProduto}
          setProdutoEditado={setProdutoEditado}
        />
      )}
      <div className={(modalCadastrarProduto || modalCadastrarProduto) && 'blurry'}>
        <Cabecalho />
        <div className={`sub-cabecalho ${!produtos && 'vazio'}`}>
          <div>
            <span>
              Você ainda não tem nenhum produto no seu cardápio.
              <br />
              Gostaria de adicionar um novo produto?
            </span>
          </div>
          <button
            className="aceitar"
            type="button"
            onClick={() => setModalCadastrarProduto(true)}
          >
            Adicionar produto ao cardápio
          </button>
        </div>
        {produtos && (
          <div className="container-produtos">
            {
              produtos.map((produto) => (
                <Card
                  key={produto.id}
                  produto={produto}
                  setModalEditarProduto={setModalEditarProduto}
                  setProdutoEditado={setProdutoEditado}
                />
              ))
            }
          </div>
        )}
      </div>
      <Snackbar
        mensagem={mensagem}
        openSnack={openSnack}
        setOpenSnack={setOpenSnack}
      />
    </div>
  );
}
