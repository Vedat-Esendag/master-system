"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { ChevronUp, ChevronDown } from "lucide-react"

export default function CustomizeTable() {
  const [tableHeight, setTableHeight] = useState(300)
  const MIN_HEIGHT = 100
  const MAX_HEIGHT = 800

  const handleHeightChange = (value: number[]) => {
    setTableHeight(value[0])
  }

  const incrementHeight = () => {
    setTableHeight(prev => Math.min(prev + 50, MAX_HEIGHT))
  }

  const decrementHeight = () => {
    setTableHeight(prev => Math.max(prev - 50, MIN_HEIGHT))
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
            Height: {tableHeight}px
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
