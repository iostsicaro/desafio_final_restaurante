# cubos-food

## MODELAGEM DO BANCO DE DADOS

**Uma regra importante:** cada usuário poderá ter apenas 1 restaurante e cada restaurante deverá ter apenas 1 usuário associado, portanto um relacionamento de 1 para 1.

Estas tabelas deverão ser:
* Categoria
* Usuario
* Restaurante
* Produto

### CATEGORIA

Tabela para armazenar o pré-cadastro de categorias de restaurantes.

O pré-cadastro de categorias deverá possuir pelo menos as seguintes opções:

Diversos / Lanches / Carnes / Massas / Pizzas / Japonesa / Chinesa / Mexicano / Brasileira / Italiana / Árabe

| Coluna     | Tipo         | NOT NULL? | PK? | REFERENCES | DEFAULT   |
| --------   | --------     | --------- | --- | ---------- | -------   |
| id         | SERIAL       | Sim       | Sim |            |           |
| nome       | varchar(30)  | Sim       |     |            |           |

### USUARIO

Tabela para armazenar os dados e credenciais das pessoas que poderão acessar o dashboard.

| Coluna     | Tipo         | NOT NULL? | PK? | REFERENCES | DEFAULT   |
| --------   | --------     | --------- | --- | ---------- | -------   |
| id         | SERIAL       | Sim       | Sim |            |           |
| nome       | varchar(100) | Sim       |     |            |           |
| email      | varchar(100) | Sim       |     |            |           |
| senha      | text         | Sim       |     |            |           |

### RESTAURANTE

Tabela para armazenar os dados dos restaurantes e algumas de suas configurações.

| Coluna                | Tipo         | NOT NULL? | PK? | REFERENCES    | DEFAULT   |
| --------              | --------     | --------- | --- | ----------    | -------   |
| id                    | SERIAL       | Sim       | Sim |               |           |
| usuario_id            | integer      | Sim       |     | usuario(id)   |           |
| nome                  | varchar(50)  | Sim       |     |               |           |
| descricao             | varchar(100) |           |     |               |           |
| categoria_id          | integer      | Sim       |     | categoria(id) |           |
| taxa_entrega          | integer      | Sim       |     |               | 0         |
| tempo_entrega_minutos | integer      | Sim       |     |               | 30        |
| valor_minimo_pedido   | integer      | Sim       |     |               | 0         |

### PRODUTO

Tabela para armazenar os dados dos produtos ofertados pelos restaurantes.

| Coluna              | Tipo         | NOT NULL? | PK? | REFERENCES      | DEFAULT   |
| --------            | --------     | --------- | --- | ----------      | -------   |
| id                  | SERIAL       | Sim       | Sim |                 |           |
| restaurante_id      | integer      | Sim       |     | restaurante(id) |           |
| nome                | varchar(50)  | Sim       |     |                 |           |
| descricao           | varchar(100) |           |     |                 |           |
| preco               | integer      | Sim       |     |                 |           |
| ativo               | boolean      | Sim       |     |                 | TRUE      |
| permite_observacoes | boolean      | Sim       |     |                 | FALSE     |

## ENDPOINTS DA API

### POST /usuarios

Endpoint para atender a funcionalidade de criar um novo usuário para o dashboard. Ele deverá receber tanto os dados do usuário quanto os dados do restaurante através de objeto JSON no corpo da requisição no formato abaixo.


### POST /login

Endpoint para realização de login dos usuários no dashboard, de forma que realize:
* A validação das credenciais do usuário (e-mail e senha), retornando mensagens adequadas quando as credenciais não forem válidas
* A autenticação dos usuários, gerando e retornando token válido como resposta

### GET /produtos

Endpoint para retornar uma lista de todos os produtos cadastrados naquele restaurante.

### GET /produtos/:id

Endpoint para retornar os detalhes de um produto em específico. 

### POST /produtos

Endpoint para cadastrar um novo produto. Deverá receber um objeto JSON representando o produto (conforme formato no exemplo abaixo) e deverá cadastrá-lo no banco de dados relacionado ao restaurante.

### PUT /produtos/:id

Endpoint para alterar os dados de um produto em específico. Deverá receber um objeto JSON representando o produto com os novos dados que se deseja persistir em banco de dados conforme formato no exemplo abaixo.

### DELETE /produtos/:id

Endpoint para excluir um produto existente. Não deverá receber conteúdo no corpo da requisição, mas deverá receber o ID do produto através de parâmetro de rota (params).

### POST /produtos/:id/ativar

Endpoint para ativar um produto existente. Não deverá receber conteúdo no corpo da requisição, mas deverá receber o ID do produto como parâmetro de rota (params) conforme assinatura do endpoint no título acima.

### POST /produtos/:id/desativar

Endpoint para ativar um produto existente. Não deverá receber conteúdo no corpo da requisição, mas deverá receber o ID do produto como parâmetro de rota (params) conforme assinatura do endpoint no título acima.