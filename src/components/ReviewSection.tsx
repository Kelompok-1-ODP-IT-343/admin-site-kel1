"use client"

import { IconFolderCode } from "@tabler/icons-react"
import { ArrowUpRightIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

export function AddProperties() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IconFolderCode />
        </EmptyMedia>
        <EmptyTitle>No Properties Yet</EmptyTitle>
        <EmptyDescription>
          You haven&apos;t added any properties yet. Get started by adding your
          first one.
        </EmptyDescription>
      </EmptyHeader>

      <EmptyContent>
        <div className="flex justify-center">
          <Button>Create Property</Button>
        </div>
      </EmptyContent>

      <Button
        variant="link"
        asChild
        className="text-muted-foreground"
        size="sm"
      >
        <a href="#">
          Learn More <ArrowUpRightIcon className="ml-1 h-4 w-4" />
        </a>
      </Button>
    </Empty>
  )
}
