"use client"

import * as React from "react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState,
} from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, ChevronDown } from "lucide-react"
import { Input } from "@/components/ui/input"
import type { Property } from "@/components/dialogs/PropertyDetailsDialog"

// lazy load dialog biar ga render berat
const PropertyDetailsDialog = React.lazy(
  () => import("@/components/dialogs/PropertyDetailsDialog")
)

const properties: Property[] = [
  {
    id: "1",
    namaProperti: "Ciputra Residence BSD Cluster Aster",
    developer: "Ciputra Group",
    alamat: "Jl. BSD Raya Utama No. 5, Tangerang Selatan",
    harga: 850_000_000,
    luasTanah: 72,
    luasBangunan: 90,
    kamarTidur: 3,
    kamarMandi: 2,
    kondisi: "Baru",
    tahunBangun: "2024",
    imageUrl: "/images/rumah1.jpg",
  },
  {
    id: "2",
    namaProperti: "Summarecon Serpong Cluster Elora",
    developer: "Summarecon",
    alamat: "Jl. Gading Serpong Boulevard No. 3, Tangerang",
    harga: 1_200_000_000,
    luasTanah: 84,
    luasBangunan: 110,
    kamarTidur: 4,
    kamarMandi: 3,
    kondisi: "Dalam Pembangunan",
    tahunBangun: "2025",
    imageUrl: "/images/rumah2.jpg",
  },
  // Tambah data dummy lain jika mau (tapi batasi max 10)
]

export default function PropertiesList() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [filter, setFilter] = React.useState("")
  const [selectedProperty, setSelectedProperty] = React.useState<Property | null>(null)
  const [showDialog, setShowDialog] = React.useState(false)

  // Batasi render hanya 10 data biar ringan
  const filteredData = React.useMemo(() => {
    const data = properties.filter((p) =>
      p.namaProperti.toLowerCase().includes(filter.toLowerCase())
    )
    return data.slice(0, 10)
  }, [filter])

  const handleDetails = (property: Property) => {
    setSelectedProperty(property)
    setShowDialog(true)
  }

  const handleDelete = (property: Property) => {
    console.log("Delete:", property.id)
  }

  const columns: ColumnDef<Property>[] = [
    {
      accessorKey: "namaProperti",
      header: () => <div className="font-semibold">Nama Properti</div>,
      cell: ({ row }) => <div className="font-medium">{row.getValue("namaProperti")}</div>,
    },
    {
      accessorKey: "developer",
      header: () => <div className="font-semibold">Developer</div>,
      cell: ({ row }) => <div>{row.getValue("developer")}</div>,
    },
    {
      accessorKey: "alamat",
      header: () => <div className="font-semibold">Alamat</div>,
      cell: ({ row }) => (
        <div className="truncate max-w-xs text-muted-foreground">
          {row.getValue("alamat")}
        </div>
      ),
    },
    {
      accessorKey: "harga",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="font-semibold"
        >
          Harga
          <ChevronDown className="ml-1 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const harga = row.getValue("harga") as number
        return (
          <div className="text-right font-medium">
            Rp {harga.toLocaleString("id-ID")}
          </div>
        )
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const property = row.original
        return (
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleDetails(property)}>
                  Details
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleDelete(property)}
                  className="text-red-500 focus:text-red-600"
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
    },
  ]

  const table = useReactTable({
    data: filteredData,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: { sorting },
  })

  return (
    <div className="w-full">
      {/* Filter Input */}
      <div className="flex items-center py-4">
        <Input
          placeholder="Cari nama properti..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows?.length ? (
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
                  Tidak ada data properti.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex justify-end space-x-2 py-4">
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

      {/* Lazy Loaded Dialog */}
      {showDialog && (
        <React.Suspense fallback={null}>
          <PropertyDetailsDialog
            open={showDialog}
            onOpenChange={setShowDialog}
            property={selectedProperty}
          />
        </React.Suspense>
      )}
    </div>
  )
}
