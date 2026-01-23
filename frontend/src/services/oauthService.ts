const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const GOOGLE_REDIRECT_URI = import.meta.env.VITE_GOOGLE_REDIRECT_URI;

const oauthService = {
  // Google OAuth
  google: {
    // Generate Google OAuth URL
    getAuthUrl(): string {
      const params = new URLSearchParams({
        client_id: GOOGLE_CLIENT_ID,
        redirect_uri: GOOGLE_REDIRECT_URI,
        response_type: 'code',
        scope: 'openid email profile',
        access_type: 'offline',
        prompt: 'consent',
      });
      return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
    },

    // Redirect ke Google login
    redirectToGoogle(): void {
      window.location.href = this.getAuthUrl();
    },

  },

  // Facebook OAuth (jika diperlukan di masa depan)
  facebook: {
    getAuthUrl(): string {
      // Implement Facebook OAuth URL jika diperlukan
      return '';
    },

    redirectToFacebook(): void {
      // Implement Facebook redirect
    },
  },
};

export default oauthService;