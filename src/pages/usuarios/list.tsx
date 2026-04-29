import React, { useMemo, useState } from 'react';
import { ListView } from "@/components/refine-ui/views/list-view";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { Search, UserPlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DataTable } from "@/components/refine-ui/data-table/data-table";
import { useTable } from "@refinedev/react-table";
import { Usuario } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { CreateButton } from "@/components/refine-ui/buttons/create";
import { useDebounce } from "use-debounce";

const UsuariosList = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearch] = useDebounce(searchQuery, 400);
    const [rolSeleccionado, setRolSeleccionado] = useState("todos");

    const table = useTable<Usuario>({
        columns: useMemo<ColumnDef<Usuario>[]>(() => [
            {
                accessorKey: "nombre",
                header: () => <p className="column-title">Nombre</p>,
                cell: ({ getValue }) => (
                    <span className="text-foreground font-medium">{getValue<string>()}</span>
                ),
            },
            {
                accessorKey: "email",
                header: () => <p className="column-title">Email</p>,
                cell: ({ getValue }) => <span>{getValue<string>()}</span>,
            },
            {
                accessorKey: "rol",
                header: () => <p className="column-title">Rol</p>,
                cell: ({ getValue }) => (
                    <Badge variant="outline" className="capitalize">
                        {getValue<string>()}
                    </Badge>
                ),
            },
            {
                accessorKey: "activo",
                header: () => <p className="column-title">Estado</p>,
                cell: ({ getValue }) => {
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
            resource: "usuarios",
            pagination: { pageSize: 10, mode: "server" },
            filters: {
                permanent: [
                    ...(debouncedSearch
                        ? [{ field: "search", operator: "contains" as const, value: debouncedSearch }]
                        : []),
                    ...(rolSeleccionado !== "todos"
                        ? [{ field: "rol", operator: "eq" as const, value: rolSeleccionado }]
                        : []),
                ],
            },
            sorters: {
                initial: [{ field: "nombre", order: "asc" }],
            },
        },
    });

    return (
        <ListView>
            <Breadcrumb />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-4">
                <div>
                    <h1 className="page-title text-3xl font-bold">Usuarios</h1>
                    <p className="text-muted-foreground">Administra los usuarios del sistema y sus permisos.</p>
                </div>
                <CreateButton resource="usuarios">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Nuevo Usuario
                </CreateButton>
            </div>

            <div className="flex items-center gap-4 my-6">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Buscar por nombre..."
                        className="pl-9"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <Select value={rolSeleccionado} onValueChange={setRolSeleccionado}>
                    <SelectTrigger className="w-40">
                        <SelectValue placeholder="Filtrar por rol" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="todos">Todos</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="empleado">Empleado</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <DataTable table={table} />
        </ListView>
    );
};

export default UsuariosList;