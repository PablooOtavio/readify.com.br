import { useState, FormEvent } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import StatusMessage from "@/components/modals/statusMessage";
import { useUserRegisterForm } from "src/hooks/userRegisterForm";

interface PreRegisterModalProps {
  text: string;
  colors?: string;
}

const FORM_FIELDS = [
  { key: "username", label: "Nome de usuário", type: "text" },
  { key: "email", label: "Email", type: "email" },
  { key: "password", label: "Senha", type: "password" },
  { key: "confirmPassword", label: "Confirme a senha", type: "password" },
] as const;

export default function PreRegisterModal({
  text,
  colors,
}: PreRegisterModalProps) {
  const { formData, errors, handleChange, resetForm, isFormValid } =
    useUserRegisterForm();
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error" | "attention"
  >("idle");

  const [showPassword, setShowPassword] = useState(false);
  const [attentionMessage, setAttentionMessage] = useState("");

  const handlePreRegister = async (e: FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setStatus("loading");

    try {
      const res = await fetch("/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (res.status === 400) {
        const errorBody = await res.json();
        setStatus("attention");
        setAttentionMessage(errorBody?.message || "Conflito de dados");
        setTimeout(() => {
          setStatus("idle");
        }, 3000); // 3 segundos para a animação executar
        return;
      }

      if (!res.ok) throw new Error("Erro na resposta");

      setStatus("success");

      setTimeout(() => {
        resetForm();
        setStatus("idle");
      }, 3000);
    } catch {
      setTimeout(() => {
        setStatus("idle");
      }, 3000); // 3 segundos para a animação executar
    }
  };

  const isDisabled = status === "loading" || !isFormValid;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className={`bg-teal-400 text-slate-800 px-8 py-6 text-lg font-medium hover:bg-teal-300 transition-colors shadow-md ring-1 ring-white/10 ${colors}`}
        >
          {text}
        </Button>
      </DialogTrigger>
      <DialogContent className="transition-colors duration-300 bg-white">
        <DialogHeader>
          <DialogTitle>Pré-registro</DialogTitle>
          <DialogDescription>
            Preencha seus dados para ser notificado do lançamento.
          </DialogDescription>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {status === "success" && (
            <StatusMessage
              status="success"
              videoSrc="/animations/success.webm"
              message="Registro realizado com sucesso!"
              textColor="text-green-700"
            />
          )}

          {status === "error" && (
            <StatusMessage
              status="error"
              videoSrc="/animations/error.webm"
              message="O registro falhou. Por favor, tente novamente."
              textColor="text-red-700"
            />
          )}

          {status === "loading" && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center py-10"
            >
              <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
            </motion.div>
          )}
          {status === "attention" && (
            <StatusMessage
              status="attention"
              videoSrc="/animations/attention.webm"
              message={attentionMessage}
              textColor="text-yellow-700"
            />
          )}

          {status === "idle" && (
            <motion.form
              key="form"
              onSubmit={handlePreRegister}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4 mt-4"
            >
              {FORM_FIELDS.map(({ key, label, type }) => (
                <div key={key}>
                  <label className="block text-sm mb-1">{label}</label>

                  {key === "password" || key === "confirmPassword" ? (
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        value={formData[key]}
                        onChange={handleChange(key)}
                        required
                        className={`pr-10 ${errors[key] ? "border-red-500 focus:border-red-500" : ""}`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-slate-600"
                      >
                        {showPassword ? (
                          <EyeOff size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
                      </button>
                    </div>
                  ) : (
                    <Input
                      type={type}
                      value={formData[key]}
                      onChange={handleChange(key)}
                      required
                      className={
                        errors[key] ? "border-red-500 focus:border-red-500" : ""
                      }
                    />
                  )}

                  {errors[key] && (
                    <p className="text-red-500 text-xs mt-1">{errors[key]}</p>
                  )}
                </div>
              ))}

              <Button
                type="submit"
                disabled={isDisabled}
                className="w-full bg-slate-800 text-white px-4 py-3 font-medium hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Registrar
              </Button>
            </motion.form>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
