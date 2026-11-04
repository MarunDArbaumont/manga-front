/**
 * Tests for useApiResource hook
 * Tests loading states, success responses, error handling, and caching
 */
import { renderHook, waitFor, act } from '@testing-library/react';
import { useApiResource } from './useApiResource';

describe('useApiResource', () => {
  it('should return loading state initially', () => {
    const fetcher = jest.fn().mockImplementation(() => 
      new Promise(() => {}) // Never resolves
    );
    
    const { result } = renderHook(() => 
      useApiResource(fetcher)
    );

    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeNull();
    expect(result.current.data).toBeNull();
  });

  it('should return data on successful fetch', async () => {
    const mockData = { results: [{ id: 1, name: 'Test' }], count: 1 };
    const fetcher = jest.fn().mockResolvedValue(mockData);

    const { result } = renderHook(() => 
      useApiResource(fetcher)
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.data).toEqual(mockData);
    });
  });

  it('should return error on failed fetch', async () => {
    const error = new Error('Network error');
    const fetcher = jest.fn().mockRejectedValue(error);

    const { result } = renderHook(() => 
      useApiResource(fetcher)
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(error);
      expect(result.current.data).toBeNull();
    });
  });

  it('should allow refetching', async () => {
    const mockData1 = { results: [{ id: 1 }], count: 1 };
    const mockData2 = { results: [{ id: 2 }], count: 1 };
    
    let callCount = 0;
    const fetcher = jest.fn().mockImplementation(() => {
      callCount++;
      return Promise.resolve(callCount === 1 ? mockData1 : mockData2);
    });

    const { result } = renderHook(() => 
      useApiResource(fetcher)
    );

    await waitFor(() => {
      expect(result.current.data).toEqual(mockData1);
    });

    // Call reload wrapped in act
    await act(async () => {
      result.current.reload();
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.data).toEqual(mockData2);
    });
  });
});
