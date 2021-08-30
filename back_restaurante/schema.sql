/* CRIAÇÃO DO DB */
CREATE DATABASE desafio_final;

/* CRIAÇÃO DAS TABELAS */
DROP TABLE IF EXISTS categorias;

CREATE TABLE categorias(
  id serial NOT NULL PRIMARY KEY,
  nome varchar(30) NOT NULL,
  url_imagem varchar(255)
);

DROP TABLE IF EXISTS usuarios;

CREATE TABLE usuarios (
  id serial NOT NULL PRIMARY KEY,
  nome varchar(100) NOT NULL,
  email varchar(100) NOT NULl UNIQUE,
  senha text NOT NULL
);

DROP TABLE IF EXISTS restaurantes;

CREATE TABLE restaurantes (
  id serial NOT NULL PRIMARY KEY,
  usuario_id integer NOT NULL,
  nome varchar(50) NOT NULL,
  descricao varchar(100),
  categoria_id integer NOT NULL,
  taxa_entrega integer NOT NULL DEFAULT 0,
  tempo_entrega_minutos integer NOT NULL DEFAULT 30,
  valor_minimo_pedido integer NOT NULL DEFAULT 0,
  url_imagem varchar(255),
  FOREIGN KEY (usuario_id) REFERENCES usuarios (id),
  FOREIGN KEY (categoria_id) REFERENCES categorias (id)
);

DROP TABLE IF EXISTS produtos;

CREATE TABLE produtos (
  id serial NOT NULL PRIMARY KEY,
  restaurante_id integer NOT NULL,
  nome varchar(50) NOT NULL UNIQUE,
  descricao varchar(100),
  preco integer NOT NULL,
  ativo boolean NOT NULL DEFAULT TRUE,
  permite_observacoes boolean NOT NULL DEFAULT FALSE,
  url_imagem varchar(255),
  FOREIGN KEY (restaurante_id) REFERENCES restaurantes (id)
);

/* INSERÇÃO MANUAL DE VALORES NAS TABELAS */
INSERT INTO categorias
(nome, url_imagem)
VALUES
('Diversos', 'https://images.pexels.com/photos/1065030/pexels-photo-1065030.jpeg'),
('Lanches', 'https://images.pexels.com/photos/534285/pexels-photo-534285.jpeg'),
('Carnes', 'https://images.pexels.com/photos/2313686/pexels-photo-2313686.jpeg'),
('Massas', 'https://images.pexels.com/photos/1527603/pexels-photo-1527603.jpeg'),
('Pizzas', 'https://images.pexels.com/photos/1049626/pexels-photo-1049626.jpeg'),
('Japonesa', 'https://images.pexels.com/photos/2323398/pexels-photo-2323398.jpeg'),
('Chinesa', 'https://images.pexels.com/photos/2347311/pexels-photo-2347311.jpeg'),
('Mexicano', 'https://images.pexels.com/photos/5737247/pexels-photo-5737247.jpeg'),
('Brasileira', 'https://images.pexels.com/photos/5695872/pexels-photo-5695872.jpeg'),
('Italiana', 'https://images.pexels.com/photos/41320/beef-cheese-cuisine-delicious-41320.jpeg'),
('Árabe', 'https://images.pexels.com/photos/4374580/pexels-photo-4374580.jpeg');
