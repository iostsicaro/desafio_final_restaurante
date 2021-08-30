const knex = require('../conexao');
const bcrypt = require('bcrypt');
const schemaCadastroUsuario = require('../validacoes/schemaCadastroUsuario');
const schemaAtualizarUsuario = require('../validacoes/schemaAtualizarUsuario')

const cadastrarUsuario = async (req, res) => {
    const { nome, email, senha, restaurante } = req.body;

    try {
        await schemaCadastroUsuario.validate(req.body);

        const verificarEmailUsuario = await knex('usuarios').where({ email: email }).first();

        if (verificarEmailUsuario) {
            return res.status(404).json('Email informado já possui cadastro.');
        }

        const senhaCritptografada = await bcrypt.hash(senha, 10);

        const placeholderImg = 'https://fhfmgjnasgrddtfwgquj.supabase.in/storage/v1/object/public/cubosfood/placeholders/avatar.png'

        const usuario = await knex('usuarios').insert({ nome: nome, email: email, senha: senhaCritptografada }).returning('*');

        if (!usuario) {
            return res.status(404).json('Usuário não foi cadastrado');
        }

        const dadosRestaurante = await knex('restaurantes').insert({
            usuario_id: usuario[0].id,
            nome: restaurante.nome,
            descricao: restaurante.descricao,
            categoria_id: restaurante.idCategoria,
            taxa_entrega: restaurante.taxaEntrega,
            tempo_entrega_minutos: restaurante.tempoEntregaMinutos,
            valor_minimo_pedido: restaurante.valorMinimoPedido,
            url_imagem: placeholderImg 
        }).returning('*');

        if (!dadosRestaurante) {
            return res.status(404).json('Restaurante não foi cadastrado');
        }

        return res.status(200).json('Usuário cadastrado com sucesso.');
    } catch (error) {
        return res.status(400).json(error.message);
    }
};

const obterUsuario = async (req, res) => {
    try {
        const { usuario, restaurante } = req;

        const categoria = await knex('categorias').where({ id: restaurante.categoria_id }).first();

        const resposta = {
            usuario,
            restaurante,
            categoria
        }

        return res.status(200).json(resposta);
    } catch (error) {
        return res.status(400).json(error.message);
    }
};

const atualizarUsuario = async (req, res) => {
    const { id } = req.params;
    const { nome, email, senha,  restaurante } = req.body;
    
    try {
        await schemaAtualizarUsuario.validate(req.body);

        const verificarUsuario = await knex('usuarios').where({ id }).first();

        if(!verificarUsuario) {
            return res.status(404).json('Usuário não foi encontrado.');
        }

        let senhaCriptografada;

        if (senha) {
            senhaCriptografada = await bcrypt.hash(senha, 10);
        }


        if(nome || email || senha){
            const dadosUsuario = await knex('usuarios').update({
                nome,
                email,
                senha: senhaCriptografada,
            }).where({ id }).returning('*');
    
            if(!dadosUsuario) {
                return res.status(404).json('Não foi possível concluir a atualização.');
            }
        }
        

        if (restaurante.nome || restaurante.descricao || restaurante.idCategoria || restaurante.taxaEntrega || restaurante.tempoEntregaMinutos || restaurante.valorMinimoPedido || restaurante.valorMinimoPedido || restaurante.urlImagem) {
            const dadosRestaurante = await knex('restaurantes').update({
                nome: restaurante.nome,
                descricao: restaurante.descricao,
                categoria_id: restaurante.idCategoria,
                taxa_entrega: restaurante.taxaEntrega,
                tempo_entrega_minutos: restaurante.tempoEntregaMinutos,
                valor_minimo_pedido: restaurante.valorMinimoPedido,
                url_imagem: restaurante.urlImagem,
            }).where({usuario_id: verificarUsuario.id}).returning('*');

            if(!dadosRestaurante) {
                return res.status(404).json('Não foi possível concluir a atualização.');
            }
        }

        

        return res.status(200).json();
    } catch (error) {
        return res.status(400).json(error.message);
    }
};

module.exports = {
    cadastrarUsuario,
    obterUsuario,
    atualizarUsuario
};