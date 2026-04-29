import React, {useMemo, useState} from 'react'
import {useDebounce} from "use-debounce";
import {ColumnDef} from "@tanstack/react-table";
import {Producto} from "@/types";
import {useTable} from "@refinedev/react-table";
import {ListView} from "@/components/refine-ui/views/list-view.tsx";
import {Breadcrumb} from "@/components/refine-ui/layout/breadcrumb.tsx";
import {Banknote, CreditCard, Search, Wallet} from "lucide-react";
import {Input} from "@/components/ui/input.tsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {BOLIS_OPTIONS, METODOS_PAGO_OPTIONS} from "@/constants";
import {CreateButton} from "@/components/refine-ui/buttons/create.tsx";
import {DataTable} from "@/components/refine-ui/data-table/data-table.tsx";
import {Badge} from "@/components/ui/badge.tsx";
import {useNavigate} from "react-router";
import ShowVenta from "@/pages/ventas/show.tsx";
import {useParams} from "react-router";

const VentasList = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [searchQuery, setSearchQuery] = useState("");
    const [metodoPagoSeleccionado, setMetodoPagoSeleccionado] = useState("todos")
    const [debouncedSearch] = useDebounce(searchQuery, 400);
    const ventasFilters = useMemo(() =>
            metodoPagoSeleccionado === 'todos'
                ? []
                : [{field: 'metodoPago', operator: 'eq' as const, value: metodoPagoSeleccionado}],
        [metodoPagoSeleccionado]
    );
    const searchFilters = useMemo(() =>
            debouncedSearch
                ? [{field: 'search', operator: 'contains' as const, value: debouncedSearch}]
                : [],
        [debouncedSearch]
    );


    const columns = useMemo<ColumnDef<Producto>[]>(() => [
            {
                accessorKey: "cliente.nombre",
                header: () => <p className="column-title">Cliente</p>,
                cell: ({getValue}) => {
                    const nombre = getValue<string>();
                    const isPublic = nombre === "Público General";

                    return (
                        <Badge
                            variant={isPublic ? "secondary" : "outline"}
                        >
                            {nombre}
                        </Badge>
                    );
                },
            },

            {
                header: () => <p className="column-title">Total</p>,
                accessorKey: "total",
                cell: ({getValue}) => {
                    return (
                        <Badge variant={"default"}>
                            <span>${getValue<number>()}</span>
                        </Badge>
                    );
                },
            },
            {
                accessorKey: "fecha",
                header: () => <p className="column-title">Fecha</p>,
                cell: ({getValue}) => {
                    const value = getValue<string>();
                    const date = new Date(value);

                    return (
                        <span className="text-foreground">
                {date.toLocaleString("es-MX", {
                    timeZone: "America/Mexico_City",
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                })}
            </span>
                    );
                },
            },

            {
                accessorKey: "metodoPago",
                header: () => (
                    <p className="column-title">Método de Pago</p>
                ),
                cell: ({getValue}) => {
                    const metodo = getValue<string>();

                    let icon = (
                        <Banknote className="w-4 h-4 mr-1"/>
                    );
                    let label = "Efectivo";

                    if (metodo === "tarjeta") {
                        icon = (
                            <CreditCard className="w-4 h-4 mr-1"/>
                        );
                        label = "Tarjeta";
                    }

                    if (metodo === "transferencia") {
                        icon = (
                            <Wallet className="w-4 h-4 mr-1"/>
                        );
                        label = "Transferencia";
                    }

                    return (
                        <Badge
                            variant="outline"
                            className="flex items-center gap-1 w-fit"
                        >
                            {icon}
                            {label}
                        </Badge>
                    );
                },
            },


        ], []
    )


    const ventasTable = useTable<Producto>({

        columns,
        refineCoreProps: {
            resource: 'ventas',
            pagination: {pageSize: 10, mode: 'server'},
            filters: {
                permanent: [...ventasFilters, ...searchFilters]
            },
            sorters: {
                initial: [{field: 'fecha', order: 'asc'}]
            }
        }
    })

    return (
        <ListView>
            <Breadcrumb/>
            <h1 className="page-title">Ventas</h1>
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
                        <Select value={metodoPagoSeleccionado} onValueChange={setMetodoPagoSeleccionado}>
                            <SelectTrigger>
                                <SelectValue placeholder="Filtra por metodo de pago"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="todos">Todos</SelectItem>
                                {METODOS_PAGO_OPTIONS.map((metodo) => (
                                    <SelectItem value={metodo.value} key={metodo.value}>
                                        {metodo.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <CreateButton/>
                    </div>
                </div>
            </div>

            <DataTable
                table={ventasTable}
                onRowClick={(venta) =>
                    navigate(
                        `/ventas/${venta.publicId}`
                    )
                }
            />

            {id && <ShowVenta />}
        </ListView>
    )
}
export default VentasList
