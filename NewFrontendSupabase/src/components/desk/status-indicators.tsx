import { DeskState } from "@/lib/desk-api";

interface StatusIndicatorProps {
  label: string;
  active: boolean;
  variant: "warning" | "error" | "success";
}

const StatusIndicator = ({ label, active, variant }: StatusIndicatorProps) => {
  const variants = {
    warning: "bg-yellow-100 text-yellow-800",
    error: "bg-red-100 text-red-800",
    success: "bg-green-100 text-green-800",
  };

  if (!active) return null;

  return (
    <div className={`p-2 rounded ${variants[variant]}`}>
      {label}
    </div>
  );
};

interface DeskStatusIndicatorsProps {
  state: DeskState;
}

export function DeskStatusIndicators({ state }: DeskStatusIndicatorsProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Status Indicators</h3>
      <div className="grid grid-cols-2 gap-2">
        <StatusIndicator
          label="System Status"
          active={true}
          variant={state.status === "Normal" ? "success" : "error"}
        />
        <StatusIndicator
          label="Position Lost"
          active={state.isPositionLost}
          variant="warning"
        />
        <StatusIndicator
          label="Anti-Collision"
          active={state.isAntiCollision}
          variant="error"
        />
        <StatusIndicator
          label="Overload Protection (Up)"
          active={state.isOverloadProtectionUp}
          variant="error"
        />
        <StatusIndicator
          label="Overload Protection (Down)"
          active={state.isOverloadProtectionDown}
          variant="error"
        />
      </div>
    </div>
  );
}
