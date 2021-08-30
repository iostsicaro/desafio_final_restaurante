const yup = require('./configuracoes');

const schemaCadastroConsumidor = yup.object().shape({
    nome: yup.string().required('Campo nome é obrigatório.'),
    email: yup.string().required('Campo email é obrigatório.').email(),
    senha: yup.string().required().min(5),
    telefone: yup.string().required('Campo telefone é obrigatório.')
});

module.exports = schemaCadastroConsumidor;