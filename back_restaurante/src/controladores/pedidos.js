const knex = require('../conexao');

const listarPedidos = async (req, res) => {
    const { restaurante } = req;
    const { entregue } = req.params;

    try {
        const pedidos = await knex('pedidos').where({ restaurante_id: restaurante.id, entregue, enviado: false } ).orderBy('id', 'desc') ;

        for (const pedido of pedidos) {
            pedido.consumidor = await knex('consumidor').where({ id: pedido.consumidor_id }).first();
            pedido.endereco = await knex('endereco').where({ id: pedido.endereco_id }).first();
            pedido.itens = await knex('itens').where({ pedidos_id: pedido.id })
        }

        return res.status(200).json(pedidos);
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const enviarPedido = async (req, res) => {
    const { restaurante } = req;
    const { id } = req.params

    try {
        const enviarPedido = await knex('pedidos')
            .where({ restaurante_id: restaurante.id, id })
            .update({ enviado: true }).returning('*');

        if (enviarPedido.length === 0) {
            return res.status(400).json('Não foi possível enviar o pedido!');
        }

        return res.status(200).json('Pedido enviado');
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

module.exports = {
    listarPedidos,
    enviarPedido,
}