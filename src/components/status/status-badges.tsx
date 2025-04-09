import { Badge } from "@/components/ui/badge";
import { StatusEnum } from "@/enum/status.enum";

export function StatusBadge({ status }: { status: StatusEnum }) {
  const config = {
    [StatusEnum.Healthy]: {
      color: "bg-green-100 text-green-800",
      label: "Operacional",
    },
    [StatusEnum.Outage]: {
      color: "bg-red-100 text-red-800",
      label: "Indisponível",
    },
    [StatusEnum.Degraded]: {
      color: "bg-yellow-100 text-yellow-800",
      label: "Degradado",
    },
    [StatusEnum.Loading]: {
      color: "bg-blue-100 text-blue-800",
      label: "Carregando",
    },
  }[status] || { color: "bg-gray-100 text-gray-800", label: "Desconhecido" };

  return (
    <Badge className={`${config.color} font-medium opacity-90`}>
      {config.label}
    </Badge>
  );
}

export function ValueBadge({ value }: { value: string | number | undefined }) {
  return (
    <Badge className="bg-green-100 text-green-800">{value || "N/A"}</Badge>
  );
}

export function UpdatedAt({ timestamp }: { timestamp: string | undefined }) {
  let updatedAtText = "Sem dados disponíveis";

  if (timestamp) {
    try {
      updatedAtText = new Date(timestamp).toLocaleString("pt-BR");
    } catch (e) {
      console.error("Erro ao formatar data:", e);
    }
  }

  return (
    <Badge className={`mt-2 ${timestamp ? "bg-slate-700" : "bg-red-700"}`}>
      Última atualização: {updatedAtText}
    </Badge>
  );
}
