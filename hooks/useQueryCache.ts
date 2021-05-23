import { QueryFunction, useQuery, UseQueryOptions, UseQueryResult } from "react-query";

export function useQueryCache<TData = unknown>(
  queryKey: string | string[],
  queryFn: QueryFunction<TData>,
  options?: UseQueryOptions<TData>
): UseQueryResult<TData> {
  return useQuery<TData>(queryKey, queryFn, {
    ...options,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    refetchInterval: 1000 * 60 * 60 * 2, // 2 horas
    staleTime: 1000 * 60 * 60 * 1, // 1 hora
  });
}
