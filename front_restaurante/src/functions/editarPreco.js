export default function editarPreco(preco, cifrao) {
  const novoPreco = preco.toString();
  const antes = novoPreco.substring(0, novoPreco.length - 2).padStart(2, '0');
  const depois = novoPreco.substring(novoPreco.length - 2).padStart(2, '0');
  return `${cifrao ? 'R$' : ''} ${antes},${depois}`;
}
