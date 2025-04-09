import { StatusEnum } from "@/enum/status.enum";
import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { StatusHistoryItem } from "@/types/status.types";

interface StatusHistoryProps {
  data: StatusHistoryItem[];
  onExpandChange?: (expanded: boolean) => void;
}

export function StatusHistory({ data, onExpandChange }: StatusHistoryProps) {
  const [expanded, setExpanded] = useState(false);

  const displayData = expanded ? data : data.slice(0, 7);

  useEffect(() => {
    if (onExpandChange) {
      onExpandChange(expanded);
    }
  }, [expanded, onExpandChange]);

  const handleToggle = () => {
    setExpanded(!expanded);
  };

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-semibold text-gray-700">
          Histórico (últimos {expanded ? "30" : "7"} dias)
        </h3>
        <Button
          onClick={handleToggle}
          className="text-xs text-white bg-slate-800 hover:underline"
        >
          {expanded ? "Mostrar menos" : "Ver 30 dias"}
        </Button>
      </div>

      <div className="border border-gray-200 rounded-md overflow-hidden">
        <div className="flex">
          {displayData.map((day) => (
            <div
              key={day.date}
              className="flex-1 h-8 flex flex-col items-center justify-center border-r last:border-r-0 relative group"
            >
              <div
                className={`w-full h-2 ${getStatusColor(day.status)}`}
                title={`${formatDate(day.date)}: ${day.uptime}% disponível`}
              />
              <span className="text-[10px] text-gray-500 mt-1">
                {formatDate(day.date)}
              </span>

              {/* Tooltip ao passar o mouse */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded p-2 mb-1 hidden group-hover:block shadow-lg z-10 w-32">
                <p className="font-medium">{formatDateFull(day.date)}</p>
                <p>{getStatusLabel(day.status)}</p>
                <p>{day.uptime}% uptime</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Funções auxiliares
function getStatusColor(status: StatusEnum): string {
  switch (status) {
    case StatusEnum.Healthy:
      return "bg-green-500";
    case StatusEnum.Degraded:
      return "bg-yellow-500";
    case StatusEnum.Outage:
      return "bg-red-500";
    default:
      return "bg-gray-300";
  }
}

function getStatusLabel(status: StatusEnum): string {
  switch (status) {
    case StatusEnum.Healthy:
      return "Operacional";
    case StatusEnum.Degraded:
      return "Degradado";
    case StatusEnum.Outage:
      return "Indisponível";
    default:
      return "Desconhecido";
  }
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return `${date.getDate()}/${date.getMonth() + 1}`;
}

function formatDateFull(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("pt-BR");
}
