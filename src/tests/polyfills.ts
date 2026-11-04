// Polyfills for Jest environment
// TextEncoder and TextDecoder are needed by react-router-dom
import { TextEncoder, TextDecoder } from 'node:util';

// Add TextEncoder and TextDecoder to global scope for jsdom
// In jsdom environment, we need to add these to the global object
if (typeof globalThis.TextEncoder === 'undefined') {
  globalThis.TextEncoder = TextEncoder as typeof globalThis.TextEncoder;
}
if (typeof globalThis.TextDecoder === 'undefined') {
  globalThis.TextDecoder = TextDecoder as typeof globalThis.TextDecoder;
}

// Mock import.meta.env for Vite environment variables
// This is needed for files that use import.meta.env.VITE_*
if (typeof globalThis.import === 'undefined') {
  globalThis.import = {} as any;
}
if (typeof (globalThis.import as any).meta === 'undefined') {
  (globalThis.import as any).meta = {};
}
if (typeof (globalThis.import as any).meta.env === 'undefined') {
  (globalThis.import as any).meta.env = {
    VITE_API_BASE_URL: '/api/',
    VITE_MEDIA_BASE_URL: '/media/',
  };
}
