"use client"

import * as React from "react"
import { toast } from "sonner"
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
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
// import { properties, Property } from "@/components/data/properties"
// import { getAdminProperties } from "@/services/properties"
// import { getAdminProperties, Property } from "@/services/properties"
import { Property, getAdminProperties, deleteProperty } from "@/services/properties"



// lazy load dialog biar ga render berat
const PropertyDetailsDialog = React.lazy(
  () => import("@/components/dialogs/PropertyDetailsDialog")
)

export default function PropertiesList() {
  const [data, setData] = React.useState<Property[]>([])
  const [loading, setLoading] = React.useState(true)
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [filter, setFilter] = React.useState("")
  const [selectedProperty, setSelectedProperty] = React.useState<Property | null>(null)
  const [showDialog, setShowDialog] = React.useState(false)
  const [confirmDeleteOpen, setConfirmDeleteOpen] = React.useState(false)
  const [deleteTarget, setDeleteTarget] = React.useState<Property | null>(null)
  const [serialById, setSerialById] = React.useState<Record<number, number>>({})
  const fetchData = async () => {
    try {
      setLoading(true)
      const result = await getAdminProperties()
      if (result.success) {
        const items = result.data as Property[]
        setData(items)
        const sorted = [...items].sort((a, b) => Number(a.id) - Number(b.id))
        const map: Record<number, number> = {}
        sorted.forEach((p, idx) => { map[Number(p.id)] = idx + 1 })
        setSerialById(map)
      }
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    const fetchData = async () => {
      const result = await getAdminProperties()
      if (result.success) {
        const items = result.data as Property[]
        setData(items)
        const sorted = [...items].sort((a, b) => Number(a.id) - Number(b.id))
        const map: Record<number, number> = {}
        sorted.forEach((p, idx) => { map[Number(p.id)] = idx + 1 })
        setSerialById(map)
      }
      setLoading(false)
    }
    fetchData()
  }, [])

  // filter berdasarkan title
  const filteredData = React.useMemo(() => {
    return data.filter((p) =>
      p.title.toLowerCase().includes(filter.toLowerCase())
    )
  }, [data, filter])



  const handleDetails = (property: Property) => {
    setSelectedProperty(property)
    setShowDialog(true)
  }

  const handleDelete = (property: Property) => {
    setDeleteTarget(property)
    setConfirmDeleteOpen(true)
  }


  const columns: ColumnDef<Property>[] = [
    {
      id: "no",
      header: () => <div className="font-semibold text-center w-10">No</div>,
      cell: ({ row }) => {
        const id = Number(row.original.id)
        const no = serialById[id] ?? row.index + 1
        return <div className="text-center w-10">{no}</div>
      },
    },
    {
      accessorKey: "title",
      header: () => <div className="font-semibold">Nama Properti</div>,
      cell: ({ row }) => <div className="font-medium">{row.getValue("title")}</div>,
    },
    {
      accessorKey: "developer_name",
      header: () => <div className="font-semibold">Developer</div>,
      cell: ({ row }) => {
        const original = row.original as any;
        const name = original.developerName || row.getValue("developer_name");
        return <div>{name}</div>;
      },
    },
    {
      accessorKey: "address",
      header: () => <div className="font-semibold">Alamat</div>,
      cell: ({ row }) => (
        <div className="truncate max-w-xs text-muted-foreground">
          {row.getValue("address")}
        </div>
      ),
    },
    {
      accessorKey: "price",
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
        const harga = row.getValue("price") as number
        return (
          <div className="text-left font-medium">
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
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: { sorting },
  })

  if (loading) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        Loading Properties...
      </div>
    )
  }
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
              <TableRow
                key={headerGroup.id}
                // className="bg-muted/80 divide-x divide-border" // 🔹 header abu & garis vertikal
                className="bg-muted/80 h-2"
              >
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
            onUpdated={(updated?: any) => {
              if (updated && updated.id) {
                // Optimistic update: sinkronkan nama developer di list tanpa menunggu GET
                setData(prev => prev.map(p => (
                  p.id === updated.id
                    ? { ...p, developer_name: updated.developerName, developerId: updated.developerId }
                    : p
                )));
              } else {
                fetchData();
              }
            }}
          />
        </React.Suspense>
      )}

      {/* Dialog Konfirmasi Hapus Properti */}
      <Dialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Properti</DialogTitle>
            <DialogDescription>
              {deleteTarget
                ? `Anda yakin ingin menghapus "${deleteTarget.title}"? Tindakan ini tidak dapat dibatalkan.`
                : "Anda yakin ingin menghapus properti ini?"}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setConfirmDeleteOpen(false)
                setDeleteTarget(null)
              }}
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={async () => {
                if (!deleteTarget) return
                setConfirmDeleteOpen(false)
                const target = deleteTarget
                setDeleteTarget(null)
                toast.promise(
                  deleteProperty(target.id),
                  {
                    loading: "Menghapus properti...",
                    success: (res) => {
                      if (res?.success) {
                        setData((prev) => {
                          const next = prev.filter((p) => p.id !== target.id)
                          const sorted = [...next].sort((a, b) => Number(a.id) - Number(b.id))
                          const map: Record<number, number> = {}
                          sorted.forEach((p, idx) => { map[Number(p.id)] = idx + 1 })
                          setSerialById(map)
                          return next
                        })
                        return `${target.title} berhasil dihapus`
                      }
                      throw new Error(res?.message || "Gagal menghapus properti")
                    },
                    error: "❌ Gagal menghapus properti. Coba lagi nanti.",
                  }
                )
              }}
            >
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
