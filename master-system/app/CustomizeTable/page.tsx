"use client"

import { Button } from "@/components/ui/button"
import CustomizeTable from "@/components/CustomizeTable"

export default function CustomizeTablePage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Customize Table</h1>
        <div className="space-x-2">
          <Button variant="outline">Reset</Button>
          <Button>Save Changes</Button>
        </div>
      </div>
      <CustomizeTable />
    </div>
  )
}
