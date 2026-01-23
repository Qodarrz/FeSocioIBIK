// Service untuk mengelola token di localStorage
const tokenService = {
  // Set tokens
  setTokens(tokens: { accessToken: string; refreshToken: string }): void {
    localStorage.setItem('token', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);
  },

  // Get access token
  getAccessToken(): string | null {
    return localStorage.getItem('token');
  },

  // Get refresh token
  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  },

  // Clear all tokens
  clearTokens(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
  },

  // Set user data
  setUser(user: any): void {
    localStorage.setItem('user', JSON.stringify(user));
    if (user.role) {
      localStorage.setItem('role', user.role);
    }
  },

  // Get user data
  getUser(): any | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Get user role
  getRole(): string | null {
    return localStorage.getItem('role');
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = this.getAccessToken();
    const user = this.getUser();
    return !!(token && user);
  },

  // Check if token is expired (basic check)
  isTokenExpired(): boolean {
    const token = this.getAccessToken();
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return Date.now() >= payload.exp * 1000;
    } catch {
      return true;
    }
  },
};

export default tokenService;