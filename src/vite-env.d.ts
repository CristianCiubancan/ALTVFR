/// <reference types="vite/client" />

/**
 * Custom Vite environment type declarations
 */

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  readonly VITE_API_URL: string;
  readonly VITE_ALTV_VERSION: string;
  // Add other environment variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

/**
 * Alt:V Window Extension for CEF
 */
interface AltVWindow extends Window {
  alt?: {
    emit: (event: string, ...args: any[]) => void;
    on: (event: string, callback: (...args: any[]) => void) => void;
    off: (event: string, callback: (...args: any[]) => void) => void;
    once: (event: string, callback: (...args: any[]) => void) => void;
  };
}

declare interface Window extends AltVWindow {}