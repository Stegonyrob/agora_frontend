export function getAuthHeaders() {
  const token = sessionStorage.getItem("accessToken");
  console.log(
    "🔐 AuthHeaders - Token obtenido:",
    token ? "Token presente" : "No token"
  );
  return token ? { Authorization: `Bearer ${token}` } : {};
}
