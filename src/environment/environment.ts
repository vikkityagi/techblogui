export const environment = {
  production: true,
  get apiBaseUrl(): string {
    return this.production
      ? 'https://techblogapi-wdus.onrender.com/api' // Production URL
      : 'http://localhost:8080/api';             // Development URL
  }
};
