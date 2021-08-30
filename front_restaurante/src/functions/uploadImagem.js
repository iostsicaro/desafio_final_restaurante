import { post } from '../services/ApiClient';

export default async function uploadImagem(resource, token) {
  try {
    const resposta = await (await post('imagem', resource, token)).json();
    return resposta;
  } catch (error) {
    return error;
  }
}
