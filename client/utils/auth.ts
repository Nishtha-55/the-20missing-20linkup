export interface User {
  id: string;
  email: string;
  name: string;
  password: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}

const AUTH_KEY = "lostAndFoundAuth";
const USERS_KEY = "lostAndFoundUsers";

export const authUtils = {
  // Get current authenticated user
  getCurrentUser: (): User | null => {
    try {
      const auth = localStorage.getItem(AUTH_KEY);
      return auth ? JSON.parse(auth) : null;
    } catch {
      return null;
    }
  },

  // Get all registered users
  getAllUsers: (): User[] => {
    try {
      const users = localStorage.getItem(USERS_KEY);
      return users ? JSON.parse(users) : [];
    } catch {
      return [];
    }
  },

  // Sign up new user
  signup: (email: string, name: string, password: string): { success: boolean; error?: string } => {
    if (!email || !name || !password) {
      return { success: false, error: "All fields are required" };
    }

    if (password.length < 6) {
      return { success: false, error: "Password must be at least 6 characters" };
    }

    const users = authUtils.getAllUsers();
    
    if (users.some((u) => u.email === email)) {
      return { success: false, error: "Email already registered" };
    }

    const newUser: User = {
      id: Date.now().toString(),
      email,
      name,
      password, // In production, this should be hashed
    };

    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    
    // Auto-login after signup
    localStorage.setItem(AUTH_KEY, JSON.stringify(newUser));
    
    return { success: true };
  },

  // Login user
  login: (email: string, password: string): { success: boolean; error?: string } => {
    if (!email || !password) {
      return { success: false, error: "Email and password are required" };
    }

    const users = authUtils.getAllUsers();
    const user = users.find((u) => u.email === email && u.password === password);

    if (!user) {
      return { success: false, error: "Invalid email or password" };
    }

    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    return { success: true };
  },

  // Logout user
  logout: () => {
    localStorage.removeItem(AUTH_KEY);
  },

  // Check if email exists (for forgot password)
  emailExists: (email: string): boolean => {
    const users = authUtils.getAllUsers();
    return users.some((u) => u.email === email);
  },

  // Reset password
  resetPassword: (email: string, newPassword: string): { success: boolean; error?: string } => {
    if (!email || !newPassword) {
      return { success: false, error: "Email and new password are required" };
    }

    if (newPassword.length < 6) {
      return { success: false, error: "Password must be at least 6 characters" };
    }

    const users = authUtils.getAllUsers();
    const userIndex = users.findIndex((u) => u.email === email);

    if (userIndex === -1) {
      return { success: false, error: "Email not found" };
    }

    users[userIndex].password = newPassword;
    localStorage.setItem(USERS_KEY, JSON.stringify(users));

    return { success: true };
  },

  // Update user profile
  updateProfile: (userId: string, updates: Partial<User>): boolean => {
    const users = authUtils.getAllUsers();
    const userIndex = users.findIndex((u) => u.id === userId);

    if (userIndex === -1) {
      return false;
    }

    users[userIndex] = { ...users[userIndex], ...updates };
    localStorage.setItem(USERS_KEY, JSON.stringify(users));

    // Update current session if it's the logged-in user
    const currentUser = authUtils.getCurrentUser();
    if (currentUser?.id === userId) {
      localStorage.setItem(AUTH_KEY, JSON.stringify(users[userIndex]));
    }

    return true;
  },
};
