/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import { post } from '../../services/ApiClient';
import './styles.css';
import guardarPreco from '../../functions/guardarPreco';
import conferirPreco from '../../functions/conferirPreco';
import ehNumero from '../../functions/ehNumero';
import categorias from '../../assets/categorias';
import InputSenha from '../../components/InputSenha';
import InputTexto from '../../components/InputTexto';
import InputValor from '../../components/InputValor';
import Snackbar from '../../components/Snackbar';
import Stepper from '../../components/Stepper';
import Textarea from '../../components/Textarea';
import InputSelect from '../../components/InputSelect';

export default function Cadastro() {
  const history = useHistory();
  const [step, setStep] = useState([{
    valor: '1',
    status: 'editando',
  }, {
    valor: '2',
    status: '',
  }, {
    valor: '3',
    status: '',
  },
  ]);

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [nomeDoRestaurante, setNomeDoRestaurante] = useState('');
  const [categoria, setCategoria] = useState('');
  const [descricao, setDescricao] = useState('');
  const [taxaEntrega, setTaxaEntrega] = useState('00,00');
  const [tempoEntregaMinutos, setTempoEntregaMinutos] = useState('');
  const [valorMinimoPedido, setValorMinimoPedido] = useState('00,00');

  const [mensagem, setMensagem] = useState('');
  const [openSnack, setOpenSnack] = useState(false);

  async function handleCriarconta(event) {
    event.preventDefault();

    if (!conferirPreco(taxaEntrega) || !conferirPreco(valorMinimoPedido)) {
      setMensagem({ texto: 'Valores inválidos. Os valores informados devem ter o formato: R$ XX,XX', status: 'erro' });
      setOpenSnack(true);
      return;
    }

    if (!ehNumero(tempoEntregaMinutos)) {
      setMensagem({ texto: 'O tempo de entrega deve ser um número', status: 'erro' });
      setOpenSnack(true);
      return;
    }

    const cadastro = {
      nome,
      email,
      senha,
      restaurante: {
        nome: nomeDoRestaurante,
        descricao,
        idCategoria: categoria.id,
        taxaEntrega: guardarPreco(taxaEntrega),
        tempoEntregaMinutos,
        valorMinimoPedido: guardarPreco(valorMinimoPedido),
        urlImagem: 'https://fhfmgjnasgrddtfwgquj.supabase.in/storage/v1/object/public/cubosfood/placeholders/avatar.png',
      },
    };

    try {
      const resposta = await post('usuarios', cadastro);

      if (!resposta.ok) {
        const msg = await resposta.json();

        setMensagem({ texto: msg, status: 'erro' });
        setOpenSnack(true);
        return;
      }

      history.push('/');
    } catch (error) {
      setMensagem({ texto: error.message, status: 'erro' });
      setOpenSnack(true);
    }
  }

  function handleAvançarStep() {
    let msg = 'Preencha todos os itens para continuar';
    const newStep = [...step];
    for (let i = 0; i < newStep.length; i++) {
      if (newStep[i].status === 'editando') {
        if (!nome || !email || !senha || !confirmarSenha) {
          setMensagem({ texto: msg, status: 'erro' });
          setOpenSnack(true);
          break;
        }

        if (senha.length < 5) {
          setMensagem({ texto: 'A senha deve ter mais de cinco caracteres.', status: 'erro' });
          setOpenSnack(true);
          break;
        }

        if (!email.includes('@') || email.length < 3) {
          setMensagem({ texto: 'Email inválido!', status: 'erro' });
          setOpenSnack(true);
          break;
        }

        if (senha !== confirmarSenha) {
          setMensagem({ texto: 'As senhas digitadas devem ser iguais', status: 'erro' });
          setOpenSnack(true);
          break;
        }

        if (newStep[0].status === 'concluido') {
          if (!nomeDoRestaurante || !categoria) {
            msg = 'Nome de restaurante e categoria são campos obrigatórios';
            setMensagem({ texto: msg, status: 'erro' });
            setOpenSnack(true);
            break;
          }
        }

        newStep[i].status = 'concluido';
      }
      if (newStep[i].status === '') {
        newStep[i].status = 'editando';
        break;
      }
    }
    setStep(newStep);
  }

  function handleVoltarStep() {
    const newStep = [...step];
    for (let i = 2; i >= 0; i--) {
      if (newStep[i].status === 'editando') {
        newStep[i].status = '';
      }
      if (newStep[i].status === 'concluido') {
        newStep[i].status = 'editando';
        break;
      }
    }
    setStep(newStep);
  }

  return (
    <div className="img-cadastro">
      <div className="base cadastro">
        <div className="title-box">
          <span className="titulo pagina">Cadastro</span>
          <Stepper step={step} />
        </div>
        <form
          className="formulario"
          onSubmit={(event) => handleCriarconta(event)}
        >
          {step[0].status === 'editando' && (
            <div className="form-um">
              <InputTexto
                label="Nome do usuário"
                value={nome}
                setValue={setNome}
              />
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
              <InputSenha
                label="Repita a senha"
                value={confirmarSenha}
                setValue={setConfirmarSenha}
              />
            </div>
          )}
          {step[1].status === 'editando' && (
            <div className="form-dois">
              <InputTexto
                label="Nome do restaurante"
                value={nomeDoRestaurante}
                setValue={setNomeDoRestaurante}
              />
              <InputSelect
                label="Categoria do restaurante"
                placeholder="Selecione a categoria"
                value={categoria}
                setValue={setCategoria}
              />
              <Textarea
                label="Descrição"
                maxLength="50"
                value={descricao}
                setValue={setDescricao}
              />
            </div>
          )}
          {step[2].status === 'editando' && (
            <div className="form-tres">
              <InputValor
                label="Taxa de entrega"
                value={taxaEntrega}
                setValue={setTaxaEntrega}
              />
              <InputTexto
                label="Tempo estimado de entrega (em minutos)"
                value={tempoEntregaMinutos}
                setValue={setTempoEntregaMinutos}
              />
              <InputValor
                label="Valor mínimo do pedido"
                value={valorMinimoPedido}
                setValue={setValorMinimoPedido}
              />
            </div>
          )}
          <div className="button-box">
            <button
              className="cancelar"
              type="button"
              onClick={() => handleVoltarStep()}
              disabled={!step[1].status}
            >
              Anterior
            </button>
            {step[2].status ? (
              <button
                className="aceitar"
                type="submit"
              >
                Criar conta
              </button>
            ) : (
              <button
                className="aceitar"
                type="button"
                onClick={() => handleAvançarStep()}
              >
                Próximo
              </button>
            )}
          </div>
          <div className="link-box">
            <span>Já tem uma conta? </span>
            <NavLink to="/"> Login</NavLink>
          </div>
        </form>
      </div>
      <div className="ilustracao" />
      <Snackbar
        mensagem={mensagem}
        openSnack={openSnack}
        setOpenSnack={setOpenSnack}
      />
    </div>
  );
}
