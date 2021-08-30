export default function conferirPreco(preco) {
  if (preco === '00,00') {
    return false;
  }
  if (preco.indexOf(',') !== (preco.length - 3)) {
    return false;
  }
  const novoPreco = preco.replace(',', '') * 1;
  const testar = /^\d+$/.test(novoPreco);
  return testar;
}
