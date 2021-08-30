/* eslint-disable no-console */
import React, { useState } from 'react';
import imageToBase64 from 'image-to-base64/browser';
import useAuth from '../../hooks/useAuth';
import { put } from '../../services/ApiClient';
import './styles.css';
import editarPreco from '../../functions/editarPreco';
import conferirPreco from '../../functions/conferirPreco';
import guardarPreco from '../../functions/guardarPreco';
import uploadImagem from '../../functions/uploadImagem';
import InputImagem from '../InputImagem';
import InputTexto from '../InputTexto';
import InputValor from '../InputValor';
import Textarea from '../Textarea';
import Toggle from '../Toggle';
import Snackbar from '../Snackbar';

export default function ModalEditarProduto({ produto, setModalEditarProduto, setProdutoEditado }) {
  const { token } = useAuth();
  const precoEditado = editarPreco(produto.preco);

  const [nome, setNome] = useState(produto.nome);
  const [descricao, setDescricao] = useState(produto.descricao);
  const [preco, setPreco] = useState(precoEditado);
  const [ativo, setAtivo] = useState(produto.ativo);
  const [permiteObservacoes, setPermiteObservacoes] = useState(produto.permite_observacoes);
  const [urlImagem, setUrlImagem] = useState(produto.url_imagem);

  const [mensagem, setMensagem] = useState('');
  const [openSnack, setOpenSnack] = useState(false);

  async function atualizarProduto(event) {
    event.preventDefault();

    if (!conferirPreco(preco)) {
      setMensagem({ texto: 'Valor inválido. O valo informado deve ter o formato: R$ XX,XX', status: 'erro' });
      setOpenSnack(true);
      return;
    }

    if (!nome) {
      setMensagem({ texto: 'Nome é um campo obrigatório.', status: 'erro' });
      setOpenSnack(true);
      return;
    }

    const editarProduto = {
      nome,
      descricao,
      preco: guardarPreco(preco),
      ativo,
      permiteObservacoes,
      urlImagem,
    };

    try {
      const base64Imagem = await imageToBase64(urlImagem);

      const idImagem = Math.floor(Math.random() * 10000);

      const imagemSalva = {
        nome: `produtos/${produto.restaurante_id}/${idImagem}`,
        imagem: base64Imagem,
      };

      const novaUrl = await uploadImagem(imagemSalva, token);

      editarProduto.urlImagem = novaUrl;

      const resposta = await put(`produtos/${produto.id}`, editarProduto, token);

      if (!resposta.ok) {
        const msg = await resposta.json();

        setMensagem(msg);
        setOpenSnack(true);
        return;
      }

      setMensagem({ texto: 'Produto atualizado com sucesso!', status: 'sucesso' });
      setOpenSnack(true);
      setModalEditarProduto(false);
      setProdutoEditado(null);
    } catch (error) {
      setMensagem({ texto: error.message, status: 'erro' });
      setOpenSnack(true);
    }
  }

  // async function ativarProduto(event) {
  //   event.preventDefault();

  // }

  // async function desativarProduto(event) {
  //   event.preventDefault();
  // }

  function cancelar() {
    setModalEditarProduto(false);
    setProdutoEditado(null);
  }

  return (
    <>
      <div className="modal">
        <div className="base n-produto">
          <div className="title-box">
            <span className="titulo pagina">Editar produto</span>
          </div>
          <form onSubmit={(event) => atualizarProduto(event)}>
            <div className="flex-row">
              <div className="modal-colunas">
                <InputTexto
                  label="Nome"
                  value={nome}
                  setValue={setNome}
                />
                <Textarea
                  label="Descrição"
                  maxLength="80"
                  value={descricao}
                  setValue={setDescricao}
                />
                <InputValor
                  label="Valor"
                  value={preco}
                  setValue={setPreco}
                />
                <Toggle
                  label="Ativar"
                  value={ativo}
                  setValue={setAtivo}
                />
                <Toggle
                  label="Permitir observações"
                  value={permiteObservacoes}
                  setValue={setPermiteObservacoes}
                />

              </div>
              <div className="modal-colunas" />
              <InputImagem
                value={urlImagem}
                setValue={setUrlImagem}
              />
            </div>
            <div className="produtos-botoes">
              <button
                className="cancelar"
                type="button"
                onClick={() => cancelar()}
              >
                Cancelar
              </button>
              <button
                className="aceitar"
                type="submit"
              >
                Salvar alterações
              </button>
            </div>
          </form>
        </div>
        <Snackbar
          mensagem={mensagem}
          openSnack={openSnack}
          setOpenSnack={setOpenSnack}
        />
      </div>
    </>
  );
}
