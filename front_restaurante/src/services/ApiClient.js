const BASE_URL = 'http://localhost:3000/';

async function post(resource, data, token) {
  let header = null;

  if (token) {
    header = {
      'Content-type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
  } else {
    header = { 'Content-type': 'application/json' };
  }

  const resposta = await fetch(BASE_URL + resource, {
    headers: header,
    method: 'POST',
    body: JSON.stringify(data),
  });

  return resposta;
}

async function put(resource, data, token) {
  const resposta = await fetch((BASE_URL + resource), {
    headers: {
      'Content-type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    method: 'PUT',
    body: JSON.stringify(data),
  });

  return resposta;
}

async function get(resource, token) {
  const resposta = await fetch((BASE_URL + resource), {
    headers: {
      'Content-type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    method: 'GET',
  });

  return resposta;
}

async function del(resource, token) {
  const resposta = await fetch(BASE_URL + resource, {
    headers: {
      'Content-type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    method: 'DELETE',
  });

  return resposta;
}

export {
  post,
  put,
  get,
  del,
};
