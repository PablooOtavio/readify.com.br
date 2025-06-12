import { useState, FormEvent, ChangeEvent, useCallback } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import StatusMessage from "src/components/modals/statusMessage";

function usePreRegisterForm() {
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [errors, setErrors] = useState({ name: "", email: "" });

  const validateName = useCallback((name: string): string => {
    const trimmedName = name.trim();
    if (!trimmedName) return "Nome é obrigatório";

    const nameWords = trimmedName
      .split(/\s+/)
      .filter((word) => word.length > 0);
    if (nameWords.length < 2) {
      return "Por favor, informe pelo menos nome e sobrenome";
    }

    const hasShortWords = nameWords.some((word) => word.length < 2);
    if (hasShortWords) {
      return "Não use abreviações";
    }

    return "";
  }, []);

  const validateEmail = useCallback((email: string): string => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail) return "Email é obrigatório";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return "Por favor, informe um email válido";
    }

    return "";
  }, []);

  const handleChange = useCallback(
    <K extends keyof typeof formData>(field: K) =>
      (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setFormData((prev) => ({ ...prev, [field]: value }));

        // Validação em tempo real
        let error = "";
        if (field === "name") {
          error = validateName(value);
        } else if (field === "email") {
          error = validateEmail(value);
        }

        setErrors((prev) => ({ ...prev, [field]: error }));
      },
    [validateName, validateEmail],
  );

  const resetForm = useCallback(() => {
    setFormData({ name: "", email: "" });
    setErrors({ name: "", email: "" });
  }, []);

  const isFormValid =
    !errors.name &&
    !errors.email &&
    formData.name.trim() !== "" &&
    formData.email.trim() !== "";

  return {
    formData,
    errors,
    handleChange,
    resetForm,
    isFormValid,
  };
}

interface PreRegisterModalProps {
  text: string;
  colors?: string;
}

const FORM_FIELDS = [
  { key: "name", label: "Nome", type: "text" },
  { key: "email", label: "Email", type: "email" },
] as const;

export default function PreRegisterModal({
  text,
  colors,
}: PreRegisterModalProps) {
  const { formData, errors, handleChange, resetForm, isFormValid } =
    usePreRegisterForm();
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const handlePreRegister = async (e: FormEvent) => {
    e.preventDefault();

    if (!isFormValid) return;

    setStatus("loading");

    try {
      const res = await fetch("/api/v1/pre-register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Erro na resposta");

      setStatus("success");
      setTimeout(() => {
        resetForm();
        setStatus("idle");
      }, 3000);
    } catch {
      setStatus("error");
      setTimeout(() => {
        resetForm();
        setStatus("idle");
      }, 3000);
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
                  <Input
                    type={type}
                    value={formData[key]}
                    onChange={handleChange(key)}
                    required
                    className={
                      errors[key] ? "border-red-500 focus:border-red-500" : ""
                    }
                  />
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
