"use client";

import { useState } from "react";
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

interface PreRegisterModalProps {
  text: string;
  colors?: string;
}

export default function PreRegisterModal({
  text,
  colors,
}: PreRegisterModalProps) {
  const [formData, setFormData] = useState({ name: "", email: "" });

  const handlePreRegister = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Pré-registro:", formData);
    setFormData({ name: "", email: "" });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className={`bg-teal-400 text-slate-800 px-8 py-6  text-lg font-medium hover:bg-teal-300 transition-colors shadow-md ring-1 ring-white/10 ${colors}`}
        >
          {text}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Pré-registro</DialogTitle>
          <DialogDescription>
            Preencha seus dados para ser notificado do lançamento.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handlePreRegister} className="space-y-4">
          <div>
            <label className="text-sm">Nome</label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>
          <div>
            <label className="text-sm">Email</label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-slate-800 text-white px-4 py-3 font-medium hover:bg-slate-700 transition-colors"
          >
            Registrar
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
