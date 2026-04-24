import React, {useMemo, useState} from 'react'
import {ListView} from "@/components/refine-ui/views/list-view.tsx";
import {Breadcrumb} from "@/components/refine-ui/layout/breadcrumb.tsx";
import {Search} from "lucide-react";
import {Input} from "@/components/ui/input.tsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {BOLIS_OPTIONS} from "@/constants";
import {DataTable} from "@/components/refine-ui/data-table/data-table.tsx";
import {useTable} from "@refinedev/react-table";
import {Producto} from "@/types";
import {ColumnDef} from "@tanstack/react-table";
import {Badge} from "@/components/ui/badge.tsx";
import {CreateButton} from "@/components/refine-ui/buttons/create.tsx";

const ProductosList = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [tipoBoliSeleccionado, setTipoBoliSeleccionado] = useState('todos')
    const productosFilters = tipoBoliSeleccionado === 'todos' ? [] : [{
        field: 'tipo',
        operator: 'eq' as const,
        value: tipoBoliSeleccionado
    }]
    const searchFilters = searchQuery ? [{field: 'sabor', operator: 'contains' as const, value: searchQuery}] : [];
    const bolisTable = useTable<Producto>({
        columns: useMemo<ColumnDef<Producto>[]>(() => [
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
                    const tipo = getValue<"leche" | "agua">()
                    return (
                        <Badge variant={tipo}>
                            {tipo.toUpperCase()}

                        </Badge>)
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


        ], []),
        refineCoreProps: {
            resource: 'productos',
            pagination: {pageSize: 10, mode: 'server'},
            filters:{
                permanent:[...productosFilters, ...searchFilters]
            },
            sorters:{
                initial:[
                    {field:'sabor', order:'asc'}
                ]
            }
        }
    })
    return (
        <ListView>
            <Breadcrumb/>
            <h1 className={"page-title"}>Productos</h1>
            <div className={"intro-row"}>
                <p>Acceso rápido al catálago de productos</p>
                <div className={"actions-row"}>
                    <div className={"search-field"}>
                        <Search className={"search-icon"}/>
                        <Input
                            className={"pl-10 w-full"}
                            type={"text"}
                            placeholder={"Buscar producto"}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />

                    </div>


                    <div className={"flex gap-2 w-full sm:w-auto"}>
                        <Select value={tipoBoliSeleccionado} onValueChange={setTipoBoliSeleccionado}>
                            <SelectTrigger>
                                <SelectValue placeholder={"Filtra por tipo de boli"}/>

                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={"todos"}>
                                    Todos
                                </SelectItem>

                                {BOLIS_OPTIONS.map(
                                    (boli) => (
                                        <SelectItem value={boli.value} key={boli.value}>
                                            {boli.label}
                                        </SelectItem>
                                    )
                                )}
                            </SelectContent>
                        </Select>
                        <CreateButton />
                    </div>
                </div>


            </div>

            <DataTable table={bolisTable}/>

        </ListView>
    )
}
export default ProductosList
