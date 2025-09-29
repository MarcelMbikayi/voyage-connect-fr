import { z } from 'zod';

export const signUpSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, 'Le nom complet doit contenir au moins 2 caractères')
    .max(100, 'Le nom complet ne peut pas dépasser 100 caractères'),
  email: z
    .string()
    .trim()
    .email('Adresse email invalide')
    .max(255, 'L\'email ne peut pas dépasser 255 caractères'),
  password: z
    .string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .max(128, 'Le mot de passe ne peut pas dépasser 128 caractères')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre'
    ),
  confirmPassword: z.string(),
  phone: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^(\+33|0)[1-9](\d{8})$/.test(val),
      'Numéro de téléphone français invalide'
    ),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
});

export const signInSchema = z.object({
  email: z
    .string()
    .trim()
    .email('Adresse email invalide')
    .max(255, 'L\'email ne peut pas dépasser 255 caractères'),
  password: z
    .string()
    .min(1, 'Le mot de passe est requis')
    .max(128, 'Le mot de passe ne peut pas dépasser 128 caractères'),
});

export const resetPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .email('Adresse email invalide')
    .max(255, 'L\'email ne peut pas dépasser 255 caractères'),
});

export const profileUpdateSchema = z.object({
  full_name: z
    .string()
    .trim()
    .min(2, 'Le nom complet doit contenir au moins 2 caractères')
    .max(100, 'Le nom complet ne peut pas dépasser 100 caractères')
    .optional(),
  phone: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^(\+33|0)[1-9](\d{8})$/.test(val),
      'Numéro de téléphone français invalide'
    ),
  date_of_birth: z
    .string()
    .optional()
    .refine(
      (val) => !val || !isNaN(Date.parse(val)),
      'Date de naissance invalide'
    ),
  nationality: z
    .string()
    .trim()
    .max(50, 'La nationalité ne peut pas dépasser 50 caractères')
    .optional(),
  preferred_language: z
    .enum(['fr', 'en', 'es', 'de'])
    .optional(),
});

export const otpVerificationSchema = z.object({
  phone: z
    .string()
    .regex(/^(\+33|0)[1-9](\d{8})$/, 'Numéro de téléphone français invalide'),
  otp_code: z
    .string()
    .length(6, 'Le code OTP doit contenir 6 chiffres')
    .regex(/^\d{6}$/, 'Le code OTP doit contenir uniquement des chiffres'),
});

export type SignUpFormData = z.infer<typeof signUpSchema>;
export type SignInFormData = z.infer<typeof signInSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type ProfileUpdateFormData = z.infer<typeof profileUpdateSchema>;
export type OTPVerificationFormData = z.infer<typeof otpVerificationSchema>;