const express = require('express');
const verificarLogin = require('./filtros/verificarLogin');
const { loginUsuario } = require('./controladores/login');
const { cadastrarProdutos, listarProdutos, atualizarProduto, deletarProduto, ativarProduto, desativarProduto, obterProduto } = require('./controladores/produtos');
const { cadastrarUsuario, obterUsuario, atualizarUsuario } = require('./controladores/usuario');
const { uploadImagem, updateImagem } = require('./controladores/imagens');
const { listarCategorias } = require('./controladores/categoria');
const { listarPedidos, enviarPedido } = require('./controladores/pedidos');

const rotas = express();

// USUÁRIO
rotas.post('/usuarios', cadastrarUsuario);

// LOGIN
rotas.post('/login-usuario', loginUsuario);

// CATEGORIAS 
rotas.get('/categorias', listarCategorias);


// MIDDLEWARE QUE VERIFICA LOGIN
rotas.use(verificarLogin);

// ROTAS DE PRODUTOS
rotas.get('/produtos', listarProdutos);
rotas.get('/produtos/:id', obterProduto);
rotas.post('/produtos', cadastrarProdutos);
rotas.put('/produtos/:id', atualizarProduto);
rotas.delete('/produtos/:id', deletarProduto);
rotas.post('/produtos/:id/ativar', ativarProduto);
rotas.post('/produtos/:id/desativar', desativarProduto);

// ROTAS DE USUÁRIO PROTEGIDAS
rotas.get('/usuarios', obterUsuario);
rotas.put('/usuarios/:id', atualizarUsuario);

// ROTAS DE IMAGENS
rotas.post('/imagem', uploadImagem)
rotas.put('/imagem', updateImagem)

// ROTAS DE PEDIDOS
rotas.get('/pedidos/:entregue', listarPedidos)
rotas.put('/pedidos/:id', enviarPedido)


module.exports = rotas;