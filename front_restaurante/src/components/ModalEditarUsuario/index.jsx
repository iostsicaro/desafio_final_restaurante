/* eslint-disable camelcase */
/* eslint-disable no-undef */
/* eslint-disable max-len */
/* eslint-disable no-console */
import React, { useState } from 'react';
import imageToBase64 from 'image-to-base64/browser';
import useAuth from '../../hooks/useAuth';
import { put } from '../../services/ApiClient';
import './styles.css';
import guardarPreco from '../../functions/guardarPreco';
import conferirPreco from '../../functions/conferirPreco';
import editarPreco from '../../functions/editarPreco';
import ehNumero from '../../functions/ehNumero';
import uploadImagem from '../../functions/uploadImagem';
import InputImagem from '../InputImagem';
import InputSenha from '../InputSenha';
import InputSelect from '../InputSelect';
import InputTexto from '../InputTexto';
import InputValor from '../InputValor';
import Textarea from '../Textarea';
import Snackbar from '../Snackbar';

export default function ModalEditarUsuario({ dadosUsuario, setModalEditarUsuario }) {
  console.log(dadosUsuario);
  const { token } = useAuth();
  const valorMinimoEditado = editarPreco(dadosUsuario.restaurante.valor_minimo_pedido);
  const taxaEntregaEditado = editarPreco(dadosUsuario.restaurante.taxa_entrega);

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [nomeRestaurante, setNomeRestaurante] = useState('');
  const [categoria, setCategoria] = useState('');
  const [descricao, setDescricao] = useState('');
  const [taxaEntrega, setTaxaEntrega] = useState('');
  const [tempoEntregaMinutos, setTempoEntregaMinutos] = useState('');
  const [valorMinimo, setValorMinimo] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [urlImagem, setUrlImagem] = useState(dadosUsuario.restaurante.url_imagem);

  const [mensagem, setMensagem] = useState('');
  const [openSnack, setOpenSnack] = useState(false);

  async function atualizarusuario(event) {
    event.preventDefault();

    const editarUsuario = { restaurante: {} };

    if (nome) editarUsuario.nome = nome;
    if (email) {
      if (!email.includes('@') || email.length < 3) {
        setMensagem({ texto: 'Email inválido!', status: 'erro' });
        setOpenSnack(true);
        return;
      }

      editarUsuario.email = email;
    }
    if (senha) {
      if (senha !== confirmarSenha) {
        setMensagem({ texto: 'As senhas digitadas devem ser iguais', status: 'erro' });
        setOpenSnack(true);
        return;
      }
      editarUsuario.senha = senha;
    }
    if (nomeRestaurante) editarUsuario.restaurante.nome = nomeRestaurante;
    if (descricao) editarUsuario.restaurante.descricao = descricao;
    if (categoria) editarUsuario.restaurante.idCategoria = categoria.id;
    if (taxaEntrega) {
      if (!conferirPreco(taxaEntrega)) {
        setMensagem({ texto: 'Valores inválidos. Os valores informados devem ter o formato: R$ XX,XX', status: 'erro' });
        setOpenSnack(true);
        return;
      }
      editarUsuario.restaurante.taxaEntrega = guardarPreco(taxaEntrega);
    }
    if (valorMinimo) {
      if (!conferirPreco(valorMinimo)) {
        setMensagem({ texto: 'Valores inválidos. Os valores informados devem ter o formato: R$ XX,XX', status: 'erro' });
        setOpenSnack(true);
        return;
      }
      editarUsuario.restaurante.valorMinimoPedido = guardarPreco(valorMinimo);
    }
    if (tempoEntregaMinutos) {
      if (!ehNumero(tempoEntregaMinutos)) {
        setMensagem({ texto: 'Tempo de entrega inválido. Deve ser um número.', status: 'erro' });
        setOpenSnack(true);
        return;
      }
      editarUsuario.restaurante.tempoEntregaMinutos = tempoEntregaMinutos;
    }

    if (!nome && !email && !senha && !nomeRestaurante && !categoria && !descricao && !taxaEntrega && !tempoEntregaMinutos && !valorMinimo && !urlImagem) {
      setMensagem({ texto: 'Nenhuma informação a ser atualizada. Usuário não editado', status: 'erro' });
      setOpenSnack(true);
      return;
    }

    try {
      if (urlImagem) {
        const base64Imagem = await imageToBase64(urlImagem);

        const idImagem = Math.floor(Math.random() * 10000);

        const imagemSalva = {
          nome: `restaurantes/${idImagem}`,
          imagem: base64Imagem,
        };

        const novaUrl = await uploadImagem(imagemSalva, token);

        editarUsuario.restaurante.urlImagem = novaUrl;
      }

      const resposta = await put(`usuarios/${dadosUsuario.usuario.id}`, editarUsuario, token);

      if (!resposta.ok) {
        const msg = await resposta.json();

        setMensagem({ texto: msg, status: 'erro' });
        setOpenSnack(true);
        return;
      }

      setMensagem({ texto: 'Usuário atualizado com sucesso!', status: 'sucesso' });
      setOpenSnack(true);
      setModalEditarUsuario(false);
    } catch (error) {
      setMensagem({ texto: error.message, status: 'erro' });
      setOpenSnack(true);
    }
  }

  function cancelar() {
    setModalEditarUsuario(false);
  }

  return (
    <>
      <div className="modal-plus">
        <div className="base n-cadastro">
          <div className="title-box">
            <span className="titulo pagina">Editar Perfil</span>
          </div>
          <form onSubmit={(event) => atualizarusuario(event)}>
            <div className="flex-row">
              <div className="modal-colunas maior">
                <InputTexto
                  label="Nome de usuário"
                  placeholder={dadosUsuario.usuario.nome}
                  value={nome}
                  setValue={setNome}
                />
                <InputTexto
                  label="Email"
                  placeholder={dadosUsuario.usuario.email}
                  value={email}
                  setValue={setEmail}
                />
                <InputTexto
                  label="Nome do restaurante"
                  placeholder={dadosUsuario.restaurante.nome}
                  value={nomeRestaurante}
                  setValue={setNomeRestaurante}
                />
                <InputSelect
                  label="Categoria do restaurante"
                  placeholder={dadosUsuario.categoria.nome}
                  value={categoria}
                  setValue={setCategoria}
                />
                <Textarea
                  label="Descrição"
                  maxLength="80"
                  placeholder={dadosUsuario.restaurante.descricao}
                  value={descricao}
                  setValue={setDescricao}
                />
                <InputValor
                  label="Taxa de entrega"
                  placeholder={taxaEntregaEditado}
                  value={taxaEntrega}
                  setValue={setTaxaEntrega}
                />
                <InputTexto
                  label="Tempo estimado de entrega"
                  placeholder={dadosUsuario.restaurante.tempo_entrega_minutos}
                  value={tempoEntregaMinutos}
                  setValue={setTempoEntregaMinutos}
                />
                <InputValor
                  label="Valor minimo do pedido"
                  placeholder={valorMinimoEditado}
                  value={valorMinimo}
                  setValue={setValorMinimo}
                />
                <InputSenha
                  label="Senha"
                  value={senha}
                  setValue={setSenha}
                />
                <InputSenha
                  label="Repita a senha"
                  value={confirmarSenha}
                  setValue={setConfirmarSenha}
                />
              </div>
              <div className="modal-colunas menor" />
              {urlImagem && (
                <InputImagem
                  value={urlImagem}
                  setValue={setUrlImagem}
                />
              )}
            </div>
            <div className="cadastro-botoes">
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
