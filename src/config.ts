export const config = {
  backendUrl: process.env.NODE_ENV === 'production'
    ? 'https://simplenote-backend-fhzibmri.fly.dev'
    : 'http://localhost:8080'
}
