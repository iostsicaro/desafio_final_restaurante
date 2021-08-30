export default function editarId(id) {
    const novoId = id.toString();
    return novoId.padStart(4, '0');
  }
  