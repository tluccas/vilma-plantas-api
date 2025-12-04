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

  // Suporte para múltiplas imagens
  images: yup
    .array()
    .of(
      yup.object().shape({
        url: yup
          .string()
          .required('URL da imagem é obrigatória')
          .url('URL da imagem deve ser uma URL válida')
          .matches(
            /\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i,
            'URL deve apontar para um arquivo de imagem válido (jpg, jpeg, png, gif, webp, svg)',
          )
          .max(500, 'URL da imagem deve ter no máximo 500 caracteres'),
      }),
    )
    .nullable()
    .max(10, 'Máximo de 10 imagens permitidas')
    .test('unique-urls', 'URLs das imagens devem ser únicas', function (images) {
      if (!images) return true;
      const urls = images.map((img) => img.url);
      return urls.length === new Set(urls).size;
    }),

  // Recebe uma imagem única para compatibilidade retroativa
  image_url: yup
    .string()
    .url('URL da imagem deve ser uma URL válida')
    .matches(
      /\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i, // regex para extensões de imagem comuns
      'URL deve apontar para um arquivo de imagem válido (jpg, jpeg, png, gif, webp, svg)',
    )
    .max(500, 'URL da imagem deve ter no máximo 500 caracteres')
    .nullable(),
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

  // Suporte para múltiplas imagens no update
  images: yup
    .array()
    .of(
      yup.object().shape({
        url: yup
          .string()
          .required('URL da imagem é obrigatória')
          .url('URL da imagem deve ser uma URL válida')
          .matches(
            /\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i,
            'URL deve apontar para um arquivo de imagem válido (jpg, jpeg, png, gif, webp, svg)',
          )
          .max(500, 'URL da imagem deve ter no máximo 500 caracteres'),
      }),
    )
    .nullable()
    .max(10, 'Máximo de 10 imagens permitidas')
    .test('unique-urls', 'URLs das imagens devem ser únicas', function (images) {
      if (!images) return true;
      const urls = images.map((img) => img.url);
      return urls.length === new Set(urls).size;
    }),

  // Backward compatibility
  image_url: yup
    .string()
    .url('URL da imagem deve ser uma URL válida')
    .matches(
      /\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i,
      'URL deve apontar para um arquivo de imagem válido (jpg, jpeg, png, gif, webp, svg)',
    )
    .max(500, 'URL da imagem deve ter no máximo 500 caracteres')
    .nullable(),
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

// Função helper para normalizar dados de imagem
const normalizeImageData = (data) => {
  // Se recebeu image_url (compatibilidade), converte para images array
  if (data.image_url && !data.images) {
    data.images = [{ url: data.image_url }];
    delete data.image_url;
  }

  // Se recebeu string única no campo images, converte para array
  if (typeof data.images === 'string') {
    data.images = [{ url: data.images }];
  }

  // Se recebeu array de strings, converte para array de objetos
  if (Array.isArray(data.images) && data.images.length > 0 && typeof data.images[0] === 'string') {
    data.images = data.images.map((url) => ({ url }));
  }

  return data;
};

// Middleware para validação
export const validateCreateProduct = async (req, res, next) => {
  try {
    // Normaliza os dados de imagem antes da validação
    req.body = normalizeImageData(req.body);

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
    // Normaliza os dados de imagem antes da validação
    req.body = normalizeImageData(req.body);

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
    // Normaliza os dados de imagem antes da validação
    const normalizedData = normalizeImageData({ ...data });

    const validatedData = await schema.validate(normalizedData, {
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

// Schema para validação de upload de imagens
export const imageUploadSchema = yup.object().shape({
  images: yup
    .array()
    .of(
      yup.object().shape({
        fieldname: yup.string().required(),
        originalname: yup.string().required(),
        mimetype: yup
          .string()
          .required()
          .matches(
            /^image\/(jpeg|jpg|png|gif|webp|svg\+xml)$/,
            'Arquivo deve ser uma imagem válida (JPEG, PNG, GIF, WebP, SVG)'
          ),
        size: yup
          .number()
          .required()
          .max(5 * 1024 * 1024, 'Imagem deve ter no máximo 5MB'), // 5MB
      })
    )
    .min(1, 'Pelo menos uma imagem é obrigatória')
    .max(10, 'Máximo de 10 imagens permitidas'),
});

// Validador para arquivos de imagem
export const validateImageUpload = async (req, res, next) => {
  try {
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      return res.status(400).json({
        error: 'Nenhuma imagem foi enviada',
        message: 'É obrigatório enviar pelo menos uma imagem',
      });
    }

    const validatedData = await imageUploadSchema.validate(
      { images: req.files },
      {
        abortEarly: false,
        stripUnknown: true,
      }
    );

    req.files = validatedData.images;
    next();
  } catch (error) {
    return res.status(400).json({
      error: 'Arquivos de imagem inválidos',
      details: error.errors,
    });
  }
};
