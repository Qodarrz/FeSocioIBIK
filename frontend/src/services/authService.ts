import api from "./apiService";

// TYPES
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  isVerified: boolean;
  photo?: string;
  phone?: string;
  dateOfBirth?: string | null;
  placeOfBirth?: string | null;
  address?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: User;
    tokens: Tokens;
  };
  user?: User; // For backward compatibility
  token?: string; // For backward compatibility
}

// Request types
export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  dateOfBirth?: string;
  placeOfBirth?: string;
  address?: string;
}

// SERVICE
const authService = {
  // LOGIN
  async login(email: string, password: string): Promise<AuthResponse> {
    const res = await api.post("/auth/login", { email, password });
    return res.data;
  },

  // REGISTER
  async register(data: RegisterData): Promise<AuthResponse> {
    const res = await api.post("/auth/register", data);
    return res.data;
  },

  // VERIFY OTP
  async verifyOTP(email: string, otp: string): Promise<AuthResponse> {
    const res = await api.post("/auth/verify-otp", { email, otp });
    return res.data;
  },

  // RESEND OTP
  async resendOTP(email: string): Promise<AuthResponse> {
    const res = await api.post("/auth/resend-otp", { email });
    return res.data;
  },

  // FORGOT PASSWORD
  async forgotPassword(email: string): Promise<AuthResponse> {
    const res = await api.post("/auth/forgot-password", { email });
    return res.data;
  },

  // REFRESH TOKEN
  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    const res = await api.post("/auth/refresh-token", { refreshToken });
    return res.data;
  },

  // LOGOUT
  async logout(): Promise<AuthResponse> {
    const res = await api.post("/auth/logout");
    return res.data;
  },

  // GET CURRENT USER
  async getCurrentUser(): Promise<User | null> {
    try {
      const res = await api.get("/auth/me");
      return res.data.user;
    } catch {
      return null;
    }
  },

  // UPDATE PROFILE
  async updateProfile(data: Partial<User>): Promise<AuthResponse> {
    const res = await api.put("/auth/profile", data);
    return res.data;
  },

  // CHANGE PASSWORD
  async changePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<AuthResponse> {
    const res = await api.post("/auth/change-password", {
      currentPassword,
      newPassword,
    });
    return res.data;
  },
};

export default authService;