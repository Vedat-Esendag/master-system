"use client"

import React, { useState } from 'react'
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
    </Card>
  )
}
