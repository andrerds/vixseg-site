import { z } from 'zod';

// Contact Form Validation Schema
export const contactFormSchema = z.object({
  name: z
    .string()
    .min(3, 'Nome deve ter no mínimo 3 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres')
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, 'Nome deve conter apenas letras'),

  email: z
    .string()
    .email('E-mail inválido')
    .min(5, 'E-mail deve ter no mínimo 5 caracteres')
    .max(100, 'E-mail deve ter no máximo 100 caracteres')
    .toLowerCase(),

  phone: z
    .string()
    .regex(
      /^\(\d{2}\)\s?\d{4,5}-?\d{4}$/,
      'Telefone deve estar no formato (XX) XXXXX-XXXX'
    ),

  message: z
    .string()
    .min(10, 'Mensagem deve ter no mínimo 10 caracteres')
    .max(1000, 'Mensagem deve ter no máximo 1000 caracteres'),
});

export type ContactFormInput = z.infer<typeof contactFormSchema>;
