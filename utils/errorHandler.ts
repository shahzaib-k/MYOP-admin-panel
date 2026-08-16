import { AxiosError } from "axios";

export interface NormalizedError {
  message: string;
  status: number | null;
  details: Record<string, unknown> | null;
}

/**
 * Every backend error is { success: false, message, errors }. Network
 * failures and unexpected shapes never happened during backend inspection,
 * so they're normalized here into the same shape the UI already handles.
 */
export const normalizeError = (error: unknown): NormalizedError => {
  if (error instanceof AxiosError) {
    if (!error.response) {
      return {
        message: "Cannot reach the server. Check your connection and try again.",
        status: null,
        details: null,
      };
    }

    const body = error.response.data as
      | { message?: string; errors?: Record<string, unknown> }
      | undefined;

    return {
      message: body?.message || "Something went wrong. Please try again.",
      status: error.response.status,
      details: body?.errors ?? null,
    };
  }

  if (error instanceof Error) {
    return { message: error.message, status: null, details: null };
  }

  return { message: "An unexpected error occurred.", status: null, details: null };
};
