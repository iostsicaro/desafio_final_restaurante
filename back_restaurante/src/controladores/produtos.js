const knex = require('../conexao');
const schemaProduto = require('../validacoes/schemaProduto');

const listarProdutos = async (req, res) => {
    const { restaurante } = req;

    try {
        const produtos = await knex('produtos').where({ restaurante_id: restaurante.id }).orderBy('id', 'desc');

        return res.status(200).json(produtos);
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const obterProduto = async (req, res) => {
    const { restaurante } = req;
    const { id } = req.params;

    try {
        const produto = await knex('produtos').where({ id, restaurante_id: restaurante.id}).first();

        if (!produto) {
            return res.status(404).json('Produto não foi encontrado.');
        }

        return res.status(200).json(produto);
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const cadastrarProdutos = async (req, res) => {
    const { restaurante } = req;
    const { nome, descricao, preco, permiteObservacoes, urlImagem } = req.body;

    try {
        await schemaProduto.validate(req.body);

        const verificarNomeProduto = await knex('produtos').where({ nome: nome, restaurante_id: restaurante.id }).first();

        if (verificarNomeProduto) {
            return res.status(404).json('Produto já possui cadastro.');
        }

        const produto = await knex('produtos').insert({ restaurante_id: restaurante.id, nome, descricao, preco, permite_observacoes: permiteObservacoes, url_imagem: urlImagem }).returning('*');

        if (!produto)  {
            return res.status(404).json('Não foi possível cadastrar produto.');
        }

        return res.status(200).json();
    } catch (error) {
        return res.status(400).json(error.message);
    }
};

const atualizarProduto = async (req, res) => {
    const { restaurante } = req;
    const { id } = req.params;
    const { nome, descricao, preco, ativo, permiteObservacoes, urlImagem } = req.body;

    try {
        await schemaProduto.validate(req.body);

        const encontrarProduto = await knex('produtos').where({ id, restaurante_id: restaurante.id});

        if (!encontrarProduto) {
            return res.status(404).json('Produto não foi encontrado.');
        }

        const produto = await knex('produtos').update({ nome, descricao, preco, ativo, permite_observacoes: permiteObservacoes, url_imagem: urlImagem }).where({ id }).returning('*');

        if (!produto) {
            return res.status(404).json('Não foi possível atualizar produto.');
        }

        return res.status(200).json();
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const deletarProduto = async (req, res) => {
    const { restaurante } = req;
    const { id } = req.params;

    try {
        const encontrarProduto = await knex('produtos').where({ id: id, restaurante_id: restaurante.id}).first();

        if (!encontrarProduto) {
            return res.status(404).json('Produto não foi encontrado.');
        }

        if (encontrarProduto.ativo === true) {
            return res.status(404).json('Produto está com status ativo.')
        }

        const produtoExcluido = await knex('produtos').del().where({ id: id });

        if (!produtoExcluido) {
            return res.status(400).json("O produto não foi excluido");
        }

        return res.status(200).json('Produto excluido com sucesso');
    } catch (error) {
        return res.status(400).json(error.message);
    }
};

const ativarProduto = async (req, res) => {
    const { restaurante } = req;
    const { id } = req.params;

    try {
        const encontrarProduto = await knex('produtos').where({ id: id, restaurante_id: restaurante.id }).first();

        if (!encontrarProduto) {
            return res.status(404).json('Produto não foi encontrado.');
        }

        const produto = await knex('produtos').update({ ativo: true }).where({ id: id }).returning('*');

        if (!produto) {
            return res.status(404).json('Não foi possível ativar produto.');
        }

        return res.status(200).json();
    } catch (error) {
        return res.status(400).json(error.message);
    }
};

const desativarProduto = async (req, res) => {
    const { restaurante } = req;
    const { id } = req.params;

    try {
        const encontrarProduto = await knex('produtos').where({ id, restaurante_id: restaurante.id}).first();

        if (!encontrarProduto) {
            return res.status(404).json('Produto não foi encontrado.');
        }

        const produto = await knex('produtos').update({ ativo: false }).where({ id }).returning('*');

        if (!produto) {
            return res.status(404).json('Não foi possível completar desativar produto.');
        }

        return res.status(200).json();
    } catch (error) {
        return res.status(400).json(error.message);
    }
};

module.exports = {
    listarProdutos,
    obterProduto,
    cadastrarProdutos,
    atualizarProduto,
    deletarProduto,
    ativarProduto,
    desativarProduto
}