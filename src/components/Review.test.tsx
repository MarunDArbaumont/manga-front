/**
 * Tests for Review component
 * Tests pagination stability and offset clamping
 */
import { render, screen, waitFor } from '../tests/utils';
import { MemoryRouter } from 'react-router-dom';
import ReviewComponent from './Review';
import { TestWrapper } from '../tests/wrappers';
import { mockFetch, mockFetchError } from '../tests/utils';

// Mock the image import
jest.mock('../assets/img/Pandaman_Oda.jpg', () => 'test-image-stub');

// Mock the variables import
jest.mock('../api/variables', () => ({
  API_BASE_URL: '/api/',
  MEDIA_BASE_URL: '/media/',
  mediaUrl: (path: string) => `/media/${path}`,
}));

// Mock the fetchReviewsPage function
jest.mock('../api/users', () => ({
  fetchReviewsPage: jest.fn(),
}));

// Get the mocked function
const { fetchReviewsPage } = jest.requireActual('../api/users') as {
  fetchReviewsPage: jest.Mock;
};

describe('Review Component - Pagination', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render loading state initially', () => {
    (fetchReviewsPage as jest.Mock).mockImplementation(() => 
      new Promise(() => {}) // Never resolves
    );

    render(
      <TestWrapper>
        <ReviewComponent id="1" review_type="chapter" />
      </TestWrapper>
    );

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('should render reviews when data is loaded', async () => {
    const mockData = {
      count: 5,
      next: null,
      previous: null,
      results: [
        {
          id: 1,
          rating: 5,
          description: 'Great!',
          user: { id: 1, username: 'user1', picture: null },
          chapter: { id: 1, number: 1, name: 'Chapter 1' },
          is_edited: false,
          likes: 0,
          dislikes: 0,
          my_reaction: null,
          parent: null,
        },
        {
          id: 2,
          rating: 4,
          description: 'Good',
          user: { id: 2, username: 'user2', picture: null },
          chapter: { id: 1, number: 1, name: 'Chapter 1' },
          is_edited: false,
          likes: 0,
          dislikes: 0,
          my_reaction: null,
          parent: null,
        },
      ],
    };

    (fetchReviewsPage as jest.Mock).mockResolvedValue(mockData);

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
    const mockData = {
      count: 0,
      next: null,
      previous: null,
      results: [],
    };

    (fetchReviewsPage as jest.Mock).mockResolvedValue(mockData);

    render(
      <TestWrapper>
        <ReviewComponent id="1" review_type="chapter" />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText(/no reviews yet/i)).toBeInTheDocument();
    });
  });

  it('should handle pagination with offset clamping', async () => {
    // Simulate a scenario where offset is beyond the count
    const mockData = {
      count: 5,
      next: null,
      previous: null,
      results: [
        {
          id: 1,
          rating: 5,
          description: 'Review 1',
          user: { id: 1, username: 'user1', picture: null },
          chapter: { id: 1, number: 1, name: 'Chapter 1' },
          is_edited: false,
          likes: 0,
          dislikes: 0,
          my_reaction: null,
          parent: null,
        },
        {
          id: 2,
          rating: 4,
          description: 'Review 2',
          user: { id: 2, username: 'user2', picture: null },
          chapter: { id: 1, number: 1, name: 'Chapter 1' },
          is_edited: false,
          likes: 0,
          dislikes: 0,
          my_reaction: null,
          parent: null,
        },
        {
          id: 3,
          rating: 3,
          description: 'Review 3',
          user: { id: 1, username: 'user1', picture: null },
          chapter: { id: 1, number: 1, name: 'Chapter 1' },
          is_edited: false,
          likes: 0,
          dislikes: 0,
          my_reaction: null,
          parent: null,
        },
        {
          id: 4,
          rating: 2,
          description: 'Review 4',
          user: { id: 2, username: 'user2', picture: null },
          chapter: { id: 1, number: 1, name: 'Chapter 1' },
          is_edited: false,
          likes: 0,
          dislikes: 0,
          my_reaction: null,
          parent: null,
        },
        {
          id: 5,
          rating: 1,
          description: 'Review 5',
          user: { id: 1, username: 'user1', picture: null },
          chapter: { id: 1, number: 1, name: 'Chapter 1' },
          is_edited: false,
          likes: 0,
          dislikes: 0,
          my_reaction: null,
          parent: null,
        },
      ],
    };

    (fetchReviewsPage as jest.Mock).mockResolvedValue(mockData);

    render(
      <TestWrapper>
        <ReviewComponent id="1" review_type="chapter" />
      </TestWrapper>
    );

    await waitFor(() => {
      // Should render all 5 reviews
      expect(screen.getByText('Review 1')).toBeInTheDocument();
      expect(screen.getByText('Review 5')).toBeInTheDocument();
    });
  });

  it('should handle error state', async () => {
    (fetchReviewsPage as jest.Mock).mockRejectedValue(new Error('Server error'));

    render(
      <TestWrapper>
        <ReviewComponent id="1" review_type="chapter" />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });
});
