# Vilma Plantas — Entidades e Relacionamentos

Documento com todas as entidades descritas do backend da API do E-commerce **Vilma Plantas**.

---

## 1. User

### Atributos principais
| Campo      | Tipo     | Observações                     |
|------------|---------|--------------------------------|
| id         | INTEGER | PK, auto incremento            |
| name       | STRING  | Nome completo do usuário       |
| email      | STRING  | Único, usado para login        |
| password   | STRING  | Hash da senha                  |
| role       | STRING  | `customer` ou `admin`          |
| created_at | DATE    | Timestamp criação              |
| updated_at | DATE    | Timestamp atualização          |

### Métodos/Comportamento
- Hash de senha automático (`bcrypt`) antes de criar/atualizar
- `checkPassword(password)` para validação de login

### Relacionamentos
- 1 User → N Pedidos
- 1 User → N Endereco (talvez mdue)

---

## 2. Categoria

### Atributos principais
| Campo      | Tipo     | Observações              |
|------------|---------|-------------------------|
| id         | INTEGER | PK, auto incremento     |
| name       | STRING  | Nome da categoria       |
| descricao  | STRING  | Descrição opcional      |
| created_at | DATE    | Timestamp criação       |
| updated_at | DATE    | Timestamp atualização   |

### Relacionamentos
- 1 Categoria → N Produtos

---

## 3. Produto

### Atributos principais
| Campo        | Tipo     | Observações                          |
|--------------|---------|-------------------------------------|
| id           | INTEGER | PK, auto incremento                  |
| name         | STRING  | Nome do produto                       |
| descricao    | TEXT    | Descrição detalhada                   |
| preco        | DECIMAL | Preço                                 |
| estoque      | INTEGER | Quantidade disponível                 |
| categoria_id | INTEGER | FK → Categoria(id)                     |
| created_at   | DATE    | Timestamp criação                     |
| updated_at   | DATE    | Timestamp atualização                 |

### Relacionamentos
- 1 Produto → 1 Categoria
- 1 Produto → N ItemPedido
- 1 Produto → N Imagens (criar tabela e model de imagens ainda)

---

## 4. Pedido

### Atributos principais
| Campo       | Tipo     | Observações                        |
|-------------|---------|-----------------------------------|
| id          | INTEGER | PK, auto incremento               |
| user_id     | INTEGER | FK → User(id)                      |
| total       | DECIMAL | Valor total do pedido             |
| status      | STRING  | `pending`, `paid`, `shipped`, `delivered` |
| created_at  | DATE    | Timestamp criação                  |
| updated_at  | DATE    | Timestamp atualização              |

### Relacionamentos
- 1 Pedido → 1 User
- 1 Pedido → N ItemPedido

---

## 5. PedidoItem

### Atributos principais
| Campo       | Tipo     | Observações               |
|-------------|---------|--------------------------|
| id          | INTEGER | PK, auto incremento      |
| pedido_id   | INTEGER | FK → Pedido(id)           |
| produto_id  | INTEGER | FK → Produto(id)         |
| quantidade  | INTEGER | Quantidade               |
| preco       | DECIMAL | Preço unitário           |
| created_at  | DATE    | Timestamp criação        |
| updated_at  | DATE    | Timestamp atualização    |

### Relacionamentos
- 1 PedidoItem → 1 Pedido
- 1 PedidoItem → 1 Produto

---

## 6. Imagem 

### Atributos principais
| Campo       | Tipo     | Observações              |
|-------------|---------|-------------------------|
| id          | INTEGER | PK, auto incremento     |
| produto_id  | INTEGER | FK → Produto(id)        |
| url         | STRING  | Caminho/URL da imagem   |
| created_at  | DATE    | Timestamp criação       |
| updated_at  | DATE    | Timestamp atualização   |

### Relacionamentos
- 1 Imagem → 1 Produto

---

## 7. Endereco (pensando maneira viável implementar o relacionamento)

### Atributos principais
| Campo       | Tipo     | Observações               |
|-------------|---------|--------------------------|
| id          | INTEGER | PK, auto incremento      |
| user_id     | INTEGER | FK → User(id)            |
| rua         | STRING  | Rua                       |
| cidade      | STRING  | Cidade                    |
| estado      | STRING  | Estado                    |
| cep_cod     | STRING  | CEP                       |
| país        | STRING  | País                      |
| created_at  | DATE    | Timestamp criação         |
| updated_at  | DATE    | Timestamp atualização     |

### Relacionamentos
- 1 Endereco → 1 User

---

## 🔗 Resumo de relacionamentos

