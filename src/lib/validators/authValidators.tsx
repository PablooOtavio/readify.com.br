export function validateUsername(username: string): string {
  const value = username.trim();
  if (!value) return "Username é obrigatório";
  if (value.length < 3) return "Username deve ter pelo menos 3 caracteres";
  if (value.length > 20) return "Username deve ter no máximo 20 caracteres";
  if (!/^[a-zA-Z0-9_-]+$/.test(value))
    return "Username deve conter apenas letras, números, _ ou -";
  return "";
}

export function validateEmail(email: string): string {
  const value = email.trim();
  if (!value) return "Email é obrigatório";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
    return "Por favor, informe um email válido";
  return "";
}

export function validatePassword(password: string): string {
  if (!password) return "Senha é obrigatória";
  if (password.length < 8) return "Senha deve ter pelo menos 8 caracteres";
  if (
    !/[a-z]/.test(password) ||
    !/[A-Z]/.test(password) ||
    !/\d/.test(password)
  )
    return "Senha deve conter ao menos: 1 maiúscula, 1 minúscula e 1 número";
  return "";
}
export function validateConfirmPassword(
  confirmPassword: string,
  password: string,
): string {
  if (!confirmPassword) return "Confirmação de senha é obrigatória";
  if (confirmPassword !== password) return "As senhas não coincidem";
  return "";
}
