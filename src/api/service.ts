import { TASKS_URLS } from "../constants/api";

export const service = <TOutput>(
  path: string,
  config?: RequestInit,
): Promise<TOutput> =>
  fetch(new URL(path, TASKS_URLS), {
    ...config,
    headers: {
      ...config?.headers,
      "Content-Type": "application/json",
    },
  }).then((response) => {
    if (response.status > 400) {
      throw new Error("Something went wrong");
    }

    return response.json();
  });
