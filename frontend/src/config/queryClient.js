import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,      // 5 minutes: data stays fresh in memory
      gcTime: 30 * 60 * 1000,         // 30 minutes: keep inactive query data in memory
      refetchOnWindowFocus: true,     // Auto-sync when user returns to browser tab
      refetchOnMount: true,           // Sync on component mount if stale
      retry: 1,                       // Retry failed requests once before showing error
    },
  },
});
