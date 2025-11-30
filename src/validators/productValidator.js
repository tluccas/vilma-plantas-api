import * as yup from 'yup';

// Schema para criar produto
export const createProductSchema = yup.object().shape({
  name: yup
    .string()
    .required('Nome é obrigatório')
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres')
    .trim(),

  description: yup
    .string()
    .nullable()
    .max(1000, 'Descrição deve ter no máximo 1000 caracteres')
    .trim(),

  price: yup
    .number()
    .required('Preço é obrigatório')
    .positive('Preço deve ser um valor positivo')
    .min(0.01, 'Preço deve ser maior que zero')
    .max(999999.99, 'Preço deve ser menor que R$ 999.999,99'),

  stock: yup
    .number()
    .required('Estoque é obrigatório')
    .integer('Estoque deve ser um número inteiro')
    .min(0, 'Estoque não pode ser negativo')
    .max(99999, 'Estoque deve ser menor que 99.999'),

  category_id: yup
    .number()
    .required('Categoria é obrigatória')
    .integer('ID da categoria deve ser um número inteiro')
    .positive('ID da categoria deve ser um valor positivo'),
});

// Schema para atualizar produto (campos opcionais)
export const updateProductSchema = yup.object().shape({
  name: yup
    .string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres')
    .trim(),

  description: yup
    .string()
    .nullable()
    .max(1000, 'Descrição deve ter no máximo 1000 caracteres')
    .trim(),

  price: yup
    .number()
    .positive('Preço deve ser um valor positivo')
    .min(0.01, 'Preço deve ser maior que zero')
    .max(999999.99, 'Preço deve ser menor que R$ 999.999,99'),

  stock: yup
    .number()
    .integer('Estoque deve ser um número inteiro')
    .min(0, 'Estoque não pode ser negativo')
    .max(99999, 'Estoque deve ser menor que 99.999'),

  category_id: yup
    .number()
    .integer('ID da categoria deve ser um número inteiro')
    .positive('ID da categoria deve ser um valor positivo'),
});

// Schema para filtros de busca
export const getProductsSchema = yup.object().shape({
  page: yup
    .number()
    .integer('Página deve ser um número inteiro')
    .min(1, 'Página deve ser maior que zero')
    .transform((value, originalValue) => {
      return originalValue === '' ? undefined : value;
    }),

  limit: yup
    .number()
    .integer('Limite deve ser um número inteiro')
    .min(1, 'Limite deve ser maior que zero')
    .max(100, 'Limite deve ser menor ou igual a 100')
    .transform((value, originalValue) => {
      return originalValue === '' ? undefined : value;
    }),

  category: yup
    .number()
    .integer('Categoria deve ser um número inteiro')
    .positive('Categoria deve ser um valor positivo')
    .transform((value, originalValue) => {
      return originalValue === '' ? undefined : value;
    }),

  minPrice: yup
    .number()
    .min(0, 'Preço mínimo deve ser maior ou igual a zero')
    .transform((value, originalValue) => {
      return originalValue === '' ? undefined : value;
    }),

  maxPrice: yup
    .number()
    .min(0, 'Preço máximo deve ser maior ou igual a zero')
    .transform((value, originalValue) => {
      return originalValue === '' ? undefined : value;
    })
    .test('max-greater-than-min', 'Preço máximo deve ser maior que o mínimo', function (value) {
      const { minPrice } = this.parent;
      if (minPrice && value && value < minPrice) {
        return false;
      }
      return true;
    }),

  sort: yup
    .string()
    .matches(
      /^(name|price|createdAt|stock)_(asc|desc)$/i,
      'Ordenação deve seguir o padrão: campo_direção (ex: price_asc, name_desc)',
    ),
});

// Middleware para validação
export const validateCreateProduct = async (req, res, next) => {
  try {
    const validatedData = await createProductSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    req.body = validatedData;
    next();
  } catch (error) {
    return res.status(400).json({
      error: 'Dados de entrada inválidos',
      details: error.errors,
    });
  }
};

export const validateUpdateProduct = async (req, res, next) => {
  try {
    const validatedData = await updateProductSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    req.body = validatedData;
    next();
  } catch (error) {
    return res.status(400).json({
      error: 'Dados de entrada inválidos',
      details: error.errors,
    });
  }
};

export const validateGetProducts = async (req, res, next) => {
  try {
    const validatedData = await getProductsSchema.validate(req.query, {
      abortEarly: false,
      stripUnknown: true,
    });

    req.query = validatedData;
    next();
  } catch (error) {
    return res.status(400).json({
      error: 'Parâmetros de busca inválidos',
      details: error.errors,
    });
  }
};

// Função para validação manual (para usar nos services)
export const validateProductData = async (data, isUpdate = false) => {
  const schema = isUpdate ? updateProductSchema : createProductSchema;

  try {
    const validatedData = await schema.validate(data, {
      abortEarly: false,
      stripUnknown: true,
    });

    return { isValid: true, data: validatedData };
  } catch (error) {
    return {
      isValid: false,
      errors: error.errors,
      message: 'Dados inválidos',
    };
  }
};
