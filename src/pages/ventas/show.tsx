import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useOne } from "@refinedev/core";
import { Venta } from "@/types";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog.tsx";

import { Badge } from "@/components/ui/badge.tsx";
import { Separator } from "@/components/ui/separator.tsx";

import {
    ShoppingCart,
    Package,
    Tag,
    Droplets,
    Hash,
    User,
    Calendar,
    CreditCard,
    UserCircle,
} from "lucide-react";

const ShowVenta = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const {
        result,
        query: { isLoading },
    } = useOne<Venta>({
        resource: "ventas",
        id: id!,
    });

    const detalles = result?.detalles ?? [];
    const fecha = result?.fecha ?? "";

    const formattedDate = fecha
        ? new Date(fecha).toLocaleString("es-ES", {
            dateStyle: "medium",
            timeStyle: "short",
        })
        : "Fecha no disponible";

    const total = result?.total
        ? Number(result.total)
        : detalles.reduce(
            (sum, item) => sum + Number(item.subtotal ?? 0),
            0
        );

    return (
        <Dialog open={true} onOpenChange={() => navigate("/ventas")}>
            <DialogContent
                className="
                    w-[98vw]
                    sm:w-[95vw]
                    max-w-3xl
                    max-h-[90vh]
                    p-0
                    overflow-hidden
                    rounded-xl
                    border-0
                    shadow-2xl
                    flex flex-col
                "
            >
                {/* Header - Fixed height, no scroll */}
                <div
                    className="
                        {/*bg-gradient-to-br*/}
                        {/*from-slate-900*/}
                        {/*to-slate-800*/}
                        px-4 py-4
                        sm:px-6 sm:py-5
                        shrink-0
                    "
                >
                    <DialogHeader>
                        <div className="flex items-start gap-3">
                            <div className="p-2 rounded-lg sm:rounded-xl shrink-0">
                                <ShoppingCart className="w-5 h-5 " />
                            </div>

                            <div className="min-w-0 flex-1">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                    <DialogTitle className=" sm:text-lg font-semibold tracking-tight">
                                        Detalle de Venta
                                    </DialogTitle>
                                    <div className="flex gap-2">
                                        {result?.estado ? (
                                            <Badge variant="destructive" className="bg-red-500 text-[10px] sm:text-xs">
                                                Anulada
                                            </Badge>
                                        ) : (
                                            <Badge variant="default" className="text-[10px] sm:text-xs">
                                                Completada
                                            </Badge>
                                        )}
                                    </div>
                                </div>

                                {!isLoading && result?.metodo_pago && (
                                    <Badge
                                        variant="secondary"
                                        className="mt-2 bg-slate-700/50 text-slate-200 border-slate-600 flex items-center gap-1.5 py-0.5 sm:py-1 w-fit text-[10px] sm:text-xs"
                                    >
                                        <CreditCard className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                        <span className="capitalize">{result.metodo_pago}</span>
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </DialogHeader>
                </div>

                {/* Body - Scrollable Area */}
                <div className="bg-slate-50 px-4 py-4 sm:px-6 overflow-y-auto flex-1">
                    {isLoading ? (
                        <div className="space-y-3 py-2">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="bg-white rounded-xl p-4 animate-pulse h-20 border border-slate-100" />
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Metadata Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                                {[
                                    { icon: Calendar, label: "Fecha", value: formattedDate },
                                    { icon: User, label: "Cliente", value: result?.cliente ?? "Consumidor Final" },
                                    { icon: UserCircle, label: "Vendedor", value: result?.vendedor ?? "No asignado" }
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-start gap-3 min-w-0">
                                        <item.icon className="w-4 h-4 text-slate-400 mt-1 shrink-0" />
                                        <div className="min-w-0">
                                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{item.label}</p>
                                            <p className="text-sm text-slate-800 truncate">{item.value}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Section Title */}
                            <div>
                                <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                                    <Package className="w-4 h-4 text-slate-500" />
                                    Productos ({detalles.length})
                                </h3>

                                {/* Items List */}
                                <div className="space-y-3">
                                    {detalles.length === 0 ? (
                                        <div className="text-center py-10 bg-white rounded-xl border border-dashed border-slate-300">
                                            <Package className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                                            <p className="text-sm text-slate-500">No hay detalles registrados.</p>
                                        </div>
                                    ) : (
                                        detalles.map((item: any, index: number) => (
                                            <div key={index} className="bg-white rounded-xl p-3 sm:p-4 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                                                <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
                                                    <div className="flex gap-3 min-w-0">
                                                        <div className="p-2 bg-slate-50 rounded-lg shrink-0 h-fit border border-slate-100">
                                                            <Package className="w-4 h-4 text-slate-400" />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="font-bold text-slate-800 text-sm leading-tight break-words">
                                                                {item.producto_sabor ?? "Producto sin nombre"}
                                                            </p>
                                                            <div className="flex flex-wrap gap-2 mt-2">
                                                                {item.producto_tipo && (
                                                                    <span className="flex items-center gap-1 text-[10px] text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">
                                                                        <Tag className="w-3 h-3" /> {item.producto_tipo}
                                                                    </span>
                                                                )}
                                                                <span className="flex items-center gap-1 text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">
                                                                    <Hash className="w-3 h-3" /> x{item.cantidad}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex sm:flex-col justify-between sm:justify-start items-end sm:text-right border-t sm:border-0 pt-2 sm:pt-0">
                                                        <span className="text-[10px] text-slate-400 font-mono self-center sm:self-end">
                                                            ${Number(item.precio_unitario).toFixed(2)} c/u
                                                        </span>
                                                        <p className="text-base font-bold text-slate-900 font-mono">
                                                            ${Number(item.subtotal).toFixed(2)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer - Stays at bottom */}
                <div className="p-4 sm:px-6 bg-white border-t shrink-0">
                    <div className="bg-slate-900 rounded-xl px-4 py-3 sm:py-4 flex items-center justify-between">
                        <span className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-widest font-bold">
                            Total
                        </span>
                        <p className="text-xl sm:text-2xl font-bold text-white font-mono">
                            ${total.toFixed(2)}
                        </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ShowVenta;