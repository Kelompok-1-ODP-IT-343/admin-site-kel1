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
import { updateDeveloperStatus, getDeveloperById } from "@/services/developers";

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
      setLoading(true)

      // ambil token dari cookie (karena saat login kamu set pakai document.cookie)
      const token =
        typeof document !== "undefined"
          ? document.cookie.split("; ").find(c => c.startsWith("token="))?.split("=")[1]
          : null

      // DEBUG: pastikan kelihatan di console
      console.log("🔐 token:", token?.slice(0, 20) + "...")

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_HOST}/api/v1/admin/developers?page=${page}&size=10`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}), // << WAJIB
          },
          credentials: "include", // << kirim cookie juga
          cache: "no-store",
        }
      )

      if (res.status === 401) {
        console.warn("❌ 401 Unauthorized — token tidak terkirim/invalid")
        setDevelopers([])
        setTotalPages(1)
        setLoading(false)
        return
      }

      const json = await res.json()
      setDevelopers(json?.data?.data ?? [])
      setTotalPages(json?.data?.pagination?.totalPages ?? 1)
      setLoading(false)
    }

    loadDevelopers()
  }, [page])


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
                  variant="outline" 
                  size="icon" 
                  className="h-9 w-9 rounded-lg border-muted-foreground/20 hover:bg-muted"
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

                      // format teks agar mudah dibaca (multi-baris)
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

                      alert("Developer detail berhasil disalin ke clipboard!");
                    } catch (err) {
                      console.error("Gagal copy developer detail:", err);
                      alert("Gagal menyalin developer detail.");
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
                    try {
                      const newStatus = developer.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
                      const res = await updateDeveloperStatus(developer.id, newStatus);
                      
                      // update state list agar status langsung berubah di UI
                      setDevelopers(prev =>
                        prev.map(d =>
                          d.id === developer.id ? { ...d, status: newStatus } : d
                        )
                      );

                      console.log(`✅ Developer ${developer.companyName} set to ${newStatus}`);
                    } catch (err) {
                      console.error("Gagal update status:", err);
                      alert("Gagal mengubah status developer.");
                    }
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

      <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
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
