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

export const loteSchema = z.object({
    productoPublicId: z.string().uuid("Producto inválido"),

    fechaProduccion: z.string().min(1, "La fecha es requerida"),

    cantidadProducida: z.number({
        required_error: "Cantidad requerida",
        invalid_type_error: "Debe ser número",
    }).int().positive(),

    costoProduccion: z.number({
        required_error: "Costo requerido",
        invalid_type_error: "Debe ser número",
    }).positive(),
});
// Infer the TypeScript type for your React components (e.g., React Hook Form)
export type ProductoInput = z.infer<typeof productoSchema>;
export type LoteInput = z.infer<typeof loteSchema>;