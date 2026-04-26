import React from 'react';

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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { CreateView } from "@/components/refine-ui/views/create-view";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { Loader2 } from "lucide-react";

import { zodResolver } from "@hookform/resolvers/zod";
import { ProductoInput, productoSchema } from "@/lib/schema";
import { useForm } from "@refinedev/react-hook-form";
import { BOLIS_OPTIONS } from "@/constants"; // Adjust path if needed

const ProductosCreate = () => {
    const form = useForm({
        resolver: zodResolver(productoSchema),
        refineCoreProps: {
            resource: "productos",
            action: "create",
        },
        defaultValues: {
            contenido_ml: 150,
            sabor: "",
            precio_venta: undefined,
            costo_produccion_actual: undefined,
        }
    });

    const {
        refineCore: { onFinish },
        handleSubmit,
        formState: { isSubmitting },
        control,
    } = form;

    const onSubmit = async (values: ProductoInput) => {
        try {
            await onFinish(values);
        } catch (error) {
            console.error("Error al crear el producto:", error);
        }
    };

    return (
        <CreateView className="producto-view">
            <Breadcrumb />

            <h1 className="page-title text-3xl font-bold mt-4">Crear Producto</h1>
            <div className="intro-row mb-6 text-muted-foreground">
                <p>Ingresa los detalles del nuevo producto de tu catálogo.</p>
            </div>

            <Separator />

            <div className="my-6 flex items-center">
                <Card className="w-full max-w-3xl">
                    <CardHeader className="relative z-10">
                        <CardTitle className="text-2xl pb-0 font-bold">
                            Detalles del Boli
                        </CardTitle>
                    </CardHeader>

                    <Separator />

                    <CardContent className="mt-7">
                        <Form {...form}>
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                                {/* Row 1: Sabor */}
                                <FormField
                                    control={control}
                                    name="sabor"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Sabor <span className="text-destructive">*</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Ej. Oreo, Rompope, Fresa..."
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Row 2: Tipo & Contenido */}
                                <div className="grid sm:grid-cols-2 gap-6">
                                    <FormField
                                        control={control}
                                        name="tipo"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Base (Tipo) <span className="text-destructive">*</span>
                                                </FormLabel>
                                                <Select
                                                    onValueChange={field.onChange}
                                                    value={field.value}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger className="w-full capitalize">
                                                            <SelectValue placeholder="Selecciona el tipo" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {BOLIS_OPTIONS.map((option) => (
                                                            <SelectItem key={option.value} value={option.value} className="capitalize">
                                                                {option.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={control}
                                        name="contenido_ml"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Contenido (ml) <span className="text-destructive">*</span>
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        min={1}
                                                        placeholder="150"
                                                        {...field}
                                                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {/* Row 3: Costos y Precios */}
                                <div className="grid sm:grid-cols-2 gap-6">
                                    <FormField
                                        control={control}
                                        name="costo_produccion_actual"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Costo de Producción ($) <span className="text-destructive">*</span>
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        step="0.01"
                                                        min={0}
                                                        placeholder="11.53"
                                                        {...field}
                                                        value={field.value ?? ""}
                                                        onChange={(e) => field.onChange(e.target.valueAsNumber || undefined)}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={control}
                                        name="precio_venta"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Precio de Venta ($) <span className="text-destructive">*</span>
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        step="0.01"
                                                        min={0}
                                                        placeholder="25.00"
                                                        {...field}
                                                        value={field.value ?? ""}
                                                        onChange={(e) => field.onChange(e.target.valueAsNumber || undefined)}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <Separator />

                                <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                                    {isSubmitting ? (
                                        <div className="flex items-center gap-2">
                                            <span>Guardando Producto...</span>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        </div>
                                    ) : (
                                        "Crear Producto"
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

export default ProductosCreate;