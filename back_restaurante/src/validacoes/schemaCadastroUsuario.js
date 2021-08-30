const yup = require('./configuracoes');

const schemaCadastroUsuario = yup.object().shape({
    nome: yup.string().required(),
    email: yup.string().required().email(),
    senha: yup.string().required().min(5),
    restaurante: yup.object().shape({
        nome: yup.string().required('Informe o nome do restaurante.'),
        idCategoria: yup.number().required('Informe a categoria do restaurante.'),
        taxaEntrega: yup.number().required('Informe a taxa de entrega.'),
        tempoEntregaMinutos: yup.number().required('Informe o tempo de entrega.'),
        valorMinimoPedido: yup.number().required('Informe o valor mínimo do pedido.'),
        url_imagem: yup.string()
    })
});

module.exports = schemaCadastroUsuario;