'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { fetchAllDesks, createDesk, deleteDesk, fetchAllEmployees } from '@/lib/queries'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface Desk {
  desk_id: number
  desk_name: string
  employee_id: number | null
  employee?: {
    employee_id: number
    name: string
  }
}

interface Employee {
  employee_id: number
  name: string
  position: string | null
}

export default function Desks() {
  const [desks, setDesks] = useState<Desk[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])
  const [newDeskName, setNewDeskName] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    const [desksData, employeesData] = await Promise.all([
      fetchAllDesks(),
      fetchAllEmployees()
    ])
    setDesks(desksData)
    setEmployees(employeesData)
  }

  async function handleCreateDesk(e: React.FormEvent) {
    e.preventDefault()
    await createDesk({ desk_name: newDeskName, employee_id: null })
    setNewDeskName('')
    loadData()
  }

  async function handleDeleteDesk(deskId: number) {
    await deleteDesk(deskId)
    loadData()
  }

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New Desk</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateDesk} className="flex gap-4">
            <Input
              placeholder="Desk Name"
              value={newDeskName}
              onChange={(e) => setNewDeskName(e.target.value)}
              className="flex-1"
            />
            <Button type="submit">Add Desk</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Desk List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {desks.map((desk) => (
              <div key={desk.desk_id} className="flex items-center justify-between p-4 border rounded hover:bg-gray-50">
                <div>
                  <h3 className="font-medium">{desk.desk_name}</h3>
                  <p className="text-sm text-gray-500">
                    {desk.employee ? (
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                        Assigned to {desk.employee.name}
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-gray-300"></span>
                        Unassigned
                      </span>
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteDesk(desk.desk_id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}