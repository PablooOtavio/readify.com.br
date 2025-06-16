import { CardContent, CardHeader } from "@/components/ui/card";
import { StatusBadge } from "@/components/status/status-badges";
import { StatusEnum } from "@/enum/status.enum";
import { ReactNode } from "react";
import { motion } from "framer-motion";

interface ServiceCardProps {
  title: string;
  status: StatusEnum;
  children: ReactNode;
  expanded?: boolean;
}

export function ServiceCard({
  title,
  status,
  children,
  expanded = false,
}: ServiceCardProps) {
  return (
    <motion.div
      className={`
    bg-white border border-gray-200 rounded-2xl 
    p-4 sm:p-6 md:p-8 
    shadow-lg hover:shadow-xl 
    ${expanded ? "col-span-full md:col-span-2" : ""}
    overflow-hidden
  `}
      layout
      initial={{ opacity: 0.9 }}
      animate={{ opacity: 1, scale: expanded ? 1.0 : 1 }}
      transition={{
        duration: 0.3,
        ease: "easeInOut",
        layoutId: { duration: 0.4 },
      }}
    >
      <CardHeader className="flex justify-between items-center mb-4 p-0">
        <h2 className="text-base sm:text-lg font-bold text-gray-800">
          {title}
        </h2>
        <StatusBadge status={status} />
      </CardHeader>
      <CardContent className="p-0">{children}</CardContent>
    </motion.div>
  );
}
