// loginRepository.ts
// Encapsula las llamadas a la API de recuperación y reseteo de contraseña

export const loginRepository = {
  async requestPasswordRecovery(email: string, isAdmin: boolean = false) {
    const url = isAdmin
      ? "/admin/password/recovery-request"
      : "/user/password/recovery-request";
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
    const url = isAdmin ? "/admin/password/reset" : "/user/password/reset";
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, newPassword }),
    });
    if (!res.ok) throw new Error("Token inválido o expirado");
    return res.json();
  },
};
