"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontalIcon } from "lucide-react"
import { IconHistory } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useParams } from "next/navigation"
import { getUserProfile } from "@/lib/user-profile"

type HistoryBooking = {
  ref: string
  business: string
  date: string
  timeStart: string
  timeEnd: string
  type: string
  service: string
  status: string
}

const statusClass: Record<string, string> = {
  Completed: "border-green-500 text-green-600",
  Canceled: "border-red-500 text-red-600",
  Pending: "border-yellow-500 text-yellow-600",
  Confirmed: "border-blue-500 text-blue-600",
}

const columns: ColumnDef<HistoryBooking>[] = [
  {
    accessorKey: "ref",
    header: "Booking Ref",
    cell: ({ row }) => (
      <span className="font-mono text-xs text-muted-foreground">{row.getValue("ref")}</span>
    ),
  },
  {
    accessorKey: "business",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Business <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <span className="font-medium">{row.getValue("business")}</span>,
  },
  {
    accessorKey: "date",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Date <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    id: "time",
    header: "Time",
    cell: ({ row }) => `${row.original.timeStart} – ${row.original.timeEnd}`,
  },
  {
    accessorKey: "type",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Type <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "service",
    header: "Service",
    cell: ({ row }) => <span className="text-sm">{row.getValue("service")}</span>,
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Status <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <Badge variant="outline" className={statusClass[row.getValue("status") as string]}>
        {row.getValue("status") as string}
      </Badge>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    enableHiding: false,
    cell: () => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="size-8">
            <MoreHorizontalIcon />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>View Details</DropdownMenuItem>
          <DropdownMenuItem>Book Again</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]

export function HistoryTable() {
  const { slug } = useParams<{ slug: string }>()
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [data, setData] = React.useState<HistoryBooking[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const profile = getUserProfile()
    if (!profile?.phone) {
      setLoading(false)
      return
    }

    fetch(`/api/slug/history?phone=${encodeURIComponent(profile.phone)}&slug=${encodeURIComponent(slug)}`)
      .then((res) => res.json())
      .then(({ data }) => {
        const mapped: HistoryBooking[] = (data ?? []).map((b: any) => ({
          ref: b.id,
          business: "Main Branch",
          date: b.date,
          timeStart: b.time_start,
          timeEnd: b.time_end,
          type: b.type,
          service: b.service_id,
          status: b.status,
        }))
        setData(mapped)
      })
      .catch((err) => console.error("Failed to fetch history:", err))
      .finally(() => setLoading(false))
  }, [])

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: { sorting, columnFilters, columnVisibility },
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <IconHistory className="size-4 text-blue-500" />
          <h1 className="bg-gradient-to-r from-[#3F51B5] via-[#3A79C3] to-[#329A9A] bg-clip-text text-base font-bold text-transparent">
            Booking History
          </h1>
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4">
        <div className="flex items-center gap-2 pb-4">
          <Input
            placeholder="Filter by business..."
            value={(table.getColumn("business")?.getFilterValue() as string) ?? ""}
            onChange={(e) => table.getColumn("business")?.setFilterValue(e.target.value)}
            className="max-w-sm"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((col) => col.getCanHide())
                .map((col) => (
                  <DropdownMenuCheckboxItem
                    key={col.id}
                    className="capitalize"
                    checked={col.getIsVisible()}
                    onCheckedChange={(value) => col.toggleVisibility(!!value)}
                  >
                    {col.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="overflow-hidden rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                    Loading history...
                  </TableCell>
                </TableRow>
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No history found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-end gap-2 pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}