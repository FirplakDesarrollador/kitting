import { z } from 'zod'

// Producto en la programación
export const productoSchema = z.object({
    id: z.string().optional(),
    ordenFabricacion: z.string().min(1, 'La orden de fabricación es requerida'),
    sku: z.string().min(1, 'El SKU es requerido'),
    descripcion: z.string().min(1, 'La descripción es requerida'),
    cantidad: z.number().min(1, 'La cantidad debe ser mayor a 0'),
})

export type Producto = z.infer<typeof productoSchema>

// Programación del día
export const programacionDiaSchema = z.object({
    id: z.string().uuid().optional(),
    estado: z.enum(['agendado', 'en_proceso', 'completado', 'cancelado']).default('agendado'),
    fechaProgramacion: z.string().datetime(),
    cantidadPiezas: z.number().default(0),
    cantidadPiezasRealizadas: z.number().default(0),
    productos: z.array(productoSchema),
    createdAt: z.string().datetime().optional(),
    updatedAt: z.string().datetime().optional(),
})

export type ProgramacionDia = z.infer<typeof programacionDiaSchema>

// Estado para el formulario
export interface ProgramacionFormState {
    productos: Producto[]
    loading: boolean
    error: string | null
    fechaProgramacion: Date
}
