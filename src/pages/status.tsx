import useSWR from "swr";
import Head from "next/head";
import { useEffect, useState } from "react";
import { StatusEnum } from "@/enum/status.enum";
import { StatusResponse } from "@/types";
import { ServiceCard } from "@/components/status/service-card";
import { UpdatedAt, ValueBadge } from "@/components/status/status-badges";
import { StatusHistory } from "@/components/status/status-history";

function useServiceStatus(
  data: StatusResponse | undefined,
  error: any,
  isLoading: boolean
) {
  const getStatus = (dependency?: any) => {
    if (isLoading) return StatusEnum.Loading;
    if (error || (data && data.error)) return StatusEnum.Outage;
    if (!dependency) return StatusEnum.Outage;
    return StatusEnum.Healthy;
  };

  const apiStatus = getStatus(data);
  const dbStatus = data?.dependencies?.database
    ? StatusEnum.Healthy
    : StatusEnum.Outage;

  return { apiStatus, dbStatus };
}

function getMockHistoryData() {
  const today = new Date();
  const history = [];

  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);

    let status = StatusEnum.Healthy;
    let uptime = 100;

    const rand = Math.random();
    if (rand < 0.05) {
      status = StatusEnum.Outage;
      uptime = 70 + Math.floor(Math.random() * 25);
    } else if (rand < 0.15) {
      status = StatusEnum.Degraded;
      uptime = 90 + Math.floor(Math.random() * 8);
    }

    history.push({ date: date.toISOString().split("T")[0], status, uptime });
  }

  return history;
}

function useLastUpdate(data: StatusResponse | undefined) {
  const [lastUpdate, setLastUpdate] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (data && !data.error && data.updated_at) {
      setLastUpdate(data.updated_at);
      localStorage.setItem("lastStatusUpdate", data.updated_at);
    } else if (!lastUpdate) {
      const saved = localStorage.getItem("lastStatusUpdate");
      if (saved) setLastUpdate(saved);
    }
  }, [data, lastUpdate]);

  return lastUpdate;
}

async function fetchApi(url: string) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error: any) {
    return { error: true, message: error.message };
  }
}

export default function StatusPage() {
  const historyData = getMockHistoryData();
  const [apiCardExpanded, setApiCardExpanded] = useState(false);
  const { data, error, isLoading } = useSWR<StatusResponse>(
    "/api/v1/status",
    fetchApi,
    {
      refreshInterval: 15000,
      revalidateOnFocus: false,
      revalidateIfStale: true,
      dedupingInterval: 10000,
    }
  );
  const { apiStatus, dbStatus } = useServiceStatus(data, error, isLoading);
  const lastSuccessfulUpdate = useLastUpdate(data);

  return (
    <>
      <Head>
        <title>Status dos Serviços | Readify</title>
        <meta
          name="description"
          content="Página de status em tempo real dos serviços Readify"
        />
      </Head>
      <main className="container mx-auto pb-24">
        <div className="flex flex-col py-2 mb-12">
          <h1 className="text-4xl font-bold">Status dos Serviços</h1>
          <UpdatedAt timestamp={lastSuccessfulUpdate} />
        </div>

        <div className="grid gap-12 md:grid-cols-2">
          <ServiceCard
            title="API"
            status={apiStatus}
            expanded={apiCardExpanded}
          >
            <div className="text-sm text-gray-600">
              {apiStatus === StatusEnum.Healthy
                ? "API respondendo normalmente"
                : "API com problemas de comunicação"}
              {apiStatus === StatusEnum.Outage && (
                <p className="text-sm text-red-500 mt-2">
                  Não foi possível obter informações atualizadas.
                </p>
              )}
              <StatusHistory
                data={historyData}
                onExpandChange={setApiCardExpanded} // Passamos o callback
              />
            </div>
          </ServiceCard>

          <ServiceCard title="Database" status={dbStatus}>
            {dbStatus === StatusEnum.Healthy ? (
              <div className="flex flex-col gap-2 text-sm text-gray-600">
                <div>
                  <span className="font-semibold text-gray-800">Version:</span>{" "}
                  <ValueBadge value={data?.dependencies?.database?.version} />
                </div>
                <div>
                  <span className="font-semibold text-gray-800">
                    Max Connections:
                  </span>{" "}
                  <ValueBadge
                    value={data?.dependencies?.database?.max_connections}
                  />
                </div>
                <div>
                  <span className="font-semibold text-gray-800">
                    Opened Connections:
                  </span>{" "}
                  <ValueBadge
                    value={data?.dependencies?.database?.opened_connections}
                  />
                </div>
              </div>
            ) : (
              <p className="text-sm text-red-500">
                Não foi possível obter informações do banco de dados.
              </p>
            )}
          </ServiceCard>
        </div>
      </main>
    </>
  );
}
