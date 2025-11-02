"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal, Settings2 } from "lucide-react"
import { fetchDevelopers, updateDeveloperStatus, getDeveloperById } from "@/services/developers";
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
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

// import { developers, DeveloperDetail } from "@/components/data/developers" DUMMY
import { UiDeveloper, apiToUi } from "@/lib/developer-mapper";

import ViewDeveloperDialog from "@/components/dialogs/ViewDevelopersDialog"
type DeveloperDetail = {
  id: string
  companyName: string
  companyCode: string
  contact_person: string
  phone: string
  email: string
  website: string
  address: string
  city: string
  province: string
  postal_code: string
  established_year: string
  description: string
  partnership_level: string
  logo: string
}

export default function DeveloperTable() {
  const [developers, setDevelopers] = React.useState<UiDeveloper[]>([]);
  const [loading, setLoading] = React.useState(true)
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [showDialog, setShowDialog] = React.useState(false)
  const [selectedDeveloper, setSelectedDeveloper] = React.useState<UiDeveloper | null>(null);
  const [page, setPage] = React.useState(0)
  const [totalPages, setTotalPages] = React.useState(1)


  React.useEffect(() => {
    async function loadDevelopers() {
      setLoading(true);

      try {
        const data = await fetchDevelopers(); // ✅ pakai service Axios
        setDevelopers(data);
      } catch (err) {
        console.error("❌ Gagal load developers:", err);
        setDevelopers([]);
      } finally {
        setLoading(false);
      }
    }

    loadDevelopers();
  }, [page]);


  const columns: ColumnDef<UiDeveloper>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "companyName",
      header: () => <div className="font-semibold">Developer</div>,
      cell: ({ row }) => <div className="capitalize">{row.getValue("companyName")}</div>,
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="font-semibold p-0 m-0 h-0"
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
    },
    {
      accessorKey: "phone",
      header: () => <div className="font-semibold">Phone</div>,
      cell: ({ row }) => {
        const phone = row.getValue("phone") as string
        return <div className="text-center font-medium">{phone}</div>
      },
    },
    {
      accessorKey: "status",
      header: () => <div className="font-semibold text-center">Status</div>,
      cell: ({ row }) => {
        const status = row.getValue("status") as string
        const isActive = status === "ACTIVE"
        return (
          <div className="flex justify-center">
            <Badge
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                isActive
                  ? "bg-green-100 text-green-700 border border-green-300"
                  : "bg-red-100 text-red-700 border border-red-300"
              }`}
            >
              {isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
        )
      },
    },

    {
      id: "actions",
      enableHiding: false,
      header: () => <div className="font-semibold text-center">Action</div>,
      cell: ({ row }) => {
        const developer = row.original
        return (
          <div className="flex justify-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  onClick={(e) => {
                    console.log("🧩 Trigger Clicked", e.target)
                    e.stopPropagation()
                    e.preventDefault()
                  }}
                  onMouseDown={(e) => console.log("🧩 Mousedown on Trigger")}
                  variant="outline"
                  size="icon"
                  className="relative z-[10] h-9 w-9 rounded-lg border-muted-foreground/20 hover:bg-muted"
                >
                  <Settings2 className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => {
                    setSelectedDeveloper(developer)
                    setShowDialog(true)
                  }}
                >
                  View Developer
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={async () => {
                    try {
                      const res = await getDeveloperById(developer.id);
                      const detail = res?.data ?? res;

                      const formatted = `
                🏢 *${detail.companyName}* (${detail.companyCode})
                📜 Business License: ${detail.businessLicense}
                🏗️ Developer License: ${detail.developerLicense}

                👤 Contact Person: ${detail.contactPerson}
                📞 Phone: ${detail.phone}
                ✉️ Email: ${detail.email}
                🌐 Website: ${detail.website}

                📍 Address: ${detail.address}
                🏙️ City: ${detail.city}
                🏞️ Province: ${detail.province}
                📮 Postal Code: ${detail.postalCode}

                📆 Established: ${detail.establishedYear}
                📋 Description: ${detail.description}

                🏠 Specialization: ${detail.specialization}
                🤝 Partnership Level: ${detail.partnershipLevel}
                💰 Commission Rate: ${detail.commissionRate * 100}%
                📈 Status: ${detail.status}

                🕓 Verified At: ${detail.verifiedAt ?? "-"}
                👤 Verified By: ${detail.verifiedBy ?? "-"}
                🕒 Created At: ${detail.createdAt}
                🔄 Updated At: ${detail.updatedAt}
                `;

                      await navigator.clipboard.writeText(formatted.trim());

                      toast.success("Developer detail berhasil disalin ke clipboard!");
                    } catch (err) {
                      console.error("Gagal copy developer detail:", err);
                      toast.error("Gagal menyalin developer detail.");
                    }
                  }}
                >
                  Copy Developer Detail
                </DropdownMenuItem>


                {/* <DropdownMenuItem
                  onClick={() => console.log("Inactive", developer.id)}
                  className="text-red-500 focus:text-red-600"
                >
                  Inactive
                </DropdownMenuItem> */}
                <DropdownMenuItem
                  onClick={async () => {
                    const newStatus = developer.status === "ACTIVE" ? "INACTIVE" : "ACTIVE" 
                    toast.promise(
                      updateDeveloperStatus(developer.id, newStatus).then(() => {
                        setDevelopers(prev =>
                          prev.map(d =>
                            d.id === developer.id ? { ...d, status: newStatus } : d
                          )
                        )
                      }),
                      {
                        loading: newStatus === "ACTIVE" ? "Mengaktifkan developer..." : "Menonaktifkan developer...",
                        success: () => 
                          newStatus === "ACTIVE"
                            ? `${developer.companyName} Aktif ✅`
                            : `${developer.companyName} Nonaktif ❌`,
                        error: "Gagal mengubah status developer. Coba lagi nanti.",
                      }
                    )
                  }}
                  className={`${
                    developer.status === "ACTIVE"
                      ? "text-red-500 focus:text-red-600"
                      : "text-green-600 focus:text-green-700"
                  }`}
                >
                  {developer.status === "ACTIVE" ? "Inactive" : "Active"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
    },
  ]

  const table = useReactTable({
    data: developers,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: { sorting, columnFilters, columnVisibility, rowSelection },
  })

  if (loading) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        Loading developers...
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter emails..."
          value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("email")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown className="ml-1 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="overflow-visible rounded-xl border bg-card shadow-sm">
        <Table className="w-full border-collapse">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="bg-muted/80 divide-x divide-border h-2"
              >
                {/* Kolom nomor */}
                <TableHead className="py-2 px-3 text-sm font-semibold text-foreground text-center w-[60px]">
                  No
                </TableHead>

                {headerGroup.headers
                  // 🔹 Hilangkan header checkbox/select
                  .filter((header) => header.column.id !== "select")
                  .map((header) => (
                    <TableHead
                      key={header.id}
                      className="py-2 px-3 text-sm font-semibold text-foreground text-center"
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length ? (
              table
                .getRowModel()
                .rows.map((row, index) => (
                  <TableRow
                    key={row.id}
                    className="hover:bg-muted/30 transition-colors duration-150 divide-x divide-border"
                  >
                    {/* Kolom nomor urut */}
                    <TableCell className="py-3 px-4 text-sm font-medium text-center w-[60px]">
                      {index + 1}
                    </TableCell>

                    {row
                      .getVisibleCells()
                      // 🔹 Hilangkan sel checkbox/select
                      .filter((cell) => cell.column.id !== "select")
                      .map((cell) => (
                        <TableCell
                          key={cell.id}
                          style={{
                            textAlign: cell.column.id === "actions" ? "center" : "left",
                          }}
                          className={`
                            relative
                            py-3 px-4 text-sm
                            ${
                              cell.column.id === "email"
                                ? "text-muted-foreground"
                                : "font-medium"
                            }
                          `}
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                  </TableRow>
                ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={table.getAllColumns().length + 1}
                  className="h-24 text-center text-muted-foreground"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>


      </div>

      <ViewDeveloperDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        developer={selectedDeveloper}
        onUpdated={(upd) => {
          // replace item di state list
          setDevelopers(prev => prev.map(d => (d.id === upd.id ? upd : d)));
        }}
      />

    </div>
  )
}
