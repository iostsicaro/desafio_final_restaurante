/* eslint-disable max-len */
import React, { useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import { get } from '../../services/ApiClient';
import './styles.css';
import Cabecalho from '../../components/Cabecalho';
import Snackbar from '../../components/Snackbar';
import Tabela from '../../components/Tabela';
import ModalItens from '../../components/ModalItens';

export default function DashPedidos() {
    const { token } = useAuth();


    const [filtro, setFiltro] = useState(false);
    const [abrirModal, setAbrirModal] = useState(false);
    const [mensagem, setMensagem] = useState('');
    const [openSnack, setOpenSnack] = useState(false);

    const [selecionado, setSelecionado] = useState('')
    const [pedidos, setPedidos] = useState([]);

    async function onLoad() {
        try {
            const resposta = await get(`pedidos/${filtro}`, token);

            if (resposta) {
                const arrayPedidos = await resposta.json();
                console.log(arrayPedidos)
                if (arrayPedidos.length === 0) {
                    setPedidos([]);
                    return;
                }
                setPedidos(arrayPedidos);
                return;
            }
        } catch (error) {
            setMensagem({ texto: error.message, status: 'erro' });
            setOpenSnack(true);
        }
    }

    useEffect(() => {
        onLoad();
    }, [])

    useEffect(() => {
        onLoad();
    }, [filtro, abrirModal])
    return (
        <div>
            <ModalItens
                selecionado={selecionado}
                abrirModal={abrirModal}
                setAbrirModal={setAbrirModal}
            />
            <div className={abrirModal && 'blurry'}>
                <Cabecalho
                />
                <div className='sub-cabecalho-pedidos'>
                    <div className={`noselect select left ${!filtro && 'ativo'}`}
                        onClick={() => setFiltro(!filtro)}
                    >
                        Não entregues
                    </div>
                    <div className={`noselect select right ${filtro && 'ativo'}`}
                        onClick={() => setFiltro(!filtro)}
                    >
                        Entregues
                    </div>
                </div>
                <Tabela
                    pedidos={pedidos}
                    setSelecionado={setSelecionado}
                    setAbrirModal={setAbrirModal} />
            </div>
            <Snackbar
                mensagem={mensagem}
                openSnack={openSnack}
                setOpenSnack={setOpenSnack}
            />
        </div>
    );
}
