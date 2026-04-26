import React, {useMemo, useState} from 'react'
import {ListView} from "@/components/refine-ui/views/list-view.tsx";
import {Breadcrumb} from "@/components/refine-ui/layout/breadcrumb.tsx";
import {Edit, Search, Trash2} from "lucide-react";
import {Input} from "@/components/ui/input.tsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {BOLIS_OPTIONS} from "@/constants";
import {DataTable} from "@/components/refine-ui/data-table/data-table.tsx";
import {useTable} from "@refinedev/react-table";
import {Producto} from "@/types";
import {ColumnDef} from "@tanstack/react-table";
import {Badge} from "@/components/ui/badge.tsx";
import {CreateButton} from "@/components/refine-ui/buttons/create.tsx";
import {useNavigate} from "react-router";
import {useDelete} from "@refinedev/core";
import {useDebounce} from "use-debounce"; // npm install use-debounce

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog.tsx";

import {Button} from "@/components/ui/button.tsx";


const ProductosList = () => {
    const {mutate: deleteProduct, mutation} = useDelete();
    const isDeleting = mutation.isPending;
    const navigate = useNavigate();

    const [searchQuery, setSearchQuery] = useState("");
    const [tipoBoliSeleccionado, setTipoBoliSeleccionado] = useState('todos');

    // ✅ Debounce: evita una petición al servidor en cada keystroke
    const [debouncedSearch] = useDebounce(searchQuery, 400);

    // ✅ useMemo: los filtros solo se recalculan cuando cambia su dependencia
    const productosFilters = useMemo(() =>
            tipoBoliSeleccionado === 'todos'
                ? []
                : [{field: 'tipo', operator: 'eq' as const, value: tipoBoliSeleccionado}],
        [tipoBoliSeleccionado]
    );

    const searchFilters = useMemo(() =>
            debouncedSearch
                ? [{field: 'sabor', operator: 'contains' as const, value: debouncedSearch}]
                : [],
        [debouncedSearch]
    );


    const columns = useMemo<ColumnDef<Producto>[]>(() => [
        {
            accessorKey: "sabor",
            header: () => <p className="column-title">Sabor</p>,
            cell: ({getValue}) => (
                <span className="text-foreground">{getValue<string>()}</span>
            ),
        },
        {
            accessorKey: "tipo",
            header: () => <p className="column-title">Tipo</p>,
            cell: ({getValue}) => {
                const tipo = getValue<"leche" | "agua">();
                return (
                    <Badge variant={tipo}>
                        {tipo.toUpperCase()}
                    </Badge>
                );
            },
        },
        {
            accessorKey: "contenido_ml",
            header: () => <p className="column-title">Contenido (ml)</p>,
            cell: ({getValue}) => (
                <span>{getValue<number>()} ml</span>
            ),
        },
        {
            id: "precio",
            header: () => <p className="column-title">Precio</p>,
            accessorFn: (row) => Number(row.precio_venta),
            cell: ({getValue}) => (
                <span>${getValue<number>().toFixed(2)}</span>
            ),
        },
        {
            accessorKey: "activo",
            header: () => <p className="column-title">Estado</p>,
            cell: ({getValue}) => {
                const activo = getValue<boolean>();
                return (
                    <Badge variant={activo ? "default" : "destructive"}>
                        {activo ? "Activo" : "Inactivo"}
                    </Badge>
                );
            },
        },
        {
            id: "actions",
            header: () => <p className="font-semibold">Acciones</p>,
            size: 120,
            cell: ({row}) => {
                console.log(row.original);
                return (

                    <div className="flex items-center gap-2">
                        {/* ✅ Botón de editar */}
                        <Button
                            className="cursor-pointer"
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate(`/productos/edit/${row.original.id}`)}
                        >
                            <Edit className="h-4 w-4"/>
                        </Button>

                        {/* ✅ Botón de eliminar con confirmación */}
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-destructive cursor-pointer"
                                    disabled={isDeleting}
                                >
                                    <Trash2 className="h-4 w-4"/>
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Esta acción no se puede deshacer. Esto eliminará permanentemente el
                                        boli de sabor "{row.original.sabor}" de nuestros servidores.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel disabled={isDeleting}>
                                        Cancelar
                                    </AlertDialogCancel>
                                    {/* ✅ Feedback visual: botón deshabilitado mientras elimina */}
                                    <AlertDialogAction
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                        disabled={isDeleting}
                                        onClick={() => {
                                            deleteProduct({
                                                resource: "productos",
                                                id: row.original.publicId,
                                            });
                                        }}
                                    >
                                        {isDeleting ? "Eliminando..." : "Eliminar"}
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                )
            }
        },
    ], [navigate, deleteProduct, isDeleting]); // ✅ dependencias completas

    const bolisTable = useTable<Producto>({
        columns,
        refineCoreProps: {
            resource: 'productos',
            pagination: {pageSize: 10, mode: 'server'},
            filters: {
                permanent: [...productosFilters, ...searchFilters]
            },
            sorters: {
                initial: [{field: 'sabor', order: 'asc'}]
            }
        }
    });

    return (
        <ListView>
            <Breadcrumb/>
            <h1 className="page-title">Productos</h1>
            <div className="intro-row">
                <p>Acceso rápido al catálago de productos</p>
                <div className="actions-row">
                    <div className="search-field">
                        <Search className="search-icon"/>
                        <Input
                            className="pl-10 w-full"
                            type="text"
                            placeholder="Buscar producto"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-2 w-full sm:w-auto">
                        <Select value={tipoBoliSeleccionado} onValueChange={setTipoBoliSeleccionado}>
                            <SelectTrigger>
                                <SelectValue placeholder="Filtra por tipo de boli"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="todos">Todos</SelectItem>
                                {BOLIS_OPTIONS.map((boli) => (
                                    <SelectItem value={boli.value} key={boli.value}>
                                        {boli.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <CreateButton/>
                    </div>
                </div>
            </div>

            <DataTable table={bolisTable}/>
        </ListView>
    );
};

export default ProductosList;