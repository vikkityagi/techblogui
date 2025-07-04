export const environment = {
  production: false,
  get apiBaseUrl(): string {
    return this.production
      ? 'https://your-production-domain.com/api' // Production URL
      : 'http://localhost:8080/api';             // Development URL
  }
};
