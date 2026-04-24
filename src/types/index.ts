export type Producto = {
    id: number;
    public_id: string;

    sabor: string;
    contenido_ml: number;

    tipo: "leche" | "agua";

    precio_venta: string;
    costo_produccion_actual: string;

    activo: boolean;

    creado_en: string;
    actualizado_en: string;
};
export type Lote = {
    id: number;
    publicId: string;
    productoId: number;
    fechaProduccion: string | Date;
    cantidadProducida: number;
    costoProduccion: string;
    producto: {
        productoId: number;
        sabor: string;
        tipo: "agua" | "leche";
    };
}

export type Inventario = {
    id: number
    publicId: string
    productoId: number
    cantidad: number
    actualizadoEn: string
    producto: {
        productoId: number
        sabor: string
        tipo: string
    }
}


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