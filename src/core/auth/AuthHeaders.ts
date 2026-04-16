export function getAuthHeaders() {
  const token = sessionStorage.getItem("accessToken");

  return token ? { Authorization: `Bearer ${token}` } : {};
}
