import { useState, useCallback, ChangeEvent, useMemo } from "react";
import {
  validateUsername,
  validateEmail,
  validatePassword,
  validateConfirmPassword,
} from "@/lib/validators/registerValidators";

export type FieldKey = "username" | "email" | "password" | "confirmPassword";

type FormData = Record<FieldKey, string>;

const initialFormData: FormData = {
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export function useUserRegisterForm() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<FormData>(initialFormData);

  const validators = useMemo(
    () => ({
      username: validateUsername,
      email: validateEmail,
      password: validatePassword,
      confirmPassword: (value: string) =>
        validateConfirmPassword(value, formData.password),
    }),
    [formData.password],
  );

  const handleChange = useCallback(
    (field: FieldKey) => (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;

      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));

      setErrors((prev) => ({
        ...prev,
        [field]: validators[field](value),
      }));
    },
    [validators],
  );

  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setErrors(initialFormData);
  }, []);

  const isFormValid =
    Object.values(errors).every((err) => !err) &&
    Object.values(formData).every((val) => val.trim() !== "");

  return {
    formData,
    errors,
    handleChange,
    resetForm,
    isFormValid,
  };
}
