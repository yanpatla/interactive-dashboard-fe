import axios from "axios";

export function getErrorMessage(err: unknown) {
  if (axios.isAxiosError(err) && err.response) {
    const msg = err.response.data.error;

    const status = err.response?.status;
    return status ? `${status}: ${msg}` : msg;
  }

  if (err instanceof Error) return err.message;
  return "Unknown error";
}
