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