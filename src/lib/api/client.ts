import { siteConfig } from "@/lib/config";
import type { ApiErrorBody } from "./types";

export class ApiError extends Error {
  status: number;
  code: string;
  fields: Record<string, string[] | string>;

  constructor(status: number, body: Partial<ApiErrorBody>) {
    super(body.detail || "Something went wrong. Please try again.");
    this.status = status;
    this.code = body.code || "error";
    this.fields = body.fields || {};
  }

  /** First message for a field, for showing under a form input. */
  fieldError(name: string) {
    const value = this.fields[name];
    return Array.isArray(value) ? value[0] : value;
  }
}

export class NetworkError extends ApiError {
  constructor() {
    super(0, {
      code: "network_error",
      detail: "We couldn't reach the shop. Check your connection and try again.",
    });
  }
}

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  token?: string | null;
  cartToken?: string | null;
  /** Called with the response so callers can read headers such as X-Cart-Token. */
  onResponse?: (response: Response) => void;
};

export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, token, cartToken, onResponse, headers, ...init } = options;
  const finalHeaders = new Headers(headers);
  finalHeaders.set("Accept", "application/json");
  if (body !== undefined) finalHeaders.set("Content-Type", "application/json");
  if (token) finalHeaders.set("Authorization", `Bearer ${token}`);
  if (cartToken) finalHeaders.set("X-Cart-Token", cartToken);

  let response: Response;
  try {
    response = await fetch(`${siteConfig.apiUrl}${path}`, {
      ...init,
      headers: finalHeaders,
      body: body === undefined ? undefined : JSON.stringify(body),
      // The refresh token lives in an httpOnly cookie scoped to /api/v1/auth/.
      credentials: "include",
    });
  } catch {
    throw new NetworkError();
  }

  onResponse?.(response);

  if (response.status === 204) return undefined as T;

  const text = await response.text();
  const data = text ? safeJson(text) : null;

  if (!response.ok) {
    throw new ApiError(response.status, (data as Partial<ApiErrorBody>) ?? {});
  }
  return data as T;
}

function safeJson(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

/** Builds a query string from a flat object, repeating keys for arrays and skipping empty values. */
export function toQueryString(params: Record<string, unknown>) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "" || value === false) continue;
    if (Array.isArray(value)) value.forEach((v) => search.append(key, String(v)));
    else search.set(key, String(value));
  }
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}
