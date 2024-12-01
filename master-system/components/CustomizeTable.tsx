"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { ChevronUp, ChevronDown } from "lucide-react"
import { toast } from "sonner"

// Constants for the API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
const API_KEY = process.env.NEXT_PUBLIC_API_KEY
const DESK_ID = process.env.NEXT_PUBLIC_DESK_ID

export default function CustomizeTable() {
  const [tableHeight, setTableHeight] = useState(100)
  const [desks, setDesks] = useState<string[]>([])
  const MIN_HEIGHT = 60
  const MAX_HEIGHT = 160

  const updateDeskHeight = async (heightCm: number) => {
    if (!API_KEY || !DESK_ID) {
      toast.error('API configuration missing')
      return
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v2/${API_KEY}/desks/${DESK_ID}/state`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            position_mm: heightCm * 10 // Convert cm to mm
          }),
        }
      )

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update desk height')
      }

      toast.success('Desk height updated')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update desk height')
    }
  }

  const fetchDesks = async () => {
    if (!API_KEY) {
      toast.error('API configuration missing')
      return
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v2/${API_KEY}/desks`
      )

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to fetch desks')
      }

      const desksList = await response.json()
      console.log('Fetched desks:', desksList)
      setDesks(desksList)
    } catch (error) {
      console.error('Error fetching desks:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to fetch desks')
    }
  }

  useEffect(() => {
    console.log('Component mounted, fetching desks...')
    fetchDesks()
  }, [])

  const handleHeightChange = (value: number[]) => {
    const newHeight = value[0]
    setTableHeight(newHeight)
    updateDeskHeight(newHeight)
  }

  const incrementHeight = () => {
    const newHeight = Math.min(tableHeight + 50, MAX_HEIGHT)
    setTableHeight(newHeight)
    updateDeskHeight(newHeight)
  }

  const decrementHeight = () => {
    const newHeight = Math.max(tableHeight - 50, MIN_HEIGHT)
    setTableHeight(newHeight)
    updateDeskHeight(newHeight)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Table Height</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={decrementHeight}
              disabled={tableHeight <= MIN_HEIGHT}
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
            <Slider
              value={[tableHeight]}
              max={MAX_HEIGHT}
              min={MIN_HEIGHT}
              step={10}
              onValueChange={handleHeightChange}
              className="flex-1"
            />
            <Button 
              variant="outline" 
              size="icon" 
              onClick={incrementHeight}
              disabled={tableHeight >= MAX_HEIGHT}
            >
              <ChevronUp className="h-4 w-4" />
            </Button>
          </div>
          <div className="text-center text-sm text-gray-500">
            Height: {tableHeight}cm
          </div>
        </div>
      </CardContent>
      <div className="p-6 border-t">
        <h3 className="font-semibold mb-4">Available Desks</h3>
        {desks.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {desks.map((deskId) => (
              <div
                key={deskId}
                className="p-3 rounded-lg border bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                onClick={() => {
                  // Update the DESK_ID when clicked
                  if (typeof window !== 'undefined') {
                    window.localStorage.setItem('SELECTED_DESK_ID', deskId);
                    console.log('Selected desk ID:', deskId)
                    console.log('Stored in localStorage:', window.localStorage.getItem('SELECTED_DESK_ID'))
                  }
                  toast.success(`Selected desk: ${deskId}`);
                }}
              >
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <p className="text-sm font-medium text-gray-700">{deskId}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-sm text-gray-500">No desks available</p>
          </div>
        )}
      </div>
    </Card>
  )
}
