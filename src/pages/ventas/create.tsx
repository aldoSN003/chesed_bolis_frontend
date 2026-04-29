import React, { useMemo } from "react";
import { CreateView } from "@/components/refine-ui/views/create-view";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { useForm } from "@refinedev/react-hook-form";
import { useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ventaSchema, VentaInput } from "@/lib/schema";
import { useList } from "@refinedev/core";
import { Producto, Inventario } from "@/types";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
    Trash2,
    Plus,
    ShoppingCart,
    User,
    CreditCard,
    Banknote,
    Wallet,
} from "lucide-react";
import { Combobox } from "@/components/ui/combobox";

const VentaCreate = () => {
    /**
     * FETCH INVENTARIO (for stock availability display)
     */
    const { query: inventarioQuery } = useList<Inventario>({
        resource: "inventario",
        pagination: { pageSize: 100 },
    });

    const inventario = inventarioQuery.data?.data ?? [];

    /**
     * FETCH PRODUCTOS (for real prices)
     */
    const { query: productosQuery } = useList<Producto>({
        resource: "productos",
        pagination: { pageSize: 100 },
    });

    const productos = productosQuery.data?.data ?? [];

    /**
     * FORM
     */
    const form = useForm({
        resolver: zodResolver(ventaSchema),

        refineCoreProps: {
            resource: "ventas",
            action: "create",
            redirect: "list",
        },

        defaultValues: {
            usuarioPublicId: "5be5f88f-aecf-4255-89d1-2866aa42f682",
            clientePublicId: undefined,
            metodoPago: "efectivo" as const,
            detalles: [
                {
                    productoPublicId: "",
                    cantidad: 1,
                    tipoDescuento: null,
                },
            ],
        },
    });

    const {
        refineCore: { onFinish },
        control,
        handleSubmit,
        watch,
        formState: { isSubmitting },
    } = form;

    const { fields, append, remove } = useFieldArray({
        control,
        name: "detalles",
    });

    const watchedDetalles = watch("detalles");

    /**
     * COMBOBOX OPTIONS
     * Wrapped in useMemo so it reacts when inventario/productos data arrives.
     * FIX: join on i.productoId === p.id (both numeric internal IDs)
     */
    const productoOptions = useMemo(() => {
        return productos.map((p) => {
            const inv = inventario.find(
                (i) => i.productoId === p.id
            );
            const stock = inv ? inv.cantidad : 0;
            return {
                label: `${p.sabor} (${p.tipo}) — ${stock} disp.`,
                value: p.publicId,
            };
        });
    }, [productos, inventario]);

    /**
     * CALCULATE TOTAL using real precio_venta from productos
     */
    const total = useMemo(() => {
        return watchedDetalles.reduce((acc, item) => {
            const producto = productos.find(
                (p) => p.publicId === item.productoPublicId
            );
            if (!producto) return acc;

            const price = Number(producto.precio_venta) || 0;
            let subtotal = price * (item.cantidad || 0);

            if (item.tipoDescuento === "regalo") subtotal = 0;
            else if (item.tipoDescuento === "promocion") subtotal *= 0.9;
            else if (item.tipoDescuento === "empleado") subtotal *= 0.85;

            return acc + subtotal;
        }, 0);
    }, [watchedDetalles, productos]);

    /**
     * SUBMIT
     */
    const onSubmit = async (values: VentaInput) => {
        await onFinish({
            clientePublicId: values.clientePublicId,
            usuarioPublicId: values.usuarioPublicId,
            metodoPago: values.metodoPago,
            detalles: values.detalles,
        });
    };

    const isLoading =
        inventarioQuery.isLoading || productosQuery.isLoading;

    return (
        <CreateView>
            <Breadcrumb />

            <h1 className="page-title text-3xl font-bold mt-4">
                Nueva Venta
            </h1>

            <div className="intro-row mb-6 text-muted-foreground">
                <p>Registra una nueva transacción de venta.</p>
            </div>

            <Separator />

            <Form {...form}>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-8 mt-6"
                >
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* ── LEFT: Products ── */}
                        <div className="lg:col-span-2 space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <ShoppingCart className="w-5 h-5" />
                                        Productos
                                    </CardTitle>
                                </CardHeader>

                                <CardContent className="space-y-4">
                                    {fields.map((field, index) => (
                                        <div
                                            key={field.id}
                                            className="flex flex-col sm:flex-row gap-4 items-start p-4 border rounded-lg"
                                        >
                                            {/* Producto */}
                                            <div className="flex-1 w-full">
                                                <FormField
                                                    control={control}
                                                    name={`detalles.${index}.productoPublicId`}
                                                    render={({ field }) => (
                                                        <FormItem className="flex flex-col">
                                                            <FormLabel>
                                                                Producto
                                                            </FormLabel>
                                                            <Combobox
                                                                options={productoOptions}
                                                                value={field.value}
                                                                onValueChange={field.onChange}
                                                                placeholder="Seleccionar producto"
                                                            />
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>

                                            {/* Cantidad */}
                                            <div className="w-full sm:w-24">
                                                <FormField
                                                    control={control}
                                                    name={`detalles.${index}.cantidad`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>
                                                                Cant.
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    type="number"
                                                                    min={1}
                                                                    value={field.value ?? ""}
                                                                    onChange={(e) => {
                                                                        const v = e.target.valueAsNumber;
                                                                        field.onChange(
                                                                            Number.isNaN(v) ? 1 : v
                                                                        );
                                                                    }}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>

                                            {/* Descuento */}
                                            <div className="w-full sm:w-44">
                                                <FormField
                                                    control={control}
                                                    name={`detalles.${index}.tipoDescuento`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>
                                                                Descuento
                                                            </FormLabel>
                                                            <Select
                                                                value={field.value ?? "none"}
                                                                onValueChange={(val) =>
                                                                    field.onChange(
                                                                        val === "none" ? null : val
                                                                    )
                                                                }
                                                            >
                                                                <FormControl>
                                                                    <SelectTrigger>
                                                                        <SelectValue placeholder="Ninguno" />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    <SelectItem value="none">
                                                                        Ninguno
                                                                    </SelectItem>
                                                                    <SelectItem value="promocion">
                                                                        Promoción (10%)
                                                                    </SelectItem>
                                                                    <SelectItem value="empleado">
                                                                        Empleado (15%)
                                                                    </SelectItem>
                                                                    <SelectItem value="regalo">
                                                                        Regalo (100%)
                                                                    </SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>

                                            {/* Remove row */}
                                            {fields.length > 1 && (
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-destructive mt-8 shrink-0"
                                                    onClick={() => remove(index)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            )}
                                        </div>
                                    ))}

                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="w-full"
                                        onClick={() =>
                                            append({
                                                productoPublicId: "",
                                                cantidad: 1,
                                                tipoDescuento: null,
                                            })
                                        }
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Agregar otro producto
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>

                        {/* ── RIGHT: Summary & Payment ── */}
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <CreditCard className="w-5 h-5" />
                                        Pago y Resumen
                                    </CardTitle>
                                </CardHeader>

                                <CardContent className="space-y-6">
                                    {/* Método de pago */}
                                    <FormField
                                        control={control}
                                        name="metodoPago"
                                        render={({ field }) => (
                                            <FormItem className="space-y-3">
                                                <FormLabel>
                                                    Método de Pago
                                                </FormLabel>
                                                <FormControl>
                                                    <div className="grid grid-cols-3 gap-2">
                                                        <Button
                                                            type="button"
                                                            variant={field.value === "efectivo" ? "default" : "outline"}
                                                            className="flex flex-col h-auto py-2 gap-1"
                                                            onClick={() => field.onChange("efectivo")}
                                                        >
                                                            <Banknote className="w-4 h-4" />
                                                            <span className="text-xs">Efectivo</span>
                                                        </Button>
                                                        <Button
                                                            type="button"
                                                            variant={field.value === "tarjeta" ? "default" : "outline"}
                                                            className="flex flex-col h-auto py-2 gap-1"
                                                            onClick={() => field.onChange("tarjeta")}
                                                        >
                                                            <CreditCard className="w-4 h-4" />
                                                            <span className="text-xs">Tarjeta</span>
                                                        </Button>
                                                        <Button
                                                            type="button"
                                                            variant={field.value === "transferencia" ? "default" : "outline"}
                                                            className="flex flex-col h-auto py-2 gap-1"
                                                            onClick={() => field.onChange("transferencia")}
                                                        >
                                                            <Wallet className="w-4 h-4" />
                                                            <span className="text-xs">Transf.</span>
                                                        </Button>
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <Separator />

                                    {/* Totals */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">
                                                Productos:
                                            </span>
                                            <span>{fields.length}</span>
                                        </div>
                                        <div className="flex justify-between text-lg font-bold">
                                            <span>Total:</span>
                                            <span className="text-primary">
                                                ${total.toFixed(2)}
                                            </span>
                                        </div>
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full"
                                        size="lg"
                                        disabled={isSubmitting || isLoading}
                                    >
                                        {isSubmitting ? "Procesando..." : "Confirmar Venta"}
                                    </Button>
                                </CardContent>
                            </Card>

                            {/* Usuario info */}
                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                                        <User className="w-4 h-4" />
                                        Información de Usuario
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-xs text-muted-foreground mb-4">
                                        Venta registrada por el usuario actual.
                                    </p>
                                    <FormField
                                        control={control}
                                        name="usuarioPublicId"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        disabled
                                                        placeholder="ID de Usuario"
                                                        className="text-xs"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </form>
            </Form>
        </CreateView>
    );
};

export default VentaCreate;