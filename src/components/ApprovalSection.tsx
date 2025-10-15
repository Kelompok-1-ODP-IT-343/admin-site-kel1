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
import { customers, Customer } from "@/components/data/customers"
import { ArrowUpIcon } from "lucide-react"
import { useRouter } from "next/navigation"

export default function ApprovalTable() {
  const router = useRouter()

  const handleActionClick = (customer: Customer) => {
    // kirim data lewat query string
    const query = new URLSearchParams({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
    }).toString()

    router.push(`/dashboard/simulate?${query}`)
  }

  const columns: ColumnDef<Customer>[] = [
    {
      accessorKey: "name",
      header: () => <div className="font-semibold">Name</div>,
      cell: ({ row }) => <div className="capitalize">{row.getValue("name")}</div>,
    },
    {
      accessorKey: "email",
      header: () => <div className="font-semibold">Email</div>,
      cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
    },
    {
      accessorKey: "phone",
      header: () => <div className="text-right font-semibold">Phone</div>,
      cell: ({ row }) => (
        <div className="text-right font-medium">{row.getValue("phone")}</div>
      ),
    },
    {
      id: "action",
      header: () => <div className="text-center font-semibold"></div>,
      cell: ({ row }) => {
        const customer = row.original
        return (
          <div className="flex justify-center">
            <Button
              variant="outline"
              size="sm"
              aria-label="Simulate"
              onClick={() => handleActionClick(customer)}
            >
              Action
            </Button>
          </div>
        )
      },
    },
  ]

  const table = useReactTable({
    data: customers,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter emails..."
          className="max-w-sm"
          onChange={(e) => {
            const value = e.target.value.toLowerCase()
            const filtered = customers.filter((c) =>
              c.email.toLowerCase().includes(value)
            )
            table.options.data = filtered.length ? filtered : customers
          }}
        />
      </div>

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
            {table.getRowModel().rows.length ? (
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
