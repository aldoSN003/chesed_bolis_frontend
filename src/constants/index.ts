export const BOLIS=["agua", "leche"];
export const BOLIS_OPTIONS = BOLIS.map(boli => ({label:boli,value:boli}));

export const METODOS_PAGO=['efectivo', 'tarjeta', 'transferencia'];
export const METODOS_PAGO_OPTIONS = METODOS_PAGO.map(metodo => ({label:metodo,value:metodo}));

const getEnvVar = (key: string): string => {
    const value = import.meta.env[key];
    if (!value) {
        throw new Error(`Missing environment variable: ${key}`);
    }
    return value;
};

export const BACKEND_BASE_URL = getEnvVar("VITE_BACKEND_BASE_URL");

export const BASE_URL =  import.meta.env.VITE_API_URL;