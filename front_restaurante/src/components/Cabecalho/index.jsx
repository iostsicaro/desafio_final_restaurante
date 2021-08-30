import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { get } from '../../services/ApiClient';
import './styles.css';
import ModalEditarUsuario from '../ModalEditarUsuario';
import Avatar from '../../assets/avatar.png';
import Illustration from '../../assets/illustration-3.svg';
import Snackbar from '../Snackbar';

export default function Cabecalho() {
  const history = useHistory();
  const { token, deslogar } = useAuth();

  const [dadosUsuario, setDadosUsuario] = useState('');
  const [modalEditarUsuario, setModalEditarUsuario] = useState(false);
  // const [usuarioEditado, setUsuarioEditado] = useState(null);

  const [erro, setMensagem] = useState('');
  const [openSnack, setOpenSnack] = useState(false);

  function logout() {
    history.push('/');
    deslogar();
  }

  async function onLoad() {
    try {
      const resposta = await get('usuarios', token);
      const usuario = await resposta.json();
      setDadosUsuario(usuario);
    } catch (error) {
      setMensagem({ texto: error.message, status: 'erro' });
      setOpenSnack(true);
    }
  }

  useEffect(() => {
    onLoad();
  }, [
    modalEditarUsuario]);

  return (
    <div>
      {
        dadosUsuario && (
          <>
            {modalEditarUsuario && (
              <ModalEditarUsuario
                dadosUsuario={dadosUsuario}
                setModalEditarUsuario={setModalEditarUsuario}
              />
            )}
            <div
              className="imagem-cabecalho"
              style={{ backgroundImage: `url(${dadosUsuario && dadosUsuario.categoria.url_imagem})` }}
            />
            <img className="dash-ilustracao" src={Illustration} alt="" />
            <div className="avatar-borda">
              <img
                className="avatar"
                src={dadosUsuario.restaurante.url_imagem || Avatar}
                alt="avatar"
                onClick={() => setModalEditarUsuario(true)}
              />
            </div>
            <div className="localizar-titulo">
              <span className="titulo sombreado">
                {dadosUsuario.restaurante.nome}
              </span>
              <div>
              <button
                className="reverso"
                onClick={() => history.push('cardapio')}
                disabled={window.location.href.includes('cardapio') && true}
              >
                Cardápio
              </button>
              <button
                className="reverso"
                onClick={() => history.push('pedidos')}
                disabled={window.location.href.includes('pedidos') && true}
                >
                Pedidos
              </button>
              <button
                className="botao-logout sombreado"
                type="button"
                onClick={() => logout()}
              >
                Logout
              </button>
              </div>
            </div>
          </>
        )
      }
      <Snackbar
        erro={erro}
        openSnack={openSnack}
        setOpenSnack={setOpenSnack}
      />
    </div>
  );
}
