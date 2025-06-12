import { motion } from "framer-motion";

interface StatusMessageProps {
  status: string;
  videoSrc: string;
  message: string;
  textColor: string;
}

export default function StatusMessage({
  status,
  videoSrc,
  message,
  textColor,
}: StatusMessageProps) {
  return (
    <motion.div
      key={status}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center text-center py-10"
    >
      <video
        src={videoSrc}
        autoPlay
        muted
        playsInline
        className="w-32 h-32 mb-4"
      />
      <p className={`font-semibold text-lg ${textColor}`}>{message}</p>
    </motion.div>
  );
}
