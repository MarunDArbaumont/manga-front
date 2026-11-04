import { render, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';

// Wrapper for rendering components with providers if needed
export const renderWithProviders = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => {
  return render(ui, { ...options });
};

// Re-export everything from testing-library
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';

// Helper to create a Response object
export const createResponse = (data: any, status = 200, headers: HeadersInit = {}) => {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  });
};

// Helper to create an error response
export const createErrorResponse = (message: string, status = 400) => {
  return new Response(JSON.stringify({ detail: message }), {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

// Helper to mock fetch with MSW-like handlers
export const mockFetchWithHandlers = (handlers: Array<{
  method?: string;
  path: string;
  resolver: (req: Request) => Promise<Response> | Response;
}>) => {
  globalThis.fetch = jest.fn(async (url: RequestInfo, init?: RequestInit) => {
    const request = new Request(url, init);
    const urlString = url.toString();
    const method = request.method || 'GET';
    
    // Find matching handler
    for (const handler of handlers) {
      const handlerMethod = handler.method?.toUpperCase() || 'GET';
      const handlerPath = handler.path;
      
      // Simple path matching (supports :param syntax)
      const pathRegex = new RegExp(
        handlerPath
          .replace(/\/:\w+/g, '/[^/]+')
          .replace(/\/\*/g, '/.*')
          .replace(/\?/g, '\\?')
      );
      
      if (handlerMethod === method && pathRegex.test(urlString)) {
        try {
          const response = await handler.resolver(request);
          return response;
        } catch (e) {
          console.error('Handler error:', e);
          throw e;
        }
      }
    }
    
    // If no handler matched, throw an error (fail the test)
    throw new Error(`Unhandled request: ${method} ${urlString}`);
  });
};

// Helper to mock fetch with a simple response
export const mockFetch = (response: any, status = 200) => {
  globalThis.fetch = jest.fn(() =>
    Promise.resolve({
      ok: status >= 200 && status < 300,
      status,
      json: () => Promise.resolve(response),
      headers: new Headers(),
      redirected: false,
      statusText: status >= 200 && status < 300 ? 'OK' : 'Error',
      type: 'basic' as const,
      url: '',
      clone: () => ({}),
      text: () => Promise.resolve(JSON.stringify(response)),
    })
  );
};

// Helper to mock fetch with error
export const mockFetchError = (error: Error) => {
  globalThis.fetch = jest.fn(() => Promise.reject(error));
};
