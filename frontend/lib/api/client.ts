const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface ApiErrorResponse {
  error?: string;
  message?: string;
}

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export async function apiFetch<T>(
  title: string,
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    const errorData = data as ApiErrorResponse;

    throw new ApiError(
      errorData.error ||
        errorData.message ||
        `${title} API request failed.`,
      response.status,
    );
  }

  return data as T;
}