import React, { useEffect } from "react";
import { useForm } from "@refinedev/react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller } from "react-hook-form";
import { HttpError } from "@refinedev/core";

import { EditView, EditViewHeader } from "@/components/refine-ui/views/edit-view";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { productoSchema, type ProductoInput } from "@/lib/schema";
import type { Producto } from "@/types";

const ProductosEdit = () => {
    const {
        register,
        control,
        reset,
        handleSubmit,
        formState: { errors, isSubmitting },

        refineCore: {
            onFinish,
            query,
        },
    } = useForm<ProductoInput, HttpError, ProductoInput>({
        resolver: zodResolver(productoSchema),

        refineCoreProps: {
            resource: "productos",
            action: "edit",
        },

        defaultValues: {
            sabor: "",
            contenido_ml: 0,
            tipo: "leche",
            precio_venta: 0,
            costo_produccion_actual: 0,
        },
    });

    useEffect(() => {
        const producto = query?.data?.data as Producto | undefined;

        if (!producto) return;

        reset({
            sabor: producto.sabor,
            contenido_ml: producto.contenido_ml,
            tipo: producto.tipo,
            precio_venta: Number(producto.precio_venta),
            costo_produccion_actual: Number(
                producto.costo_produccion_actual
            ),
        });
    }, [query?.data?.data, reset]);

    const onSubmit = handleSubmit(async (values) => {
        await onFinish(values);
    });

    return (
        <EditView>
            <EditViewHeader title="Editar Producto" />

            <form
                onSubmit={onSubmit}
                className="flex max-w-lg flex-col gap-6"
            >
                <div>
                    <Label>Sabor</Label>
                    <Input {...register("sabor")} />
                    <p>{errors.sabor?.message}</p>
                </div>

                <div>
                    <Label>Contenido</Label>
                    <Input
                        type="number"
                        {...register("contenido_ml", {
                            valueAsNumber: true,
                        })}
                    />
                </div>

                <div>
                    <Label>Tipo</Label>

                    <Controller
                        name="tipo"
                        control={control}
                        render={({ field }) => (
                            <Select
                                value={field.value}
                                onValueChange={field.onChange}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>

                                <SelectContent>
                                    <SelectItem value="leche">
                                        Leche
                                    </SelectItem>
                                    <SelectItem value="agua">
                                        Agua
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    />
                </div>

                <div>
                    <Label>Precio</Label>
                    <Input
                        type="number"
                        step="0.01"
                        {...register("precio_venta", {
                            valueAsNumber: true,
                        })}
                    />
                </div>

                <div>
                    <Label>Costo</Label>
                    <Input
                        type="number"
                        step="0.01"
                        {...register(
                            "costo_produccion_actual",
                            {
                                valueAsNumber: true,
                            }
                        )}
                    />
                </div>

                <Button type="submit">
                    {isSubmitting
                        ? "Guardando..."
                        : "Guardar cambios"}
                </Button>
            </form>
        </EditView>
    );
};

export default ProductosEdit;