/* eslint-disable max-len */
import React, { useState } from 'react';
import imageToBase64 from 'image-to-base64/browser';
import useAuth from '../../hooks/useAuth';
import { get, post } from '../../services/ApiClient';
import './styles.css';
import conferirPreco from '../../functions/conferirPreco';
import guardarPreco from '../../functions/guardarPreco';
import uploadImagem from '../../functions/uploadImagem';
import InputImagem from '../InputImagem';
import InputTexto from '../InputTexto';
import InputValor from '../InputValor';
import Textarea from '../Textarea';
import Toggle from '../Toggle';
import Snackbar from '../Snackbar';

export default function ModalCadastrarProduto({ setModalCadastrarProduto, setCadastroProduto }) {
  const { token } = useAuth();

  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('00,00');
  const [ativo, setAtivo] = useState(true);
  const [permiteObservacoes, setPermiteObservacoes] = useState(false);
  const [urlImagem, setUrlImagem] = useState('');

  const [mensagem, setMensagem] = useState('');
  const [openSnack, setOpenSnack] = useState(false);

  async function criarProduto(event) {
    event.preventDefault();

    if (!conferirPreco(preco)) {
      setMensagem({ texto: 'Valor inválido. O valor informado deve ter o formato: R$ XX,XX', status: 'erro' });
      setOpenSnack(true);
      return;
    }

    if (!nome) {
      setMensagem({ texto: 'Nome é um campo obrigatório.', status: 'erro' });
      setOpenSnack(true);
      return;
    }

    const novoProduto = {
      nome,
      descricao,
      preco: guardarPreco(preco),
      ativo,
      permiteObservacoes,
      urlImagem,
    };

    try {
      const infoUsuario = await (await get('usuarios', token)).json();

      if (novoProduto.urlImagem) {
        const base64Imagem = await imageToBase64(urlImagem);

        const idImagem = Math.floor(Math.random() * 10000);

        const imagemSalva = {
          nome: `produtos/${infoUsuario.restaurante.id}/${idImagem}`,
          imagem: base64Imagem,
        };

        const novaUrl = await uploadImagem(imagemSalva, token);

        novoProduto.urlImagem = novaUrl;
      } else {
        const urlPlaceholder = 'https://fhfmgjnasgrddtfwgquj.supabase.in/storage/v1/object/public/cubosfood/placeholders/produto.png';

        novoProduto.urlImagem = urlPlaceholder;
      }

      const resposta = await post('produtos', novoProduto, token);

      if (!resposta.ok) {
        const msg = await resposta.json();

        setMensagem({ texto: msg, status: 'erro' });
        setOpenSnack(true);
        return;
      }
      setModalCadastrarProduto(false);
      setCadastroProduto(false);
    } catch (error) {
      setMensagem({ texto: error.message, status: 'erro' });
      setOpenSnack(true);
    }
  }

  function cancelar() {
    setModalCadastrarProduto(false);
  }

  return (
    <>
      <div className="modal">
        <div className="base n-produto">
          <div className="title-box">
            <span className="titulo pagina">Novo produto</span>
          </div>
          <form onSubmit={(event) => criarProduto(event)}>
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
                Adicionar produto ao cardápio
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
