export default function guardarPreco(preco) {
  const novoPreco = preco.replace(',', '') * 1;
  return novoPreco;
}
