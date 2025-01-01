'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createEmployee, fetchAllEmployees, fetchAllDesks, assignDeskToEmployee } from '@/lib/queries'
import { Loader2 } from 'lucide-react'
import { useToast } from "@/components/ui/use-toast"

interface Employee {
  employee_id: number
  name: string
  position: string | null
  desk: {
    desk_id: number
    desk_name: string
    employee_id: number | null
  } | null
}

interface Desk {
  desk_id: number
  desk_name: string
  employee_id: number | null
}

export default function Employees() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [desks, setDesks] = useState<Desk[]>([])
  const [newEmployee, setNewEmployee] = useState({ name: '', position: '' })
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setIsLoading(true)
    try {
      const [employeesData, desksData] = await Promise.all([
        fetchAllEmployees(),
        fetchAllDesks()
      ])
      setEmployees(employeesData)
      setDesks(desksData)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load data. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function handleCreateEmployee(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await createEmployee(newEmployee)
      setNewEmployee({ name: '', position: '' })
      toast({
        title: "Success",
        description: "Employee created successfully",
      })
      await loadData()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create employee. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDeskAssignment(employeeId: number, deskId: string | null) {
    setIsLoading(true)
    try {
      await assignDeskToEmployee(employeeId.toString(), deskId)
      await loadData()
      toast({
        title: "Success",
        description: "Desk assigned successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to assign desk. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Employee Management</h1>
        <Button 
          onClick={() => loadData()} 
          variant="outline"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          )}
          Refresh
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add New Employee</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateEmployee} className="space-y-4">
            <Input
              placeholder="Name"
              value={newEmployee.name}
              onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
              disabled={isSubmitting}
              required
            />
            <Input
              placeholder="Position"
              value={newEmployee.position}
              onChange={(e) => setNewEmployee({ ...newEmployee, position: e.target.value })}
              disabled={isSubmitting}
              required
            />
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Adding...
                </>
              ) : (
                'Add Employee'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Employee List</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <div className="space-y-4">
              {employees.length === 0 ? (
                <p className="text-center text-gray-500 py-4">No employees found</p>
              ) : (
                employees.map((employee) => (
                  <div key={employee.employee_id} className="flex items-center justify-between p-4 border rounded hover:bg-gray-50">
                    <div>
                      <h3 className="font-medium">{employee.name}</h3>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">{employee.position}</p>
                        <p className="text-sm">
                          {employee.desk ? (
                            <span className="flex items-center gap-1">
                              <span className="w-2 h-2 rounded-full bg-green-500"></span>
                              Assigned to {employee.desk.desk_name}
                            </span>
                          ) : (
                            <span className="flex items-center gap-1">
                              <span className="w-2 h-2 rounded-full bg-gray-300"></span>
                              No desk assigned
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                    <Select
                      value={employee.desk?.desk_id?.toString() || 'unassigned'}
                      onValueChange={(deskId) => handleDeskAssignment(employee.employee_id, deskId === 'unassigned' ? null : deskId)}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Assign Desk" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unassigned">No Desk</SelectItem>
                        {desks.map((desk) => (
                          <SelectItem key={desk.desk_id} value={desk.desk_id.toString()}>
                            {desk.desk_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}