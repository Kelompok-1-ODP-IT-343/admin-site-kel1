//Data masih diambil dari customers.ts

"use client"

import * as React from "react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { customers, Customer } from "@/components/data/approvekpr"
// import { ArrowUpIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { Calculator, Settings2 } from "lucide-react"
import { useEffect, useState } from "react"
import { getAllPengajuanByUser, Pengajuan } from "@/services/approvekpr"

function formatDate(dateString: string) {
  if (!dateString) return "-"
  const d = new Date(dateString)
  return d.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

export default function ApprovalTable() {
  const router = useRouter()
  const [data, setData] = useState<Pengajuan[]>([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })

  useEffect(() => {
    let active = true
    const fetchData = async () => {
      try {
        const result = await getAllPengajuanByUser()
        if (active) setData(result || [])
      } catch (err) {
        console.error("❌ Gagal memuat data pengajuan:", err)
        if (active) setData([])
      } finally {
        if (active) setLoading(false)
      }
    }
    fetchData()
    return () => { active = false }
  }, [])

  const handleActionClick = (customer: Customer) => {
    router.push(`/dashboard/simulate?id=${customer.id}`)
  }


  const columns: ColumnDef<Pengajuan>[] = [
    {
      accessorKey: "aplikasiKode",
      header: () => <div className="font-semibold">ID Pengajuan</div>,
      cell: ({ row }) => <div className="capitalize">{row.getValue("aplikasiKode")}</div>,
    },
    {
      accessorKey: "applicantName",
      header: () => <div className="font-semibold">Name</div>,
      cell: ({ row }) => <div className="capitalize">{row.getValue("applicantName")}</div>,
    },
    {
      accessorKey: "applicantPhone",
      header: () => <div className="font-semibold">Phone</div>,
      cell: ({ row }) => (
        <div className="text-center font-medium">{row.getValue("applicantPhone") || "-"}</div>
      ),
    },
    {
      accessorKey: "namaProperti",
      header: () => <div className="font-semibold">Nama Properti</div>,
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("namaProperti")}</div>
      ),
    },
    {
      accessorKey: "tanggal",
      header: () => <div className="font-semibold">Tanggal</div>,
      cell: ({ row }) => (
        <div className="text-center">
          <div className="">{formatDate(row.getValue("tanggal") as string)}</div>
        </div>
      ),
    },
    {
      id: "action",
      header: () => (
        <div className="text-center">
          <Calculator className="inline-block w-4 h-4 text-muted-foreground" />
        </div>
      ),
      cell: ({ row }) => {
        const pengajuan = row.original
        return (
          <div className="flex justify-center">
            <Button
              variant="outline"
              size="sm"
              aria-label="Simulate"
              onClick={() => router.push(`/dashboard/simulate?id=${pengajuan.id}`)}
              className="flex items-center gap-2"
            >
              <Settings2 className="w-4 h-4" />
              Action
            </Button>
          </div>
        )
      },
    },
  ]

  const table = useReactTable({
    data, // ⬅️ sekarang ambil dari API, bukan dari file statis
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    state: { pagination },
  })

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter emails..."
          className="max-w-sm"
          onChange={(e) => {
            const value = e.target.value.toLowerCase()
            const filtered = data.filter((item) =>
              (item.applicantEmail || "").toLowerCase().includes(value)
            )
            table.options.data = filtered.length ? filtered : data
          }}
        />
      </div>

      <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
        <Table className="w-full border-collapse">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="bg-muted/80 divide-x divide-border" 
              >
                {/* Kolom nomor */}
                <TableHead className="py-3 px-4 text-sm font-semibold text-foreground text-center w-[60px]">
                  No
                </TableHead>

                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={`
                      py-3 px-4 text-sm font-semibold text-foreground
                      ${header.column.id === "action" ? "text-center" : "text-center"}
                    `}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={table.getAllColumns().length + 1}
                  className="h-24 text-center text-muted-foreground"
                >
                  Loading data pengajuan...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row, index) => (
                <TableRow
                  key={row.id}
                  className="hover:bg-muted/30 transition-colors duration-150 divide-x divide-border"
                >
                  {/* Kolom nomor urut */}
                  <TableCell className="py-3 px-4 text-sm font-medium text-center w-[60px]">
                    {index + 1}
                  </TableCell>

                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      style={{
                        textAlign: cell.column.id === "action" ? "center" : "left",
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

            <div className="flex items-center justify-end space-x-2 py-4">
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
    </div>
  )
}
