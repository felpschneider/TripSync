// API configuration and utilities for REST API communication

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api/v1"

export interface ApiError {
  message: string
  status: number
}

// Get auth token from localStorage
export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("auth_token")
}

// Set auth token in localStorage
export function setAuthToken(token: string): void {
  localStorage.setItem("auth_token", token)
}

// Remove auth token
export function removeAuthToken(): void {
  localStorage.removeItem("auth_token")
}

// Generic API request function
export async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken()

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const error: ApiError = {
      message: (await response.text()) || "Erro na requisição",
      status: response.status,
    }
    throw error
  }

  // Handle 204 No Content responses
  if (response.status === 204) {
    return undefined as T
  }

  return response.json()
}

// API endpoints
export const api = {
  // Auth endpoints
  auth: {
    login: (email: string, password: string) =>
      apiRequest<{ token: string; user: any }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }),
    signup: (email: string, password: string, name: string) =>
      apiRequest<{ token: string; user: any }>("/auth/signup", {
        method: "POST",
        body: JSON.stringify({ email, password, name }),
      }),
    validateInvite: (token: string) => apiRequest<{ valid: boolean; tripId: string }>(`/auth/invite/${token}`),
  },

  // Trip endpoints
  trips: {
    list: () => apiRequest<any[]>("/trips"),
    get: (id: string) => apiRequest<any>(`/trips/${id}`),
    create: (data: any) =>
      apiRequest<any>("/trips", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: string, data: any) =>
      apiRequest<any>(`/trips/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      apiRequest<void>(`/trips/${id}`, {
        method: "DELETE",
      }),
  },

  // Expense endpoints
  expenses: {
    list: (tripId: string) => apiRequest<any[]>(`/trips/${tripId}/expenses`),
    get: (tripId: string, id: string) => apiRequest<any>(`/trips/${tripId}/expenses/${id}`),
    create: (tripId: string, data: any) =>
      apiRequest<any>(`/trips/${tripId}/expenses`, {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (tripId: string, id: string, data: any) =>
      apiRequest<any>(`/trips/${tripId}/expenses/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    delete: (tripId: string, id: string) =>
      apiRequest<void>(`/trips/${tripId}/expenses/${id}`, {
        method: "DELETE",
      }),
  },

  // Proposal endpoints
  proposals: {
    list: (tripId: string) => apiRequest<any[]>(`/trips/${tripId}/proposals`),
    get: (tripId: string, id: string) => apiRequest<any>(`/trips/${tripId}/proposals/${id}`),
    create: (tripId: string, data: any) =>
      apiRequest<any>(`/trips/${tripId}/proposals`, {
        method: "POST",
        body: JSON.stringify(data),
      }),
    vote: (tripId: string, proposalId: string, vote: "yes" | "no") =>
      apiRequest<any>(`/trips/${tripId}/proposals/${proposalId}/vote`, {
        method: "POST",
        body: JSON.stringify({ vote }),
      }),
    finalize: (tripId: string, proposalId: string) =>
      apiRequest<any>(`/trips/${tripId}/proposals/${proposalId}/finalize`, {
        method: "POST",
      }),
  },

  // Task endpoints
  tasks: {
    list: (tripId: string) => apiRequest<any[]>(`/trips/${tripId}/tasks`),
    create: (tripId: string, data: any) =>
      apiRequest<any>(`/trips/${tripId}/tasks`, {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (tripId: string, id: string, data: any) =>
      apiRequest<any>(`/trips/${tripId}/tasks/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    toggleComplete: (tripId: string, id: string) =>
      apiRequest<any>(`/trips/${tripId}/tasks/${id}/toggle`, {
        method: "POST",
      }),
  },

  // Member endpoints
  members: {
    list: (tripId: string) => apiRequest<any[]>(`/trips/${tripId}/members`),
    invite: (tripId: string, email: string) =>
      apiRequest<{ inviteLink: string }>(`/trips/${tripId}/members/invite`, {
        method: "POST",
        body: JSON.stringify({ email }),
      }),
    remove: (tripId: string, memberId: string) =>
      apiRequest<void>(`/trips/${tripId}/members/${memberId}`, {
        method: "DELETE",
      }),
  },

  // Activity feed endpoints
  activities: {
    list: (tripId: string) => apiRequest<any[]>(`/trips/${tripId}/activities`),
  },

  // Export endpoints
  export: {
    pdf: (tripId: string) => apiRequest<{ url: string }>(`/trips/${tripId}/export/pdf`),
  },

  // Chat/Messages endpoints
  messages: {
    list: (tripId: string) => apiRequest<any[]>(`/trips/${tripId}/messages`),
    send: (tripId: string, content: string) =>
      apiRequest<any>(`/trips/${tripId}/messages`, {
        method: "POST",
        body: JSON.stringify({ content }),
      }),
  },

  // Profile endpoints
  profile: {
    get: () => apiRequest<any>(`/profile`),
    update: (data: any) =>
      apiRequest<any>(`/profile`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
  },
}
