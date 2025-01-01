'use client'

import { useEffect, useState, useCallback } from 'react';
import { deskAPI, DeskData } from '@/lib/desk-api';
import StandingDesk from '@/components/standing-desk';

export default function DeskManagement() {
  const [desks, setDesks] = useState<string[]>([]);
  const [selectedDesk, setSelectedDesk] = useState<string | null>(null);
  const [selectedDeskData, setSelectedDeskData] = useState<DeskData | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingDeskData, setLoadingDeskData] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMoving, setIsMoving] = useState(false);

  useEffect(() => {
    loadDesks();
  }, []);

  useEffect(() => {
    if (selectedDesk) {
      loadDeskData(selectedDesk);
    }
  }, [selectedDesk]);

  const pollDeskPosition = useCallback(async (deskId: string, targetPosition: number) => {
    const MAX_ATTEMPTS = 30;
    let attempts = 0;

    const poll = async () => {
      if (!deskId) return;
      
      const data = await deskAPI.getDeskData(deskId);
      const currentPosition = data.state.position_mm;
      
      if (Math.abs(currentPosition - targetPosition) <= 5) {
        setIsMoving(false);
        setSelectedDeskData(data);
        return;
      }

      if (attempts++ < MAX_ATTEMPTS) {
        setTimeout(() => poll(), 1000);
      } else {
        setIsMoving(false);
        console.warn('Desk movement timed out');
      }
    };

    setIsMoving(true);
    await poll();
  }, []);

  async function loadDesks() {
    try {
      setLoading(true);
      const deskList = await deskAPI.getAllDesks();
      setDesks(deskList);
      if (deskList.length > 0) {
        setSelectedDesk(deskList[0]);
      }
    } catch (err) {
      setError('Failed to load desks');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function loadDeskData(deskId: string) {
    try {
      setLoadingDeskData(true);
      const data = await deskAPI.getDeskData(deskId);
      setSelectedDeskData(data);
    } catch (err) {
      setError(`Failed to load desk ${deskId} data`);
      console.error(err);
    } finally {
      setLoadingDeskData(false);
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <div className="w-64 border-r bg-muted/20">
        <div className="p-4">
          <h2 className="font-semibold mb-4">Available Desks</h2>
          <button
            onClick={async () => {
              try {
                await deskAPI.raiseAllDesksToMax();
                if (selectedDesk) {
                  loadDeskData(selectedDesk);
                }
              } catch (error) {
                setError('Failed to raise all desks');
                console.error(error);
              }
            }}
            className="w-full p-2 mb-4 bg-primary text-primary-foreground rounded hover:bg-primary/90"
          >
            Raise All Desks
          </button>
          <div className="space-y-2">
            {desks.map((deskId) => (
              <button
                key={deskId}
                onClick={() => setSelectedDesk(deskId)}
                className={`w-full p-2 text-left rounded ${
                  selectedDesk === deskId
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted'
                }`}
              >
                {deskId}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 p-6">
        {selectedDeskData ? (
          <div className="space-y-6">
            {loadingDeskData && (
              <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
                <div className="h-1 w-32 bg-muted rounded overflow-hidden">
                  <div className="h-full bg-primary animate-[loading_1s_ease-in-out_infinite]" />
                </div>
              </div>
            )}
            <h1 className="text-2xl font-bold">
              {selectedDeskData.config.name}
            </h1>
            
            <div className="grid md:grid-cols-2 gap-6">
              <StandingDesk 
                state={selectedDeskData.state}
                className="md:col-span-1"
              />

              <div className="space-y-4 md:col-span-1">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">Manufacturer</h3>
                  <p>{selectedDeskData.config.manufacturer}</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">Usage</h3>
                  <p>Activations: {selectedDeskData.usage.activationsCounter}</p>
                  <p>Sit/Stand: {selectedDeskData.usage.sitStandCounter}</p>
                </div>
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex gap-4 mb-4">
                <button
                  disabled={isMoving}
                  onClick={async () => {
                    try {
                      const position = 1250; // Max height
                      await deskAPI.updateDeskPosition(selectedDesk!, position);
                      pollDeskPosition(selectedDesk!, position);
                    } catch (error) {
                      console.error('Failed to update position:', error);
                      setIsMoving(false);
                    }
                  }}
                  className="flex-1 p-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 disabled:opacity-50"
                >
                  Stand Position
                </button>
                <button
                  disabled={isMoving}
                  onClick={async () => {
                    try {
                      const position = 750; // Sit height
                      await deskAPI.updateDeskPosition(selectedDesk!, position);
                      pollDeskPosition(selectedDesk!, position);
                    } catch (error) {
                      console.error('Failed to update position:', error);
                      setIsMoving(false);
                    }
                  }}
                  className="flex-1 p-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 disabled:opacity-50"
                >
                  Sit Position
                </button>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Height: {selectedDeskData.state.position_mm}mm</span>
                  <span className="text-sm font-medium" id="heightValue">600mm</span>
                </div>
                <div className="flex gap-4 items-center">
                  <input
                    type="range"
                    min="600"
                    max="1250"
                    step="10"
                    defaultValue="600"
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      document.getElementById('heightValue')!.textContent = `${value}mm`;
                    }}
                    id="customHeight"
                  />
                  <button
                    disabled={isMoving}
                    onClick={async () => {
                      try {
                        const input = document.getElementById('customHeight') as HTMLInputElement;
                        const position = parseInt(input.value);
                        if (position >= 600 && position <= 1250) {
                          await deskAPI.updateDeskPosition(selectedDesk!, position);
                          pollDeskPosition(selectedDesk!, position);
                        }
                      } catch (error) {
                        console.error('Failed to update position:', error);
                        setIsMoving(false);
                      }
                    }}
                    className="p-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 disabled:opacity-50"
                  >
                    Set Height
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            Select a desk to view details
          </div>
        )}
      </div>
    </div>
  );
} 