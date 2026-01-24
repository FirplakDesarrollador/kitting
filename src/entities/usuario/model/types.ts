import { z } from 'zod'

export const usuarioSchema = z.object({
    id: z.string().uuid(),
    email: z.string().email(),
    nombre: z.string().optional(),
    avatar_url: z.string().url().optional(),
    rol: z.enum(['admin', 'usuario', 'supervisor']).default('usuario'),
    activo: z.boolean().default(true),
    created_at: z.string().datetime().optional(),
    updated_at: z.string().datetime().optional(),
})

export type Usuario = z.infer<typeof usuarioSchema>

export interface UsuarioSession {
    user: Usuario | null
    isLoading: boolean
    isAuthenticated: boolean
}
