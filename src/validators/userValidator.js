import * as Yup from 'yup';

export const createUserSchema = Yup.object().shape({
  // Name
  name: Yup.string()
    .required('O nome é obrigatório')
    .min(3, 'O nome deve ter no mínimo 3 caracteres'),

  // Email
  email: Yup.string()
    .required('O email é obrigatório')
    .email('Insira um email válido'),

  // Password
  password: Yup.string()
    .required('A senha é obrigatória')
    .min(6, 'A senha deve ter no mínimo 6 caracteres'),

  // Role - Padrão é 'customer'
  role: Yup.string()
    .oneOf(['customer', 'admin'], 'O cargo (role) deve ser "customer" ou "admin"')
    .default('customer'),
});

// --- Login ---
export const loginUserSchema = Yup.object().shape({
  // Email
  email: Yup.string().required('O email é obrigatório').email('Insira um email válido'),

  // Password
  password: Yup.string().required('A senha é obrigatória'),
});

// --- Update ---
// Todos os campos são opcionais, exceto se a senha for alterada.
export const updateUserSchema = Yup.object().shape({
  // Name (Opcional)
  name: Yup.string()
    .min(3, 'O nome deve ter no mínimo 3 caracteres')
    .max(100, 'O nome deve ter no máximo 100 caracteres'),

  // Email (Opcional)
  email: Yup.string()
    .email('Insira um email válido')
    .max(255, 'O email deve ter no máximo 255 caracteres'),

  // Senha Antiga (Obrigatória se uma nova senha for inserida)
  oldPassword: Yup.string().when('password', {
    is: (password) => password && password.length > 0,
    then: (schema) => schema.required('A senha antiga é obrigatória para alterar a senha'),
    otherwise: (schema) => schema.notRequired(),
  }),

  // Nova Senha (Opcional)
  password: Yup.string().min(6, 'A nova senha deve ter no mínimo 6 caracteres'),

  // Confirmação de Senha (Opcional, mas deve ser igual à nova senha se for enviada)
  confirmPassword: Yup.string()
    .when('password', {
      is: (password) => password && password.length > 0,
      then: (schema) => schema.required('A confirmação da nova senha é obrigatória'),
      otherwise: (schema) => schema.notRequired(),
    })
    .oneOf([Yup.ref('password'), null], 'A confirmação de senha não coincide com a nova senha'),

  // Role (Apenas para desenvolvimento/administração)
  role: Yup.string().oneOf(['customer', 'admin'], 'O cargo (role) deve ser "customer" ou "admin"'),
});
