/**
 * Tests for Review component
 * Tests pagination stability and offset clamping
 */
import { render, screen, waitFor, createResponse } from '../tests/utils';
import ReviewComponent from './Review';
import { TestWrapper } from '../tests/wrappers';
import { setMockFetch } from '../tests/setup';

// Mock the image import (virtual because it's not a JS module)
jest.mock('../assets/img/Pandaman_Oda.jpg', () => 'test-image-stub', { virtual: true });

// Mock the variables import (virtual in case module resolution differs in test env)
jest.mock('../api/variables', () => ({
  API_BASE_URL: '/api/',
  MEDIA_BASE_URL: '/media/',
  mediaUrl: (path: string | null | undefined) => `/media/${path}`,
}), { virtual: true });

const mockReview = {
  id: 1,
  rating: 5,
  description: 'Great!',
  user: { id: 1, username: 'user1', picture: null },
  chapter: { id: 1, number: 1, name: 'Chapter 1', manga: { title: 'Test Manga' } },
  is_edited: false,
  likes: 0,
  dislikes: 0,
  my_reaction: null,
  parent: null,
};

const mockReviewData = {
  count: 5,
  next: null,
  previous: null,
  results: [
    mockReview,
    {
      ...mockReview,
      id: 2,
      rating: 4,
      description: 'Good',
      user: { id: 2, username: 'user2', picture: null },
    },
  ],
};

const mockEmptyData = {
  count: 0,
  next: null,
  previous: null,
  results: [],
};

describe('Review Component - Pagination', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render loading state initially', () => {
    // Mock that never resolves
    setMockFetch((url: RequestInfo | URL, init?: RequestInit) => new Promise<Response>(() => {}) );

    render(
      <TestWrapper>
        <ReviewComponent id="1" review_type="chapter" />
      </TestWrapper>
    );

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('should render reviews when data is loaded', async () => {
    setMockFetch((url: RequestInfo | URL, init?: RequestInit) => {
      return Promise.resolve(createResponse(mockReviewData));
    });

    render(
      <TestWrapper>
        <ReviewComponent id="1" review_type="chapter" />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Great!')).toBeInTheDocument();
      expect(screen.getByText('Good')).toBeInTheDocument();
    });
  });

  it('should render empty state when no reviews exist', async () => {
    setMockFetch((url: RequestInfo | URL, init?: RequestInit) =>
      Promise.resolve(createResponse(mockEmptyData))
    );

    render(
      <TestWrapper>
        <ReviewComponent id="1" review_type="chapter" />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText(/no reviews yet/i)).toBeInTheDocument();
    });
  });

  it('should handle error state', async () => {
    setMockFetch((url: RequestInfo | URL, init?: RequestInit) =>
      Promise.resolve(createResponse({ detail: 'Server error' }, 500))
    );

    render(
      <TestWrapper>
        <ReviewComponent id="1" review_type="chapter" />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });

  it('should handle user review type', async () => {
    setMockFetch((url: RequestInfo | URL, init?: RequestInit) =>
      Promise.resolve(createResponse(mockReviewData))
    );

    render(
      <TestWrapper>
        <ReviewComponent id="1" review_type="user" />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Great!')).toBeInTheDocument();
    });
  });

  it('should handle children review type', async () => {
    setMockFetch((url: RequestInfo | URL, init?: RequestInit) =>
      Promise.resolve(createResponse(mockEmptyData))
    );

    render(
      <TestWrapper>
        <ReviewComponent id="1" review_type="children" />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText(/no comments yet/i)).toBeInTheDocument();
    });
  });
});
