import { useEffect } from "react";
import {
  clearQueryPromise,
  getQueryPromise,
  setQueryPromise,
} from "./QueryPromises";
import { getQueryData, setQueryData, setQueryStatus } from "./QueryStore";
import { useQueryData, useQueryStatus } from "./useQueryData";
import type { Status } from "./type";

interface UseQueryProps<T> {
  queryKey: string;
  queryFn: () => Promise<T>;
  initialData?: Partial<T>;
  isSuspense?: boolean;
  isErrorBoundary?: boolean;
  refetchOnWindowFocus?: boolean;
  refetchOnReconnect?: boolean;
}

const AUTO_REFETCH_INTERVAL = 5 * 60 * 1000; // 5분

interface UseQueryCommonResult {
  status: Status;
  refetch: () => void;
}

export default function useQuery<T>(
  props: UseQueryProps<T> & { initialData: Partial<T> }
): UseQueryCommonResult & {
  data: T;
};
export default function useQuery<T>(
  props: UseQueryProps<T> & { initialData?: undefined }
): UseQueryCommonResult & {
  data: T | undefined;
};
export default function useQuery<T>({
  queryKey,
  queryFn,
  initialData,
  isSuspense = false,
  isErrorBoundary = false,
  refetchOnWindowFocus = true,
  refetchOnReconnect = true,
}: UseQueryProps<T>) {
  const data = useQueryData<T | undefined>(queryKey);
  const status = useQueryStatus(queryKey);

  const fetchData = async () => {
    setQueryStatus(queryKey, "pending");
    try {
      let promise = getQueryPromise(queryKey);
      if (!promise) {
        promise = queryFn();
        setQueryPromise(queryKey, promise);
      }

      const response = await promise;

      setQueryData(queryKey, response);
      setQueryStatus(queryKey, "success");
      clearQueryPromise(queryKey);
    } catch (error) {
      setQueryData(queryKey, error);
      setQueryStatus(queryKey, "error");
      clearQueryPromise(queryKey);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const interval = setInterval(fetchData, AUTO_REFETCH_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!refetchOnWindowFocus) return;
    window.addEventListener("focus", fetchData);
    return () => window.removeEventListener("focus", fetchData);
  }, []);

  useEffect(() => {
    if (!refetchOnReconnect) return;
    window.addEventListener("online", fetchData);
    return () => window.removeEventListener("online", fetchData);
  }, []);

  if (isErrorBoundary && status === "error") throw getQueryData(queryKey);
  if (isSuspense && status === "pending" && !data)
    throw getQueryPromise(queryKey);
  return {
    data: data ?? initialData,
    status,
    refetch: fetchData,
  };
}
