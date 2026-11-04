/**
 * Tests for useMutation hook
 * Tests optimistic updates, error handling, and loading states
 */
import { renderHook, waitFor, act } from '@testing-library/react';
import { useMutation, type MutationResult } from './useMutation';

describe('useMutation', () => {
  it('should return initial state', () => {
    const mutationFn = jest.fn().mockResolvedValue({});
    const { result } = renderHook(() => 
      useMutation(mutationFn)
    );

    expect(result.current.pending).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should handle successful mutations', async () => {
    const mockData = { id: 1, name: 'Test' };
    const mutationFn = jest.fn().mockResolvedValue(mockData);

    const { result } = renderHook(() => 
      useMutation(mutationFn)
    );

    let mutationResult: MutationResult<any>;
    await act(async () => {
      mutationResult = await result.current.mutate();
    });
    
    expect(mutationResult!.ok).toBe(true);
    if (mutationResult!.ok) {
      expect(mutationResult!.data).toEqual(mockData);
    }
    expect(result.current.pending).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should handle errors', async () => {
    const error = new Error('Test error');
    const mutationFn = jest.fn().mockRejectedValue(error);

    const { result } = renderHook(() => 
      useMutation(mutationFn)
    );

    let mutationResult: MutationResult<any>;
    await act(async () => {
      mutationResult = await result.current.mutate();
    });
    
    expect(mutationResult!.ok).toBe(false);
    expect(result.current.pending).toBe(false);
    expect(result.current.error).toBe(error);
  });

  it('should reset error', async () => {
    const error = new Error('Test error');
    const mutationFn = jest.fn().mockRejectedValue(error);

    const { result } = renderHook(() => 
      useMutation(mutationFn)
    );

    await act(async () => {
      await result.current.mutate();
    });
    
    expect(result.current.pending).toBe(false);
    expect(result.current.error).toBe(error);

    // Reset error wrapped in act
    await act(async () => {
      result.current.resetError();
    });

    expect(result.current.error).toBeNull();
  });

  it('should clear error on successful mutation after previous error', async () => {
    const error = new Error('Test error');
    const mockData = { id: 1, name: 'Test' };
    
    let shouldFail = true;
    const mutationFn = jest.fn().mockImplementation(() => {
      if (shouldFail) {
        shouldFail = false;
        return Promise.reject(error);
      }
      return Promise.resolve(mockData);
    });

    const { result } = renderHook(() => 
      useMutation(mutationFn)
    );

    // First call fails
    await act(async () => {
      await result.current.mutate();
    });
    expect(result.current.pending).toBe(false);
    expect(result.current.error).toBe(error);

    // Second call succeeds
    let mutationResult: MutationResult<any>;
    await act(async () => {
      mutationResult = await result.current.mutate();
    });
    expect(mutationResult!.ok).toBe(true);
    expect(result.current.pending).toBe(false);
    expect(result.current.error).toBeNull();
  });
});
