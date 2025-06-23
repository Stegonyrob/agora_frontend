export function getAuthHeaders() {
  const token = sessionStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : undefined;
}
