"use client"

import { ChevronUp, ChevronDown } from 'lucide-react'
import { DeskState } from '@/lib/desk-api'

interface StandingDeskProps {
  state: DeskState;
  className?: string;
}

export default function StandingDesk({ state, className }: StandingDeskProps) {
  // Convert mm to percentage (assuming min: 650mm, max: 1250mm)
  const MIN_HEIGHT = 650;
  const MAX_HEIGHT = 1250;
  const heightPercentage = ((state.position_mm - MIN_HEIGHT) / (MAX_HEIGHT - MIN_HEIGHT)) * 100;
  
  // Adjust desk height calculation (140px range, centered at 50%)
  const deskHeight = 130 + (heightPercentage - 50) * 1.4; // 60px at 0%, 200px at 100%, 130px at 50%

  return (
    <div className={`bg-white rounded-xl shadow-lg p-4 space-y-4 ${className}`}>
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Current Height</h2>
        <span className="text-2xl font-bold text-blue-600">{state.position_mm}mm</span>
      </div>
      <div className="relative w-full h-60">
        <svg className="w-full h-full" viewBox="0 0 200 240" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Desk surface */}
          <rect
            x="20"
            y={40 + (200 * (1 - (state.position_mm - MIN_HEIGHT) / (MAX_HEIGHT - MIN_HEIGHT)))}
            width="160"
            height="10"
            fill="#3B82F6"
          />
          {/* Height markers */}
          <g stroke="#9CA3AF" strokeWidth="1">
            {Array.from({ length: 13 }, (_, i) => {
              const height = MIN_HEIGHT + (i * 50);
              const y = 40 + (200 * (1 - ((height - MIN_HEIGHT) / (MAX_HEIGHT - MIN_HEIGHT))));
              const isMajorTick = i % 2 === 0;
              return (
                <g key={i}>
                  <line 
                    x1="20" 
                    y1={y} 
                    x2={isMajorTick ? "35" : "28"} 
                    y2={y} 
                  />
                  {isMajorTick && (
                    <text 
                      x="40" 
                      y={y} 
                      fontSize="10" 
                      fill="#6B7280"
                      dominantBaseline="middle"
                    >
                      {height}mm
                    </text>
                  )}
                </g>
              );
            })}
          </g>
          {/* Floor line */}
          <line x1="0" y1="240" x2="200" y2="240" stroke="#9CA3AF" strokeWidth="2" />
        </svg>
      </div>
      <div className="flex justify-between text-sm text-gray-600">
      </div>
    </div>
  )
}
