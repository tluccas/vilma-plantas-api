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
- 1 User → N Orders
- 1 User → N Addresses (opcional, caso implemente múltiplos endereços)

---

## 2. Category

### Atributos principais
| Campo      | Tipo     | Observações              |
|------------|---------|-------------------------|
| id         | INTEGER | PK, auto incremento     |
| name       | STRING  | Nome da categoria       |
| description| STRING  | Descrição opcional      |
| created_at | DATE    | Timestamp criação       |
| updated_at | DATE    | Timestamp atualização   |

### Relacionamentos
- 1 Category → N Products

---

## 3. Product

### Atributos principais
| Campo        | Tipo     | Observações                          |
|--------------|---------|-------------------------------------|
| id           | INTEGER | PK, auto incremento                  |
| name         | STRING  | Nome do produto                       |
| description  | TEXT    | Descrição detalhada                   |
| price        | DECIMAL | Preço                                 |
| stock        | INTEGER | Quantidade disponível                 |
| category_id  | INTEGER | FK → Category(id)                     |
| created_at   | DATE    | Timestamp criação                     |
| updated_at   | DATE    | Timestamp atualização                 |

### Relacionamentos
- 1 Product → 1 Category
- 1 Product → N OrderItems
- 1 Product → N Images (se usar tabela de imagens separada)

---

## 4. Order

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
- 1 Order → 1 User
- 1 Order → N OrderItems

---

## 5. OrderItem

### Atributos principais
| Campo       | Tipo     | Observações               |
|-------------|---------|--------------------------|
| id          | INTEGER | PK, auto incremento      |
| order_id    | INTEGER | FK → Order(id)           |
| product_id  | INTEGER | FK → Product(id)         |
| quantity    | INTEGER | Quantidade               |
| price       | DECIMAL | Preço unitário           |
| created_at  | DATE    | Timestamp criação        |
| updated_at  | DATE    | Timestamp atualização    |

### Relacionamentos
- 1 OrderItem → 1 Order
- 1 OrderItem → 1 Product

---

## 6. Image (opcional)

### Atributos principais
| Campo       | Tipo     | Observações              |
|-------------|---------|-------------------------|
| id          | INTEGER | PK, auto incremento     |
| product_id  | INTEGER | FK → Product(id)        |
| url         | STRING  | Caminho/URL da imagem   |
| created_at  | DATE    | Timestamp criação       |
| updated_at  | DATE    | Timestamp atualização   |

### Relacionamentos
- 1 Image → 1 Product

---

## 7. Address (opcional)

### Atributos principais
| Campo       | Tipo     | Observações               |
|-------------|---------|--------------------------|
| id          | INTEGER | PK, auto incremento      |
| user_id     | INTEGER | FK → User(id)            |
| street      | STRING  | Rua                       |
| city        | STRING  | Cidade                    |
| state       | STRING  | Estado                    |
| zip_code    | STRING  | CEP                       |
| country     | STRING  | País                      |
| created_at  | DATE    | Timestamp criação         |
| updated_at  | DATE    | Timestamp atualização     |

### Relacionamentos
- 1 Address → 1 User

---

## 🔗 Resumo de relacionamentos

- User 1 ── N Order
- Order 1 ── N OrderItem
- Product 1 ── N OrderItem
- Category 1 ── N Product
- Product 1 ── N Image
- User 1 ── N Address



