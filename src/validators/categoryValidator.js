import * as yup from 'yup';

// Schema para criar categoria
export const createCategorySchema = yup.object().shape({
  name: yup
    .string()
    .required('Nome da categoria é obrigatório')
    .strict(true)
    .typeError('Nome deve ser uma string')
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(50, 'Nome deve ter no máximo 50 caracteres')
    .trim(),

  description: yup
    .string()
    .nullable()
    .strict(true)
    .typeError('Descrição deve ser uma string')
    .max(500, 'Descrição deve ter no máximo 500 caracteres')
    .trim(),
});

// Schema para atualizar categoria (campos opcionais)
export const updateCategorySchema = yup.object().shape({
  name: yup
    .string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(50, 'Nome deve ter no máximo 50 caracteres')
    .strict(true)
    .typeError('Nome deve ser uma string')
    .trim(),

  description: yup
    .string()
    .strict(true)
    .nullable()
    .typeError('Descrição deve ser uma string')
    .max(500, 'Descrição deve ter no máximo 500 caracteres')
    .trim(),
});

// Schema para validar ID de categoria
export const categoryIdSchema = yup.object().shape({
  id: yup
    .number()
    .integer('ID deve ser um número inteiro')
    .positive('ID deve ser um valor positivo')
    .required('ID da categoria é obrigatório'),
});

// Schema para filtros de busca de categorias
export const categoryFiltersSchema = yup.object().shape({
  page: yup
    .number()
    .integer('Página deve ser um número inteiro')
    .positive('Página deve ser um valor positivo')
    .min(1, 'Página deve ser no mínimo 1')
    .max(1000, 'Página deve ser no máximo 1000'),

  limit: yup
    .number()
    .integer('Limite deve ser um número inteiro')
    .positive('Limite deve ser um valor positivo')
    .min(1, 'Limite deve ser no mínimo 1')
    .max(100, 'Limite deve ser no máximo 100'),

  name: yup
    .string()
    .min(1, 'Nome para busca deve ter pelo menos 1 caractere')
    .max(50, 'Nome para busca deve ter no máximo 50 caracteres')
    .trim(),

  sort: yup
    .string()
    .oneOf(
      ['name_ASC', 'name_DESC', 'createdAt_ASC', 'createdAt_DESC'],
      'Ordenação deve ser: name_ASC, name_DESC, createdAt_ASC ou createdAt_DESC',
    ),
});
