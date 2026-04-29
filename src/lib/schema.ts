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

export const ventaSchema = z.object({
    clientePublicId: z.string().optional(),
    usuarioPublicId: z.string().min(1, "El usuario es requerido"),
    metodoPago: z.enum(["efectivo", "tarjeta", "transferencia"]),
    detalles: z.array(z.object({
        productoPublicId: z.string().min(1, "Seleccione un producto"),
        cantidad: z.number().int().positive("La cantidad debe ser mayor a 0"),
        tipoDescuento: z.enum(["promocion", "empleado", "regalo"]).nullable(),
    })).min(1, "Debe agregar al menos un producto"),
});

export const clienteSchema = z.object({
    nombre: z.string().min(1, "El nombre es requerido").trim(),
    email: z.string().email("Email inválido").or(z.literal("")).nullable(),
    telefono: z.string().or(z.literal("")).nullable(),
    fechaNacimiento: z.string().or(z.literal("")).nullable(),
    direccion: z.string().or(z.literal("")).nullable(),
    activo: z.boolean().default(true),
});

export const usuarioSchema = z.object({
    nombre: z.string().min(1, "El nombre es requerido").trim(),
    email: z.string().email("Email inválido").trim(),
    password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres").optional().or(z.literal("")),
    rol: z.string().min(1, "El rol es requerido"),
    activo: z.boolean().default(true),
});

// Infer the TypeScript type for your React components (e.g., React Hook Form)
export type ProductoInput = z.infer<typeof productoSchema>;
export type LoteInput = z.infer<typeof loteSchema>;
export type VentaInput = z.infer<typeof ventaSchema>;
export type ClienteInput = z.infer<typeof clienteSchema>;
export type UsuarioInput = z.infer<typeof usuarioSchema>;