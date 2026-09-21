/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_USE_MOCK?: string;
  readonly VITE_API_URL?: string;
  readonly VITE_API_TOKEN?: string;
  readonly VITE_API_AUTH_MODE?: 'bearer' | 'x-api-key' | 'query';
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
