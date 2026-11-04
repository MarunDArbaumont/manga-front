// Polyfills for Jest environment
// TextEncoder and TextDecoder are needed by react-router-dom
import { TextEncoder, TextDecoder } from 'node:util';

// Add TextEncoder and TextDecoder to global scope for jsdom
if (typeof global.TextEncoder === 'undefined') {
  (global as any).TextEncoder = TextEncoder;
}
if (typeof global.TextDecoder === 'undefined') {
  (global as any).TextDecoder = TextDecoder;
}

// Mock import.meta.env for Vite environment variables
if (typeof (global as any).import === 'undefined') {
  (global as any).import = {};
}
if (typeof (global as any).import.meta === 'undefined') {
  (global as any).import.meta = {};
}
if (typeof (global as any).import.meta.env === 'undefined') {
  (global as any).import.meta.env = {
    VITE_API_BASE_URL: '/api/',
    VITE_MEDIA_BASE_URL: '/media/',
  };
}
