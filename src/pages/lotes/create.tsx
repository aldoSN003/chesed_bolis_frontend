import React, { useEffect } from "react";

import { Separator } from "@/components/ui/separator";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { CreateView } from "@/components/refine-ui/views/create-view";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";

import { Loader2 } from "lucide-react";

import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "@refinedev/react-hook-form";
import { useList, useOne } from "@refinedev/core";

import { loteSchema, LoteInput } from "@/lib/schema";
import { Producto } from "@/types";

type ProductoSelect = Producto & {
    id: string; // publicId
};

const LotesCreate = () => {
    const today =
        new Date()
            .toISOString()
            .split("T")[0];

    /**
     * GET PRODUCTOS
     * id = publicId
     */
    const {
        query: productosQuery,
    } = useList<ProductoSelect>({
        resource: "productos",
        pagination: {
            pageSize: 100,
        },
    });

    const productos =
        productosQuery.data?.data ??
        [];

    const productosLoading =
        productosQuery.isLoading;

    /**
     * FORM
     */
    const form =
        useForm({
            resolver:
                zodResolver(
                    loteSchema
                ),

            refineCoreProps: {
                resource:
                    "lotes",
                action:
                    "create",
            },

            defaultValues: {
                productoPublicId:
                    "",
                fechaProduccion:
                today,
                cantidadProducida:
                    1,
                costoProduccion:
                    0,
            },
        });

    const {
        refineCore: {
            onFinish,
        },
        handleSubmit,
        control,
        watch,
        setValue,
        formState: {
            isSubmitting,
        },
    } = form;

    /**
     * WATCH VALUES
     */
    const productoPublicId =
        watch(
            "productoPublicId"
        );

    const cantidadProducida =
        watch(
            "cantidadProducida"
        ) ?? 1;

    /**
     * LOAD PRODUCT
     */
    const {
        query: productoQuery,
    } = useOne<Producto>({
        resource:
            "productos",
        id: productoPublicId,
        queryOptions: {
            enabled:
                !!productoPublicId,
        },
    });

    const productoSeleccionado =
        productoQuery.data?.data;

    /**
     * AUTO CALCULATE COST
     */
    useEffect(() => {
        if (
            !productoSeleccionado
        )
            return;

        const costoUnitario =
            Number(
                productoSeleccionado.costo_produccion_actual
            );

        const cantidad =
            Number(
                cantidadProducida
            ) || 1;

        const total =
            costoUnitario *
            cantidad;

        setValue(
            "costoProduccion",
            Number(
                total.toFixed(
                    2
                )
            ),
            {
                shouldValidate:
                    true,
                shouldDirty:
                    true,
            }
        );
    }, [
        productoSeleccionado,
        cantidadProducida,
        setValue,
    ]);

    /**
     * SUBMIT
     */
    const onSubmit = async (values: LoteInput) => {
        await onFinish({
            productoPublicId: values.productoPublicId,
            fechaProduccion: values.fechaProduccion,
            cantidadProducida: values.cantidadProducida,
            costoProduccion: values.costoProduccion,
        });
    };

    return (
        <CreateView>
            <Breadcrumb />

            <h1 className="page-title text-3xl font-bold mt-4">
                Crear Lote de
                Producción
            </h1>

            <div className="intro-row mb-6 text-muted-foreground">
                <p>
                    Registra una
                    nueva
                    producción y
                    actualiza
                    inventario
                    automáticamente.
                </p>
            </div>

            <Separator />

            <div className="my-6 flex items-center">
                <Card className="w-full max-w-3xl">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold">
                            Datos
                            del
                            Lote
                        </CardTitle>
                    </CardHeader>

                    <Separator />

                    <CardContent className="mt-7">
                        <Form
                            {...form}
                        >
                            <form
                                onSubmit={handleSubmit(
                                    onSubmit
                                )}
                                className="space-y-6"
                            >
                                {/* PRODUCTO */}
                                <FormField
                                    control={
                                        control
                                    }
                                    name="productoPublicId"
                                    render={({
                                                 field,
                                             }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Producto
                                                *
                                            </FormLabel>

                                            <Select
                                                value={
                                                    field.value ||
                                                    ""
                                                }
                                                onValueChange={
                                                    field.onChange
                                                }
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecciona producto" />
                                                    </SelectTrigger>
                                                </FormControl>

                                                <SelectContent>
                                                    {productosLoading ? (
                                                        <div className="px-2 py-2 text-sm text-muted-foreground">
                                                            Cargando
                                                            productos...
                                                        </div>
                                                    ) : (
                                                        productos.map(
                                                            (
                                                                item
                                                            ) => (
                                                                <SelectItem
                                                                    key={
                                                                        item.id
                                                                    }
                                                                    value={
                                                                        item.id
                                                                    }
                                                                >
                                                                    {
                                                                        item.sabor
                                                                    }{" "}
                                                                    (
                                                                    {
                                                                        item.tipo
                                                                    }

                                                                    )
                                                                </SelectItem>
                                                            )
                                                        )
                                                    )}
                                                </SelectContent>
                                            </Select>

                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* FECHA */}
                                <FormField
                                    control={
                                        control
                                    }
                                    name="fechaProduccion"
                                    render={({
                                                 field,
                                             }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Fecha
                                                *
                                            </FormLabel>

                                            <FormControl>
                                                <Input
                                                    type="date"
                                                    {...field}
                                                />
                                            </FormControl>

                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* CANTIDAD */}
                                <FormField
                                    control={
                                        control
                                    }
                                    name="cantidadProducida"
                                    render={({
                                                 field,
                                             }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Cantidad
                                                *
                                            </FormLabel>

                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    min={
                                                        1
                                                    }
                                                    value={
                                                        field.value ??
                                                        ""
                                                    }
                                                    onChange={(
                                                        e
                                                    ) => {
                                                        const value =
                                                            e
                                                                .target
                                                                .valueAsNumber;

                                                        field.onChange(
                                                            Number.isNaN(
                                                                value
                                                            )
                                                                ? 1
                                                                : value
                                                        );
                                                    }}
                                                />
                                            </FormControl>

                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* COSTO */}
                                <FormField
                                    control={
                                        control
                                    }
                                    name="costoProduccion"
                                    render={({
                                                 field,
                                             }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Costo
                                                Producción
                                                Total
                                                ($)
                                            </FormLabel>

                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    step="0.01"
                                                    readOnly
                                                    value={
                                                        field.value ??
                                                        0
                                                    }
                                                />
                                            </FormControl>

                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Separator />

                                <Button
                                    type="submit"
                                    size="lg"
                                    className="w-full"
                                    disabled={
                                        isSubmitting ||
                                        productosLoading
                                    }
                                >
                                    {isSubmitting ? (
                                        <div className="flex items-center gap-2">
                                            <span>
                                                Guardando
                                                lote...
                                            </span>

                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        </div>
                                    ) : (
                                        "Crear Lote"
                                    )}
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </CreateView>
    );
};

export default LotesCreate;