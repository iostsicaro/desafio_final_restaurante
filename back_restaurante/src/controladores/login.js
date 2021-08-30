const knex = require('../conexao');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const senhaHash = require('../senhaHash');
const schemaLoginUsuario = require('../validacoes/schemaLoginUsuario');

const loginUsuario = async (req, res) => {
    const { email, senha } = req.body;

    try {
        await schemaLoginUsuario.validate(req.body);
        
        const usuario = await knex('usuarios').where({ email: email }).first();

        if (!usuario) {
            return res.status(404).json('Email ou senha estão incorretos.');
        }

        const validarSenha = await bcrypt.compare(senha, usuario.senha);

        if (!validarSenha) {
            return res.status(404).json('Email ou senha estão incorretos.');
        }

        const dadosTokenUsuario = {
            id: usuario.id,
            email: usuario.email
        };

        const token = jwt.sign(dadosTokenUsuario, senhaHash, { expiresIn: '4h' });

        const { senha: _, ...dadosUsuario } = usuario;

        return res.status(200).json({
            usuario: dadosUsuario,
            token
        });
    } catch (error) {
        return res.status(400).json(error.message);
    }
};

const loginConsumidor = async (req, res) => {
    const { email, senha } = req.body;

    try {
        await schemaLoginUsuario.validate(req.body);
        
        const consumidor = await knex('consumidor').where({ email: email }).first();

        if (!consumidor) {
            return res.status(404).json('Email ou senha estão incorretos.');
        }

        const validarSenha = await bcrypt.compare(senha, consumidor.senha);

        if (!validarSenha) {
            return res.status(404).json('Email ou senha estão incorretos.');
        }

        const dadosTokenUsuario = {
            id: consumidor.id,
            email: consumidor.email
        };

        const token = jwt.sign(dadosTokenUsuario, senhaHash, { expiresIn: '4h' });

        const { senha: _, ...dadosUsuario } = consumidor;

        return res.status(200).json({
            usuario: dadosUsuario,
            token
        });
    } catch (error) {
        return res.status(400).json(error.message);
    }
};


module.exports = {
    loginUsuario,
    loginConsumidor
}