export const fetcher = async <TResponse = unknown>(input: RequestInfo, init?: RequestInit): Promise<TResponse> => {
  const res = await fetch(input, init);

  if (!res.ok) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const error: any = new Error('An error occurred while fetching the data.');
    error.info = await res.json();
    error.status = res.status;
    throw error;
  }

  return res.json() as Promise<TResponse>;
};
