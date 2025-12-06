import { create } from 'zustand';

interface UiStore {
  sidebarOpen: boolean;
  selectedFolder: string | null;
  selectedCategory: string | null;
  searchQuery: string;
  
  toggleSidebar: () => void;
  setSelectedFolder: (folder: string | null) => void;
  setSelectedCategory: (category: string | null) => void;
  setSearchQuery: (query: string) => void;
}

export const useUiStore = create<UiStore>((set) => ({
  sidebarOpen: true,
  selectedFolder: null,
  selectedCategory: null,
  searchQuery: '',

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSelectedFolder: (folder) => set({ selectedFolder: folder }),
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  setSearchQuery: (query) => set({ searchQuery: query })
}));
