import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
const API_URL = `${BASE_URL}/api/v1`;

// 📚 Custom hook to fetch all books
export function useAllBooks() {
  return useQuery({
    queryKey: ["books", "all"],
    queryFn: async () => {
      const res = await axios.get(`${API_URL}/get-all-books`);
      return res.data.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes fresh in React memory
  });
}

// 📚 Custom hook to fetch recently added books
export function useRecentBooks() {
  return useQuery({
    queryKey: ["books", "recent"],
    queryFn: async () => {
      const res = await axios.get(`${API_URL}/get-recent-books`);
      return res.data.data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

// 🔥 Custom hook to fetch trending books
export function useTrendingBooks() {
  return useQuery({
    queryKey: ["books", "trending"],
    queryFn: async () => {
      const res = await axios.get(`${API_URL}/get-trending-books`);
      return res.data.data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

// ⭐ Custom hook to fetch editor's choice books
export function useEditorsChoiceBooks() {
  return useQuery({
    queryKey: ["books", "editors"],
    queryFn: async () => {
      const res = await axios.get(`${API_URL}/get-editors-choice`);
      return res.data.data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

// 📖 Custom hook to fetch single book by ID
export function useBookDetails(id) {
  return useQuery({
    queryKey: ["books", "detail", id],
    queryFn: async () => {
      if (!id) return null;
      const res = await axios.get(`${API_URL}/get-book-by-id/${id}`);
      return {
        ...res.data.data,
        isLive: res.data.isLive,
        isFutureScheduled: res.data.isFutureScheduled,
        scheduledMessage: res.data.scheduledMessage,
        goLiveDate: res.data.goLiveDate,
      };
    },
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes fresh
  });
}

// 🧹 Helper hook to invalidate book queries after mutations
export function useInvalidateBookQueries() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: ["books"] });
  };
}
