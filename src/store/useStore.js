import { create } from "zustand";
import { persist } from "zustand/middleware";
import { INITIAL_TRANSACTIONS } from "../data/transactions";

const useStore = create(
  persist(
    (set, get) => ({
      // Role
      role: "admin", // 'admin' | 'viewer'
      setRole: (role) => set({ role }),

      // Theme
      darkMode: true,
      toggleDarkMode: () => set((s) => ({ darkMode: !s.darkMode })),

      // Transactions
      transactions: INITIAL_TRANSACTIONS,
      addTransaction: (txn) =>
        set((s) => ({
          transactions: [
            { ...txn, id: String(Date.now()) },
            ...s.transactions,
          ],
        })),
      updateTransaction: (id, data) =>
        set((s) => ({
          transactions: s.transactions.map((t) =>
            t.id === id ? { ...t, ...data } : t
          ),
        })),
      deleteTransaction: (id) =>
        set((s) => ({
          transactions: s.transactions.filter((t) => t.id !== id),
        })),

      // Filters
      filters: {
        search: "",
        type: "all",
        category: "all",
        sortBy: "date",
        sortDir: "desc",
        dateRange: "6m",
      },
      setFilter: (key, value) =>
        set((s) => ({ filters: { ...s.filters, [key]: value } })),
      resetFilters: () =>
        set({
          filters: {
            search: "",
            type: "all",
            category: "all",
            sortBy: "date",
            sortDir: "desc",
            dateRange: "6m",
          },
        }),

      // Active page
      activePage: "dashboard",
      setActivePage: (page) => set({ activePage: page }),

      // Modal
      modal: null, // null | { type: 'add' | 'edit', data?: any }
      openModal: (modal) => set({ modal }),
      closeModal: () => set({ modal: null }),

      // Getters
      getFilteredTransactions: () => {
        const { transactions, filters } = get();
        let result = [...transactions];

        // Date range filter
        const now = new Date();
        const ranges = { "1m": 1, "3m": 3, "6m": 6, "1y": 12 };
        if (filters.dateRange !== "all") {
          const months = ranges[filters.dateRange] || 6;
          const cutoff = new Date(now.getFullYear(), now.getMonth() - months, now.getDate());
          result = result.filter((t) => new Date(t.date) >= cutoff);
        }

        // Type filter
        if (filters.type !== "all") {
          result = result.filter((t) => t.type === filters.type);
        }

        // Category filter
        if (filters.category !== "all") {
          result = result.filter((t) => t.category === filters.category);
        }

        // Search
        if (filters.search) {
          const q = filters.search.toLowerCase();
          result = result.filter(
            (t) =>
              t.description.toLowerCase().includes(q) ||
              t.category.toLowerCase().includes(q)
          );
        }

        // Sort
        result.sort((a, b) => {
          let valA, valB;
          if (filters.sortBy === "date") {
            valA = new Date(a.date);
            valB = new Date(b.date);
          } else if (filters.sortBy === "amount") {
            valA = a.amount;
            valB = b.amount;
          } else {
            valA = a[filters.sortBy];
            valB = b[filters.sortBy];
          }
          if (valA < valB) return filters.sortDir === "asc" ? -1 : 1;
          if (valA > valB) return filters.sortDir === "asc" ? 1 : -1;
          return 0;
        });

        return result;
      },
    }),
    {
      name: "finance-dashboard-state",
      partialize: (state) => ({
        transactions: state.transactions,
        darkMode: state.darkMode,
        role: state.role,
      }),
    }
  )
);

export default useStore;
