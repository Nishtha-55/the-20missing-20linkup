export interface LostFoundItem {
  id: string;
  name: string;
  category: string;
  location: string;
  date: string;
  description: string;
  image?: string;
  status: "lost" | "found";
  foundAt?: string;
  reportedBy: string;
  reportedAt: string;
}

const STORAGE_KEY = "lostAndFoundItems";
const PROFILE_KEY = "userProfile";

export const itemStorage = {
  getItems: (): LostFoundItem[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  addItem: (item: Omit<LostFoundItem, "id" | "reportedAt">) => {
    const items = itemStorage.getItems();
    const newItem: LostFoundItem = {
      ...item,
      id: Date.now().toString(),
      reportedAt: new Date().toISOString(),
    };
    items.push(newItem);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    return newItem;
  },

  getItemById: (id: string): LostFoundItem | null => {
    const items = itemStorage.getItems();
    return items.find((item) => item.id === id) || null;
  },

  updateItem: (id: string, updates: Partial<LostFoundItem>) => {
    const items = itemStorage.getItems();
    const index = items.findIndex((item) => item.id === id);
    if (index !== -1) {
      items[index] = { ...items[index], ...updates };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      return items[index];
    }
    return null;
  },

  deleteItem: (id: string) => {
    const items = itemStorage.getItems();
    const filtered = items.filter((item) => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  },

  getItemsByStatus: (status: "lost" | "found"): LostFoundItem[] => {
    return itemStorage.getItems().filter((item) => item.status === status);
  },

  getItemsByCategory: (category: string): LostFoundItem[] => {
    return itemStorage.getItems().filter((item) => item.category === category);
  },

  searchItems: (query: string): LostFoundItem[] => {
    const lowerQuery = query.toLowerCase();
    return itemStorage
      .getItems()
      .filter(
        (item) =>
          item.name.toLowerCase().includes(lowerQuery) ||
          item.description.toLowerCase().includes(lowerQuery) ||
          item.location.toLowerCase().includes(lowerQuery),
      );
  },
};

export interface UserProfile {
  name: string;
  email?: string;
  darkMode: boolean;
}

export const profileStorage = {
  getProfile: (): UserProfile => {
    try {
      const data = localStorage.getItem(PROFILE_KEY);
      if (data) {
        return JSON.parse(data);
      }
      return {
        name: "Student",
        email: "",
        darkMode: false,
      };
    } catch {
      return {
        name: "Student",
        email: "",
        darkMode: false,
      };
    }
  },

  updateProfile: (profile: UserProfile) => {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  },
};
