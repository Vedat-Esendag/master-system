import { Button } from "@/components/ui/button"
import { ChartDemoFrederik } from "@/components/chartDemoFrederik"

export default function CustomizeTablePage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Customize Table</h1>
        <div className="space-x-2">
          <Button variant="outline">Export</Button>
          <Button>Save Changes</Button>
        </div>
      </div>
      <ChartDemoFrederik />
    </div>
  )
}
