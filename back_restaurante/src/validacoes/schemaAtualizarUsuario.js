const yup = require('./configuracoes');

const schemaAtualizarUsuario = yup.object().shape({
    nome: yup.string(),
    email: yup.string().email(),
    senha: yup.string().min(5),
    restaurante: yup.object().shape({
        nome: yup.string(),
        idCategoria: yup.number(),
        taxaEntrega: yup.number(),
        tempoEntregaMinutos: yup.number(),
        valorMinimoPedido: yup.number(),
        url_imagem: yup.string()
    })
});

module.exports = schemaAtualizarUsuario;