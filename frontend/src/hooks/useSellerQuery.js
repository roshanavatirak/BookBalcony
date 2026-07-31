import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
const API_URL = `${BASE_URL}/api/v1`;

// 📊 Custom hook to fetch seller dashboard statistics
export function useSellerDashboardStats(headers) {
  return useQuery({
    queryKey: ["seller", "stats", headers?.id],
    queryFn: async () => {
      const res = await axios.get(`${API_URL}/seller/dashboard-stats`, { headers });
      return res.data.data;
    },
    enabled: !!headers?.id || !!headers?.authorization,
    staleTime: 3 * 60 * 1000, // 3 minutes
  });
}

// 📦 Custom hook to fetch seller's own products
export function useSellerMyProducts(headers) {
  return useQuery({
    queryKey: ["seller", "myproducts", headers?.id],
    queryFn: async () => {
      const res = await axios.get(`${API_URL}/myproducts`, { headers });
      return res.data.books;
    },
    enabled: !!headers?.id || !!headers?.authorization,
    staleTime: 3 * 60 * 1000,
  });
}

// 🧹 Helper hook to invalidate seller query keys
export function useInvalidateSellerQueries() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: ["seller"] });
  };
}
