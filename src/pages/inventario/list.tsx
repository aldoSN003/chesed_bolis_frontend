import React, { useMemo, useState } from 'react'
import { ListView } from "@/components/refine-ui/views/list-view.tsx"
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb.tsx"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input.tsx"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx"
import { BOLIS_OPTIONS } from "@/constants"
import { DataTable } from "@/components/refine-ui/data-table/data-table.tsx"
import { useTable } from "@refinedev/react-table"
import { Inventario } from "@/types"
import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge.tsx"

const InventarioList = () => {
    const [searchQuery, setSearchQuery] = useState("")
    const [tipoBoliSeleccionado, setTipoBoliSeleccionado] = useState('todos')

    const productosFilters = tipoBoliSeleccionado === 'todos' ? [] : [{
        field: 'tipo',
        operator: 'eq' as const,
        value: tipoBoliSeleccionado,
    }]

    const searchFilters = searchQuery
        ? [{ field: 'sabor', operator: 'contains' as const, value: searchQuery }]
        : []

    const inventarioTable = useTable<Inventario>({
        columns: useMemo<ColumnDef<Inventario>[]>(() => [
            {
                id: 'sabor',
                accessorFn: (row) => row.producto.sabor,
                header: () => <p className="column-title">Sabor</p>,
                cell: ({ getValue }) => (
                    <span className="text-foreground">{getValue<string>()}</span>
                ),
            },
            {
                id: 'tipo',
                accessorFn: (row) => row.producto.tipo,
                header: () => <p className="column-title">Tipo</p>,
                cell: ({ getValue }) => {
                    const tipo = getValue<"leche" | "agua">()
                    return (
                        <Badge variant={tipo}>
                            {tipo.toUpperCase()}
                        </Badge>
                    )
                },
            },
            {
                accessorKey: 'cantidad',
                header: () => <p className="column-title">Cantidad</p>,
                cell: ({ getValue }) => {
                    const qty = getValue<number>()
                    const variant = qty === 0
                        ? 'destructive'
                        : qty < 20
                            ? 'outline'
                            : 'default'
                    return (
                        <Badge variant={variant}>
                            {qty} pzas
                        </Badge>
                    )
                },
            },
            {
                accessorKey: 'actualizadoEn',
                header: () => <p className="column-title">Actualizado</p>,
                cell: ({ getValue }) => {
                    const date = new Date(getValue<string>())
                    return (
                        <span className="text-muted-foreground text-sm">
                            {date.toLocaleDateString('es-MX', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                            })}
                        </span>
                    )
                },
            },
        ], []),
        refineCoreProps: {
            resource: 'inventario',
            pagination: { pageSize: 10, mode: 'server' },
            filters: {
                permanent: [...productosFilters, ...searchFilters],
            },
            sorters: {
                initial: [{ field: 'sabor', order: 'asc' }],
            },
        },
    })

    return (
        <ListView>
            <Breadcrumb />
            <h1 className="page-title">Inventario</h1>
            <div className="intro-row">
                <p>Stock actual de productos en inventario</p>
                <div className="actions-row">
                    <div className="search-field">
                        <Search className="search-icon" />
                        <Input
                            className="pl-10 w-full"
                            type="text"
                            placeholder="Buscar por sabor"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                        <Select value={tipoBoliSeleccionado} onValueChange={setTipoBoliSeleccionado}>
                            <SelectTrigger>
                                <SelectValue placeholder="Filtra por tipo de boli" />
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
                    </div>
                </div>
            </div>
            <DataTable table={inventarioTable} />
        </ListView>
    )
}

export default InventarioList