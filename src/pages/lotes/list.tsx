import React, {useMemo, useState} from "react";
import {ListView} from "@/components/refine-ui/views/list-view.tsx";
import {Breadcrumb} from "@/components/refine-ui/layout/breadcrumb.tsx";
import {Search, CalendarIcon, X} from "lucide-react";
import {Input} from "@/components/ui/input.tsx";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover.tsx";
import {Calendar} from "@/components/ui/calendar.tsx";
import {BOLIS_OPTIONS} from "@/constants";
import {DataTable} from "@/components/refine-ui/data-table/data-table.tsx";
import {useTable} from "@refinedev/react-table";
import {Lote} from "@/types";
import {ColumnDef} from "@tanstack/react-table";
import {Badge} from "@/components/ui/badge.tsx";
import {CreateButton} from "@/components/refine-ui/buttons/create.tsx";
import {format} from "date-fns";
import {es} from "date-fns/locale";
import {DateRange} from "react-day-picker";
import {cn} from "@/lib/utils.ts";

type DateMode = "single" | "range";

const formatParam = (date: Date): string => format(date, "yyyy-MM-dd");

const LotesList = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [tipoBoliSeleccionado, setTipoBoliSeleccionado] = useState("todos");

    const [calendarOpen, setCalendarOpen] = useState(false);
    const [dateMode, setDateMode] = useState<DateMode>("single");
    const [singleDate, setSingleDate] = useState<Date | undefined>(undefined);
    const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

    const hasDateFilter =
        dateMode === "single" ? !!singleDate : !!(dateRange?.from || dateRange?.to);

    const clearDates = () => {
        setSingleDate(undefined);
        setDateRange(undefined);
    };

    const handleModeChange = (mode: DateMode) => {
        setDateMode(mode);
        clearDates();
    };

    const dateLabel = (() => {
        if (dateMode === "single") {
            return singleDate
                ? format(singleDate, "dd MMM yyyy", {locale: es})
                : "Fecha exacta";
        }
        if (dateRange?.from && dateRange?.to) {
            return `${format(dateRange.from, "dd MMM", {locale: es})} – ${format(dateRange.to, "dd MMM yyyy", {locale: es})}`;
        }
        if (dateRange?.from) {
            return `Desde ${format(dateRange.from, "dd MMM yyyy", {locale: es})}`;
        }
        return "Rango de fechas";
    })();

    // --- Filters ---
    const tipoFilter =
        tipoBoliSeleccionado !== "todos"
            ? [{field: "tipo", operator: "eq" as const, value: tipoBoliSeleccionado}]
            : [];

    const searchFilter = searchQuery
        ? [{field: "search", operator: "contains" as const, value: searchQuery}]
        : [];

    const dateFilters: { field: string; operator: "eq"; value: string }[] = [];
    if (dateMode === "single" && singleDate) {
        dateFilters.push({
            field: "date",
            operator: "eq" as const,
            value: formatParam(singleDate),
        });
    } else if (dateMode === "range") {
        if (dateRange?.from)
            dateFilters.push({field: "startDate", operator: "eq" as const, value: formatParam(dateRange.from)});
        if (dateRange?.to)
            dateFilters.push({field: "endDate", operator: "eq" as const, value: formatParam(dateRange.to)});
    }

    // --- Table ---
    const lotesTable = useTable<Lote>({
        columns: useMemo<ColumnDef<Lote>[]>(
            () => [
                {
                    accessorKey: "fechaProduccion",
                    header: () => <p className="column-title">Fecha</p>,
                    cell: ({getValue}) => {
                        const raw = getValue<string>();
                        const [year, month, day] = raw.split("-").map(Number);
                        const date = new Date(year, month - 1, day);
                        return (
                            <span>
                {date.toLocaleDateString("es-MX", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                })}
            </span>
                        );
                    },
                },
                {
                    accessorFn: (row) => row.producto.sabor,
                    id: "sabor",
                    header: () => <p className="column-title">Sabor</p>,
                    cell: ({getValue}) => (
                        <span className="text-foreground">{getValue<string>()}</span>
                    ),
                },
                {
                    accessorFn: (row) => row.producto.tipo,
                    id: "tipo",
                    header: () => <p className="column-title">Tipo</p>,
                    cell: ({getValue}) => {
                        const tipo = getValue<"leche" | "agua">();
                        return <Badge variant={tipo}>{tipo.toUpperCase()}</Badge>;
                    },
                },
                {
                    accessorKey: "cantidadProducida",
                    header: () => <p className="column-title">Cantidad</p>,
                    cell: ({getValue}) => <span>{getValue<number>()} pzs</span>,
                },
                {
                    accessorKey: "costoProduccion",
                    header: () => <p className="column-title">Costo</p>,
                    cell: ({getValue}) => (
                        <span>${Number(getValue<string>()).toFixed(2)}</span>
                    ),
                },
            ],
            []
        ),

        refineCoreProps: {
            resource: "lotes",
            pagination: {pageSize: 10, mode: "server"},
            filters: {
                permanent: [...tipoFilter, ...searchFilter, ...dateFilters],
            },
            sorters: {
                initial: [{field: "fechaProduccion", order: "asc"}],
            },
        },
    });

    return (
        <ListView>
            <Breadcrumb/>
            <h1 className="page-title">Lotes de Producción</h1>
            <div className="intro-row">
                <p>Historial de lotes producidos</p>
                <div className="actions-row">
                    {/* Search */}
                    <div className="search-field">
                        <Search className="search-icon"/>
                        <Input
                            className="pl-10 w-full"
                            type="text"
                            placeholder="Buscar por sabor"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-2 w-full sm:w-auto">
                        {/* Tipo filter */}
                        <Select
                            value={tipoBoliSeleccionado}
                            onValueChange={setTipoBoliSeleccionado}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Filtra por tipo"/>
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

                        {/* Date picker with single / range toggle */}
                        <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={cn(
                                        "flex gap-2 items-center whitespace-nowrap",
                                        hasDateFilter && "border-primary text-primary"
                                    )}
                                >
                                    <CalendarIcon className="h-4 w-4 shrink-0"/>
                                    <span>{dateLabel}</span>
                                    {hasDateFilter && (
                                        <span
                                            role="button"
                                            aria-label="Limpiar fechas"
                                            className="ml-1 rounded-full hover:bg-muted p-0.5"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                clearDates();
                                            }}
                                        >
                                            <X className="h-3 w-3"/>
                                        </span>
                                    )}
                                </Button>
                            </PopoverTrigger>

                            <PopoverContent className="w-auto p-0" align="start">
                                {/* Toggle strip */}
                                <div className="flex border-b">
                                    <button
                                        className={cn(
                                            "flex-1 py-2 text-sm font-medium transition-colors",
                                            dateMode === "single"
                                                ? "bg-primary text-primary-foreground"
                                                : "hover:bg-muted text-muted-foreground"
                                        )}
                                        onClick={() => handleModeChange("single")}
                                    >
                                        Fecha exacta
                                    </button>
                                    <button
                                        className={cn(
                                            "flex-1 py-2 text-sm font-medium transition-colors",
                                            dateMode === "range"
                                                ? "bg-primary text-primary-foreground"
                                                : "hover:bg-muted text-muted-foreground"
                                        )}
                                        onClick={() => handleModeChange("range")}
                                    >
                                        Rango
                                    </button>
                                </div>

                                {/* Calendar — swaps based on mode */}
                                {dateMode === "single" ? (
                                    <Calendar
                                        mode="single"
                                        selected={singleDate}
                                        onSelect={(date) => {
                                            setSingleDate(date);
                                            setCalendarOpen(false); // close immediately on pick
                                        }}
                                        locale={es}
                                        initialFocus
                                    />
                                ) : (
                                    <Calendar
                                        mode="range"
                                        selected={dateRange}
                                        onSelect={(range) => {
                                            setDateRange(range);
                                            if (range?.from && range?.to) {
                                                setCalendarOpen(false); // close once both ends picked
                                            }
                                        }}
                                        locale={es}
                                        numberOfMonths={2}
                                        initialFocus
                                    />
                                )}
                            </PopoverContent>
                        </Popover>

                        <CreateButton/>
                    </div>
                </div>
            </div>

            <DataTable table={lotesTable}/>
        </ListView>
    );
};

export default LotesList;