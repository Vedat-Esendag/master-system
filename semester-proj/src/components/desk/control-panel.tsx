import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DeskState } from "@/lib/desk-api";
import { Loader2 } from "lucide-react";

interface ControlPanelProps {
  deskId: string;
  state: DeskState;
  isMoving: boolean;
  onUpdatePosition: (position: number) => Promise<void>;
}

export function ControlPanel({ deskId, state, isMoving, onUpdatePosition }: ControlPanelProps) {
  const [targetPosition, setTargetPosition] = useState(state.position_mm);

  const STEP_SIZE = 10; // mm
  const MIN_HEIGHT = 650; // mm
  const MAX_HEIGHT = 1250; // mm

  const handleMove = async (newPosition: number) => {
    if (newPosition < MIN_HEIGHT || newPosition > MAX_HEIGHT) return;
    
    try {
      await onUpdatePosition(newPosition);
      setTargetPosition(newPosition);
    } catch (error) {
      console.error('Failed to move desk:', error);
    }
  };

  const handleStepMove = (direction: 'up' | 'down') => {
    const newPosition = direction === 'up' 
      ? Math.min(state.position_mm + STEP_SIZE, MAX_HEIGHT)
      : Math.max(state.position_mm - STEP_SIZE, MIN_HEIGHT);
    handleMove(newPosition);
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Desk Controls</h3>
      
      {/* Current Position Display */}
      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground">Current Height</p>
          <p className="text-2xl font-semibold">{state.position_mm}mm</p>
        </div>
      </div>

      {isMoving && (
        <div className="flex items-center justify-center space-x-2 py-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <p className="text-sm text-muted-foreground">
            Moving to {targetPosition}mm...
          </p>
        </div>
      )}

      {/* Movement Controls */}
      <div className="flex space-x-2">
        <Button 
          variant="outline" 
          size="lg"
          className="flex-1"
          onClick={() => handleStepMove('up')}
          disabled={isMoving || state.position_mm >= MAX_HEIGHT}
        >
          Move Up
        </Button>
        <Button 
          variant="outline" 
          size="lg"
          className="flex-1"
          onClick={() => handleStepMove('down')}
          disabled={isMoving || state.position_mm <= MIN_HEIGHT}
        >
          Move Down
        </Button>
      </div>

      {/* Manual Position Input */}
      <div className="flex space-x-2">
        <Input
          type="number"
          value={targetPosition}
          onChange={(e) => setTargetPosition(Number(e.target.value))}
          min={MIN_HEIGHT}
          max={MAX_HEIGHT}
          step={STEP_SIZE}
          className="flex-1"
        />
        <Button 
          onClick={() => handleMove(targetPosition)}
          disabled={isMoving || targetPosition === state.position_mm}
          className="flex-none"
        >
          Go To Height
        </Button>
      </div>

      {/* Emergency Stop */}
      <Button 
        variant="destructive" 
        className="w-full"
        disabled={state.speed_mms === 0}
        onClick={() => handleMove(state.position_mm)}
      >
        Emergency Stop
      </Button>
    </div>
  );
}
