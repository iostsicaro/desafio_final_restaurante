export default function editarEndereco(endereco){
    let novoCep =  endereco.cep
    const antes = novoCep.substring(0, novoCep.length - 3)
    const depois = novoCep.substring(novoCep.length - 3)
    novoCep = antes+'-'+depois 

    return endereco.endereco + ' - ' + endereco.complemento + ' - ' + novoCep
}