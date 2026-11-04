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

// Polyfill fetch API classes (Request, Response, Headers, FormData)
// These are needed for API calls in tests
// Since Node.js environment doesn't have these by default, we provide minimal mock implementations

// Minimal Headers mock - only implements what we need
class MockHeaders {
  private headers: Record<string, string> = {};
  
  constructor(init?: HeadersInit) {
    if (init && typeof init === 'object') {
      for (const [name, value] of Object.entries(init)) {
        this.headers[name.toLowerCase()] = String(value);
      }
    }
  }
  
  append(name: string, value: string): void {
    this.headers[name.toLowerCase()] = value;
  }
  
  delete(name: string): void {
    delete this.headers[name.toLowerCase()];
  }
  
  get(name: string): string | null {
    return this.headers[name.toLowerCase()] ?? null;
  }
  
  has(name: string): boolean {
    return name.toLowerCase() in this.headers;
  }
  
  set(name: string, value: string): void {
    this.headers[name.toLowerCase()] = value;
  }
}

// Minimal Request mock - only implements what we need
class MockRequest {
  readonly method: string;
  readonly url: string;
  readonly headers: MockHeaders;
  
  constructor(input: string | MockRequest, init?: RequestInit) {
    if (typeof input === 'string') {
      this.url = input;
      this.method = init?.method?.toUpperCase() ?? 'GET';
      this.headers = new MockHeaders(init?.headers as HeadersInit);
    } else {
      this.url = input.url;
      this.method = input.method;
      this.headers = input.headers;
    }
  }
  
  clone(): MockRequest {
    return new MockRequest(this.url, { method: this.method, headers: this.headers as any });
  }
}

// Minimal Response mock - only implements what we need
class MockResponse {
  readonly status: number;
  readonly statusText: string;
  readonly headers: MockHeaders;
  private bodyUsed = false;
  private bodyData: any;
  
  constructor(body?: BodyInit, init?: ResponseInit) {
    this.bodyData = body;
    this.status = init?.status ?? 200;
    this.statusText = init?.statusText ?? 'OK';
    this.headers = new MockHeaders(init?.headers as HeadersInit);
  }
  
  get ok(): boolean {
    return this.status >= 200 && this.status < 300;
  }
  
  get redirected(): boolean {
    return false;
  }
  
  get type(): string {
    return 'basic';
  }
  
  get url(): string {
    return '';
  }
  
  clone(): MockResponse {
    return new MockResponse(this.bodyData, { 
      status: this.status,
      statusText: this.statusText,
      headers: this.headers as any
    });
  }
  
  async json(): Promise<any> {
    if (this.bodyUsed) throw new Error('Body already used');
    this.bodyUsed = true;
    if (typeof this.bodyData === 'string') {
      return JSON.parse(this.bodyData);
    }
    return this.bodyData;
  }
  
  async text(): Promise<string> {
    if (this.bodyUsed) throw new Error('Body already used');
    this.bodyUsed = true;
    if (typeof this.bodyData === 'string') {
      return this.bodyData;
    }
    return JSON.stringify(this.bodyData);
  }
  
  async arrayBuffer(): Promise<ArrayBuffer> {
    throw new Error('Not implemented');
  }
  
  async blob(): Promise<Blob> {
    throw new Error('Not implemented');
  }
  
  async formData(): Promise<FormData> {
    throw new Error('Not implemented');
  }
}

// Minimal FormData mock
class MockFormData {
  private data: Record<string, string | Blob> = {};
  
  append(name: string, value: string | Blob, fileName?: string): void {
    this.data[name] = value;
  }
  
  delete(name: string): void {
    delete this.data[name];
  }
  
  get(name: string): FormDataEntryValue | null {
    return this.data[name] as FormDataEntryValue | null ?? null;
  }
  
  getAll(name: string): FormDataEntryValue[] {
    return [this.data[name] as FormDataEntryValue ?? null].filter(Boolean) as FormDataEntryValue[];
  }
  
  has(name: string): boolean {
    return name in this.data;
  }
  
  set(name: string, value: string | Blob, fileName?: string): void {
    this.data[name] = value;
  }
}

// Assign to global scope
if (typeof globalThis.Request === 'undefined') {
  globalThis.Request = MockRequest as any;
}
if (typeof globalThis.Response === 'undefined') {
  globalThis.Response = MockResponse as any;
}
if (typeof globalThis.Headers === 'undefined') {
  globalThis.Headers = MockHeaders as any;
}
if (typeof globalThis.FormData === 'undefined') {
  globalThis.FormData = MockFormData as any;
}

// Mock import.meta.env for Vite environment variables
// This is needed for files that use import.meta.env.VITE_*
if (typeof (globalThis as any).import === 'undefined') {
  (globalThis as any).import = {};
}
if (typeof (globalThis as any).import.meta === 'undefined') {
  (globalThis as any).import.meta = {};
}
if (typeof (globalThis as any).import.meta.env === 'undefined') {
  (globalThis as any).import.meta.env = {
    VITE_API_BASE_URL: '/api/',
    VITE_MEDIA_BASE_URL: '/media/',
  };
}
