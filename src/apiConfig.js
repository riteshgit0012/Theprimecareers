// Centralized API configuration: Uses relative path so Vite proxy forwards to FastAPI backend automatically.
// This guarantees that both Laptop (localhost) and Mobile (LAN Wi-Fi IP) access the exact same live backend data!
export function getApiBase() {
  return ''
}

export const API_URL = ''
