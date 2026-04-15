import { z } from "zod";

// Este é o "molde" para o Login
export const loginSchema = z.object({
  email: z.string()
    .email("Insira um e-mail válido") // Verifica se tem @ e .com
    .min(5, "E-mail muito curto"),
  senha: z.string()
    .min(6, "A senha deve ter pelo menos 6 caracteres")
    .max(20, "Senha muito longa")
});

// Este é o "molde" para o Cadastro de Usuário (mais rigoroso)
export const cadastroSchema = z.object({
  nome: z.string()
    .min(3, "Nome deve ter pelo menos 3 letras")
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, "Nome não pode conter números ou símbolos"), // Bloqueia <script>
  email: z.string().email("E-mail inválido"),
  senha: z.string().min(8, "A senha precisa de 8 dígitos para segurança do BPM")
});