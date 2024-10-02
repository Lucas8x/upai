import { Sex } from '@prisma/client';
import { z } from '@/utils/zod';
import { ACCEPTED_IMAGE_TYPES, MAX_UPLOAD_FILE_SIZE } from '@/config';

export const filesSchema = z
  .array(
    z
      .instanceof(File)
      .refine(
        (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
        `Apenas imagens ${ACCEPTED_IMAGE_TYPES.join(', ').replace('image/', '')} são permitidos.`,
      )
      .refine((file) => file.size <= MAX_UPLOAD_FILE_SIZE, {
        message: `Os arquivo devem ter menos de ${MAX_UPLOAD_FILE_SIZE}MB.`,
      }),
  )
  .min(1, { message: 'Selecione pelo menos um arquivo.' });

export const postSchema = z.object({
  title: z
    .string()
    .min(4, { message: 'O titulo deve ter pelo menos 4 caracteres.' })
    .max(75, { message: 'O titulo deve ter no máximo 75 caracteres.' }),
  description: z
    .string()
    .max(300, { message: 'A descrição deve ter no máximo 300 caracteres.' })
    .optional(),
  files: filesSchema,
});

export const CommentSchema = z.object({
  comment: z
    .string()
    .min(5, {
      message: 'Comentário deve ter pelo menos 5 caracteres.',
    })
    .max(160, {
      message: 'Comentário deve ter no máximo 160 caracteres.',
    }),
});

export const UserProfileDetailsSchema = z.object({
  sex: z.enum(['male', 'female', 'none']).optional(),
  country: z.string().optional(),
  birthdate: z.string().optional(),
  biography: z.string().max(150).optional(),
});

export const LoginCredentialsFormSchema = z.object({
  username: z
    .string()
    .min(3, { message: 'O nome de usuário deve ter pelo menos 3 caracteres.' })
    .max(20, { message: 'O nome de usuário deve ter no máximo 20 caracteres.' })
    .regex(/^[a-zA-Z0-9]+$/, {
      message: 'O nome de usuário deve conter apenas letras e números.',
    }),
  password: z.string().min(6, {
    message: 'A senha deve ter pelo menos 6 caracteres.',
  }),
});

export const SignUpCredentialsFormSchema = LoginCredentialsFormSchema.extend({
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'As senhas devem coincidir',
  path: ['confirmPassword'],
});
