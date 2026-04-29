// ─── Producto ────────────────────────────────────────────────────────────────
// Backend returns `id` as the internal integer AND `publicId` as the UUID.
// VentaCreate matches inventory via `String(i.producto.productoId) === String(p.id)`
// so `id` on Producto must be number (matches the DB column).
export type Producto = {
    id: number;
    publicId: string;

    sabor: string;
    contenido_ml: number;

    tipo: "leche" | "agua";

    precio_venta: string;
    costo_produccion_actual: string;

    activo: boolean;

    creado_en: string;
    actualizado_en: string;
};

// ─── Lote ────────────────────────────────────────────────────────────────────
// Backend JOIN returns producto fields nested. `costoProduccion` comes back as
// a numeric string from the DB (decimal column). `fechaProduccion` is always a
// plain date string ("yyyy-MM-dd") from the API — the Date union is misleading
// and causes issues in the list cell which calls .split("-") on it.
export type Lote = {
    id: number;
    publicId: string;
    productoId: number;
    fechaProduccion: string; // always "yyyy-MM-dd" from API — removed `| Date`
    cantidadProducida: number;
    costoProduccion: string;
    producto: {
        productoId: number;
        sabor: string;
        tipo: "agua" | "leche";
    };
};

// ─── Inventario ──────────────────────────────────────────────────────────────
// `tipo` is constrained on Producto, mirror that here for consistency.
export type Inventario = {
    id: number;
    publicId: string;
    productoId: number;
    cantidad: number;
    actualizadoEn: string;
    producto: {
        productoId: number;
        sabor: string;
        tipo: "agua" | "leche"; // FIX: was `string`, should match Producto
    };
};

// ─── DetalleVenta ────────────────────────────────────────────────────────────
// The backend GET / aggregates details as JSON_BUILD_OBJECT with these exact keys:
//   detalleId, productoId (= producto.publicId UUID!), sabor, cantidad,
//   precioUnitario, subtotal, tipoDescuento
// The GET /:publicId returns details via a separate SELECT with a nested `producto`
// object { publicId, sabor }.
// FIX: `productoId` in the aggregated list response is actually the product's
// publicId (UUID string), not the internal integer — renamed to avoid confusion.
// FIX: removed the ambiguous top-level `publicId` field; the product public id
// lives under `producto.publicId` in the show response.
export interface DetalleVenta {
    detalleId?: number;
    ventaId?: number;
    // In the list (aggregated) response this is the product's publicId (UUID).
    // In the show response the integer productoId comes from getTableColumns and
    // the UUID is nested under `producto.publicId`.
    productoPublicId?: string; // list response field (was mis-named `productoId`)
    productoId?: number;       // show response internal id from getTableColumns
    sabor?: string;            // present in list aggregation, absent in show
    cantidad: number;
    precioUnitario: string;
    subtotal: string;
    tipoDescuento: "promocion" | "empleado" | "regalo" | null;
    producto?: {
        publicId: string;
        sabor: string;
    };
    // Backend specific fields from show.tsx
    producto_sabor?: string;
    producto_tipo?: string;
    contenido_ml?: number;
    precio_unitario?: string;
    tipo_descuento?: string | null;
}

// ─── Venta ───────────────────────────────────────────────────────────────────
// FIX: `metodoPago` narrowed to the actual union — backend only accepts these
// three values and the frontend Select only offers these three options.
// FIX: `total` is a decimal string from DB — kept as string (use parseFloat to display).
export type MetodoPago = "efectivo" | "tarjeta" | "transferencia";

export interface Venta {
    id: number;
    publicId: string;
    clienteId: number | null;
    usuarioId: number;
    fecha: string;          // ISO datetime string
    total: string;          // decimal string — use parseFloat() to display
    metodo_pago: MetodoPago; // FIX: was `string`
    estado: boolean;
    cliente?: {
        publicId: string;
        nombre: string;
    } | null;               // FIX: can be null (LEFT JOIN with no matching client)
    usuario: {              // FIX: was optional — backend uses INNER JOIN so always present
        publicId: string;
        nombre: string;
    };
    detalles: DetalleVenta[];
}

// ─── VentaSummary ────────────────────────────────────────────────────────────
// Matches the fixed backend /summary response exactly.
export interface VentaSummary {
    totalVentas: number;
    cantidadVentas: number;
    ventasActivas: number;
    ventasAnuladas: number;
    metodoPago: {
        metodoPago: MetodoPago;
        total: number;
        cantidad: number;
    }[];
}

// ─── Cliente ─────────────────────────────────────────────────────────────────
// Referenced in VentaCreate but was missing from types entirely.
export interface Cliente {
    id: number;
    publicId: string;
    nombre: string;
    email: string | null;
    telefono: string | null;
    fechaNacimiento: string | null;
    direccion: string | null;
    activo: boolean;
    creadoEn: string;
}

// ─── Usuario ─────────────────────────────────────────────────────────────────
// Referenced in Venta but was missing as a standalone type.
export interface Usuario {
    id: number;
    publicId: string;
    nombre: string;
    email: string;
    rol: string;
    activo: boolean;
}

// ─── Generic API response wrappers ───────────────────────────────────────────
export type ListResponse<T = unknown> = {
    data?: T[];
    pagination?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
};

export type CreateResponse<T = unknown> = {
    data?: T;
};

export type GetOneResponse<T = unknown> = {
    data?: T;
};

// ─── Cloudinary ──────────────────────────────────────────────────────────────
declare global {
    interface CloudinaryUploadWidgetResults {
        event: string;
        info: {
            secure_url: string;
            public_id: string;
            delete_token?: string;
            resource_type: string;
            original_filename: string;
        };
    }

    interface CloudinaryWidget {
        open: () => void;
    }

    interface Window {
        cloudinary?: {
            createUploadWidget: (
                options: Record<string, unknown>,
                callback: (
                    error: unknown,
                    result: CloudinaryUploadWidgetResults
                ) => void
            ) => CloudinaryWidget;
        };
    }
}

export interface UploadWidgetValue {
    url: string;
    publicId: string;
}

export interface UploadWidgetProps {
    value?: UploadWidgetValue | null;
    onChange?: (value: UploadWidgetValue | null) => void;
    disabled?: boolean;
}