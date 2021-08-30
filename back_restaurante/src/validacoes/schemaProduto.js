const yup = require('./configuracoes');

const schemaProduto = yup.object().shape({
    nome: yup.string().required(),
    preco: yup.number().required(),
    descricao: yup.string(),
    permiteObservacoes: yup.string().required(),
    urlImagem: yup.string().required(),
});

module.exports = schemaProduto;