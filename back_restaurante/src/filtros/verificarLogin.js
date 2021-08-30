const knex = require('../conexao');
const jwt = require('jsonwebtoken');
const senhaHash = require('../senhaHash');

const verificarLogin = async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json('Acesso negado.');
    }

    try {
        const token = authorization.replace('Bearer ', '').trim();
        
        const { id } = jwt.verify(token, senhaHash);

        const verificarUsuario = await knex('usuarios').where({ id: id }).first();

        if (!verificarUsuario) {
            return res.status.json('Usuário não foi encontrado.');
        }

        const verificarRestaurante = await knex('restaurantes').where({ usuario_id: id }).first();

        if (!verificarRestaurante) {
            return res.status(404).json('Não foi possível encontrar restaurante.');
        }

        const { ...restaurante } = verificarRestaurante;

        const { senha, ...usuario } = verificarUsuario;

        req.usuario = usuario;
        req.restaurante = restaurante;

        next();
    } catch (error) {
        return res.status(400).json(error.message);
    }
};

module.exports = verificarLogin;