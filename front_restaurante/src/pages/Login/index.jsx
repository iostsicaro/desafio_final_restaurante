import React, { useState } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { post } from '../../services/ApiClient';
import './styles.css';
import IllustrationLogin from '../../assets/illustration-comp.svg';
import InputSenha from '../../components/InputSenha';
import InputTexto from '../../components/InputTexto';
import Snackbar from '../../components/Snackbar';

export default function Login() {
  const { logar } = useAuth();
  const history = useHistory();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const [mensagem, setMensagem] = useState('');
  const [openSnack, setOpenSnack] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    const login = {
      email,
      senha,
    };

    if (!email || !senha) {
      setMensagem({ texto: 'Todos os dados devem ser preenchidos.', status: 'erro' });
      setOpenSnack(true);
    }
    try {
      const resposta = await post('login-usuario', login);

      if (!resposta.ok) {
        const msg = await resposta.json();

        setMensagem({ texto: msg, status: 'erro' });
        setOpenSnack(true);
        return;
      }

      const { token } = await resposta.json();

      logar(token);

      history.push('/pedidos');
    } catch (error) {
      setMensagem({ texto: error.message, status: 'erro' });
      setOpenSnack(true);
    }
  }

  return (
    <div className="img-login">
      <img className="ilustracao" src={IllustrationLogin} alt="" />
      <div className="base login">
        <div className="title-box">
          <span className="titulo pagina">Login</span>
        </div>
        <form>
          <InputTexto
            label="Email"
            value={email}
            setValue={setEmail}
          />
          <InputSenha
            label="Senha"
            value={senha}
            setValue={setSenha}
          />
          <div className="button-box">
            <button
              className="aceitar"
              type="submit"
              onClick={(event) => handleSubmit(event)}
            >
              Entrar
            </button>
          </div>
          <div className="link-box">
            <span>Ainda não tem uma conta? </span>
            <NavLink to="/cadastro"> Cadastre-se</NavLink>
          </div>
        </form>
      </div>
      <Snackbar
        mensagem={mensagem}
        openSnack={openSnack}
        setOpenSnack={setOpenSnack}
      />
    </div>
  );
}
