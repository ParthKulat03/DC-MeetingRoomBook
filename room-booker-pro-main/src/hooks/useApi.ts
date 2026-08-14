import { useCallback, useEffect, useRef, useState } from "react";
import type { ApiError } from "@/types";

export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
  reload: () => void;
  setData: (data: T | null) => void;
}

export function useApi<T>(fetcher: () => Promise<T>, deps: unknown[] = []): AsyncState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    fetcherRef
      .current()
      .then((result) => {
        if (active) setData(result);
      })
      .catch((err: ApiError) => {
        if (active) setError(err);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nonce, ...deps]);

  const reload = useCallback(() => setNonce((n) => n + 1), []);

  return { data, loading, error, reload, setData };
}
