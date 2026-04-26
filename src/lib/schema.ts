import { z } from "zod";

export const productoSchema = z.object({
    sabor: z
        .string()
        .min(1, { message: "El sabor es requerido (ej. Oreo)" })
        .trim(),

    contenido_ml: z
        .number({ required_error: "El contenido en ml es requerido", invalid_type_error: "Debe ser un número" })
        .int()
        .positive({ message: "El contenido en ml debe ser mayor a 0" }),

    tipo: z
        .enum(["leche", "agua"], {
            errorMap: () => ({ message: "El tipo debe ser válido (ej. 'leche' o 'agua')" })
        }),

    precio_venta: z
        .number({ required_error: "El precio de venta es requerido", invalid_type_error: "Debe ser un número" })
        .positive({ message: "El precio de venta debe ser mayor a 0" }),

    costo_produccion_actual: z
        .number({ required_error: "El costo de producción es requerido", invalid_type_error: "Debe ser un número" })
        .positive({ message: "El costo de producción debe ser mayor a 0" }),
});

// Infer the TypeScript type for your React components (e.g., React Hook Form)
export type ProductoInput = z.infer<typeof productoSchema>;