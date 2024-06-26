"use client";

import * as React from "react";
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";

import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "./ui/button";
import { SubpartType } from "@/components/types/product.api";
import { TrashIcon, ExternalLinkIcon } from "@radix-ui/react-icons";
import { MetricType } from "@/components/types/metric.api";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
}
export const materialDataTableColumns = (
    onDelete?: (itemId: string) => void,
    metricsList?: MetricType[]
): ColumnDef<SubpartType>[] => {
    let columns: ColumnDef<SubpartType>[] = [
        {
            accessorKey: "name",
            header: "Name",
        },
        {
            accessorKey: "manufacturer.name",
            header: "Manufacturer",
        },
        {
            id: "productURL",
            header: "Product URL",
            cell: ({ row }) => {
                let url =
                    row.original.manufacturer.mainURL +
                    "/products/" +
                    row.original.id;
                if (onDelete) {
                    url = row.original.productURL;
                }
                return (
                    <a
                        href={url}
                        className={
                            "text-blue-400 underline flex items-center gap-1 w-fit"
                        }
                    >
                        {url} <ExternalLinkIcon />
                    </a>
                );
            },
        },
        {
            accessorKey: "quantity_needed_per_unit",
            header: "Units used per product",
        },
        // {
        //     accessorKey: "co2_footprint",
        //     header: "CO2 per unit",
        // },
        // {
        //     id: "total",
        //     header: "Total CO2 used",
        //     cell: ({ row }) => {
        //         return row.original.co2_footprint * row.original.units_bought;
        //     },
        // },
    ];
    if (metricsList) {
        const additionalColumns: ColumnDef<SubpartType>[] = metricsList.map(
            (metric): ColumnDef<SubpartType> => {
                return {
                    id: metric.name,
                    header: `Total ${metric.name} used (${metric.unit})`,
                    cell: ({ row }) => {
                        const metricOfRow =
                            row.original.sustainability_metrics?.find(
                                (materialMetric) =>
                                    materialMetric.name === metric.name
                            );
                        if (metricOfRow) {
                            return (
                                metricOfRow.value * row.original.units_bought
                            );
                        } else return "N/A";
                    },
                };
            }
        );
        columns = columns.concat(additionalColumns);
    }
    if (onDelete) {
        columns.push({
            id: "actions",
            header: "Actions",
            cell: ({ row }) => {
                return (
                    <>
                        <Button
                            variant={"destructive"}
                            onClick={() => onDelete(row.original.id)}
                        >
                            <TrashIcon />
                        </Button>
                    </>
                );
            },
        });
    }
    return columns;
};

export function MaterialDataTable<TData, TValue>({
    columns,
    data,
}: DataTableProps<SubpartType, TValue>) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    // const totalCO2 = React.useMemo(() => {
    //     let totalCO2 = 0;
    //     data?.forEach((material) => {
    //         totalCO2 += material.co2_footprint * material.units_bought;
    //     });
    //     return totalCO2;
    // }, [data]);

    return (
        <div>
            <Table className="rounded-md border max-h-[40vh] overflow-y-scroll">
                <TableHeader className={"sticky top-0 bg-white"}>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                  header.column.columnDef
                                                      .header,
                                                  header.getContext()
                                              )}
                                    </TableHead>
                                );
                            })}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && "selected"}
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                        )}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell
                                colSpan={columns.length}
                                className="h-24 text-center"
                            >
                                No results.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
                <TableFooter className={"sticky bottom-0 bg-secondary"}>
                    <TableRow>
                        <TableCell colSpan={5}>
                            Total CO2 from materials
                        </TableCell>
                        {/*<TableCell colSpan={1}>{totalCO2}</TableCell>*/}
                        {columns.find((value) => value.id === "actions") && (
                            <TableCell colSpan={1}></TableCell>
                        )}
                    </TableRow>
                </TableFooter>
            </Table>
        </div>
    );
}
