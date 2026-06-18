import { ENDPOINT_URL } from "@/constants/api";
import { useAuthStore } from "@/stores/auth.store";

type ApiResponse<T> = {
  data: T | null;
  error: string | null;
  status: number;
};

type QueryParams = Record<string, string | number | boolean | undefined>;

function buildQueryString(params?: QueryParams): string {
  if (!params) return "";
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, String(value));
    }
  });
  return searchParams.toString() ? `?${searchParams.toString()}` : "";
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const makeRequest = (accessToken: string | null) => {

    return fetch(`${ENDPOINT_URL}/v1${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        ...options.headers,
      },
    });
  };

  try {
    const { accessToken } = useAuthStore.getState();
    let response = await makeRequest(accessToken);
    console.log("[DEFAULT REQUEST] Response", response.status);

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      return {
        data: null,
        error: errorBody?.message ?? "Request failed",
        status: response.status,
      };
    }

    const json = await response.json();
    return { data: json?.data ?? json, error: null, status: response.status };
  } catch {
    return { data: null, error: "Network error", status: 0 };
  }
}

export const apiClient = {
  get: <T>(endpoint: string, params?: QueryParams, options?: RequestInit) =>
    request<T>(`${endpoint}${buildQueryString(params)}`, { ...options, method: "GET" }),

  post: <T>(endpoint: string, body: unknown, options?: RequestInit) =>
    request<T>(endpoint, {
      ...options,
      method: "POST",
      body: JSON.stringify(body),
    }),

  put: <T>(endpoint: string, body: unknown, options?: RequestInit) =>
    request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: JSON.stringify(body),
    }),

  patch: <T>(endpoint: string, body: unknown, options?: RequestInit) =>
    request<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: JSON.stringify(body),
    }),

  delete: <T>(endpoint: string, options?: RequestInit) =>
    request<T>(endpoint, { ...options, method: "DELETE" }),
};