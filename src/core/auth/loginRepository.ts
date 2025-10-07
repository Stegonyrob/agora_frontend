export const LoginRepository = {
  async requestPasswordRecovery(email: string, isAdmin: boolean = false) {
    const url = isAdmin
      ? import.meta.env.VITE_API_ENDPOINT_ADMIN_PASSWORD_RECOVERY_REQUEST
      : import.meta.env.VITE_API_ENDPOINT_USER_PASSWORD_RECOVERY_REQUEST;
    if (!url) throw new Error("Endpoint de recuperación no configurado");
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (!res.ok) throw new Error("Error en la solicitud");
    return res.json();
  },

  async resetPassword(
    token: string,
    newPassword: string,
    isAdmin: boolean = false
  ) {
    const url = isAdmin
      ? import.meta.env.VITE_API_ENDPOINT_ADMIN_PASSWORD_RESET
      : import.meta.env.VITE_API_ENDPOINT_USER_PASSWORD_RESET;
    if (!url) throw new Error("Endpoint de reseteo no configurado");
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, newPassword }),
    });
    if (!res.ok) throw new Error("Token inválido o expirado");
    return res.json();
  },
};
