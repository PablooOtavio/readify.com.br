import { StatusEnum } from "@/enum/status.enum";
import { ReactNode } from "react";

export interface StatusResponse {
  updated_at: string;
  dependencies: {
    database: {
      version: string;
      max_connections: number;
      opened_connections: number;
    };
  };
  error?: boolean;
  message?: string;
}

export interface ServiceCardProps {
  title: string;
  status: StatusEnum;
  children: ReactNode;
}
interface StatusHistoryItem {
  date: string;
  status: StatusEnum;
  uptime: number;
}
