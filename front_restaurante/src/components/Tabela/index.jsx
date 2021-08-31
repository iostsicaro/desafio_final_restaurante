import React, { useState } from 'react';
import './styles.css';
import editarId from '../../functions/editarId';
import editarEndereco from '../../functions/editarEndereco';
import editarPreco from '../../functions/editarPreco';

export default function Tabela({ pedidos, setSelecionado, setAbrirModal }) {
    function selecionarItem(item) {
        setSelecionado(item);
        setAbrirModal(true)
    }

    function Produto({ p }) {
        return (
            <>
                {p.nome + ' - ' + p.quantidade + 'uni'}
                <br />
            </>
        )
    }


    function MiniBotao({ itens }) {
        const [verMais, setVerMais] = useState(false)
        function vermais(e) {
            e.stopPropagation();
            setVerMais(!verMais);
        }
        return (
            <span
                className={verMais ? 'textinho-tabela-plus' : 'ver-mais'}
                onClick={(e) => vermais(e)}>
                {
                    verMais ? (
                        itens.map((p, index) => index >= 2 && <Produto p={p} />
                        )
                    ) :
                        'ver mais...'
                }
            </span>
        )
    }

    return (
        <div className="tabela-box">
            <div className="tabela-head">
                <div>
                    Pedido
                </div>
                <div>
                    Itens
                </div>
                <div>
                    Endereço
                </div>
                <div>
                    Cliente
                </div>
                <div>
                    Total
                </div>
            </div>
            {pedidos && pedidos.map((item) => (
                <div
                    onClick={() => selecionarItem(item)}
                    className="tabela-item"
                    key={item.id}
                >
                    <div>
                        {item && editarId(item.id)}
                    </div>
                    <div className="textinho-tabela flex-column">
                        {item.itens.map((p, index) => index < 2 && <Produto p={p} />)}
                        {item.itens[2] && <MiniBotao itens={item.itens} />}
                    </div>
                    <div className="textinho-tabela">
                        {item && editarEndereco(item.endereco)}
                    </div>
                    <div className="textinho-tabela" >
                        {item.consumidor.nome}
                    </div>
                    <div>
                        {item && editarPreco(item.total, true)}
                    </div>
                </div>
            ))}
        </div>
    )
}