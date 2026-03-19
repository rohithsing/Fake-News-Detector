/// <reference types="vite/client" />

interface ImportMetaEnv {
  // No client-side env vars needed — API key lives in the Netlify function
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
