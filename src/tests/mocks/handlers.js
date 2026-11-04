// Use CommonJS require for MSW v2 to work with Jest
const { rest } = require('msw');

// Base API URL - matches your backend
const API_BASE_URL = 'http://localhost:8000/api';

// Helper to create paginated responses
const createPaginatedResponse = (results, totalCount, limit, offset) => {
  const hasNext = offset + limit < totalCount;
  const hasPrevious = offset > 0;
  
  return {
    count: totalCount,
    next: hasNext ? `${API_BASE_URL}/reviews/?limit=${limit}&offset=${offset + limit}` : null,
    previous: hasPrevious ? `${API_BASE_URL}/reviews/?limit=${limit}&offset=${Math.max(0, offset - limit)}` : null,
    results,
  };
};

// Mock data generators
const mockReview = (id, overrides = {}) => ({
  id,
  rating: 5 - (id % 5),
  description: `Review ${id}`,
  user: { id: 1, username: 'testuser', picture: null },
  chapter: { id: 1, number: 1, name: 'Chapter 1' },
  is_edited: false,
  likes: 0,
  dislikes: 0,
  my_reaction: null,
  parent: null,
  ...overrides,
});

const mockUser = (id, overrides = {}) => ({
  id,
  username: `user${id}`,
  picture: null,
  ...overrides,
});

const mockChapter = (id, overrides = {}) => ({
  id,
  number: id,
  name: `Chapter ${id}`,
  manga: 1,
  first_published: '2024-01-01',
  average_rating: 4.5,
  count_rating: 10,
  ...overrides,
});

// API endpoint handlers
const handlers = [
  // Auth Endpoints
  rest.get(`${API_BASE_URL}/me/`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        id: 1,
        username: 'testuser',
      })
    );
  }),

  rest.post(`${API_BASE_URL}/auth/login/`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        id: 1,
        username: 'testuser',
      })
    );
  }),

  rest.post(`${API_BASE_URL}/auth/logout/`, (req, res, ctx) => {
    return res(ctx.status(204));
  }),

  // Reviews Endpoints
  rest.get(`${API_BASE_URL}/reviews/`, (req, res, ctx) => {
    const limit = Number(req.url.searchParams.get('limit') || '10');
    const offset = Number(req.url.searchParams.get('offset') || '0');
    const chapter = req.url.searchParams.get('chapter');
    const user = req.url.searchParams.get('user');
    const parent = req.url.searchParams.get('parent');
    
    const allReviews = Array.from({ length: 25 }, (_, i) => mockReview(i + 1));
    
    let filteredReviews = [...allReviews];
    
    if (chapter) {
      filteredReviews = filteredReviews.filter(r => r.chapter?.id === Number(chapter));
    }
    if (user) {
      filteredReviews = filteredReviews.filter(r => r.user.id === Number(user));
    }
    if (parent) {
      filteredReviews = filteredReviews.filter(r => r.parent === Number(parent));
    }
    
    const paginatedResults = filteredReviews.slice(offset, offset + limit);
    
    return res(
      ctx.status(200),
      ctx.json(createPaginatedResponse(paginatedResults, filteredReviews.length, limit, offset))
    );
  }),

  rest.post(`${API_BASE_URL}/reviews/`, (req, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json(mockReview(1, { description: 'New review' }))
    );
  }),

  rest.patch(`${API_BASE_URL}/reviews/:id/`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json(mockReview(Number(req.params.id), { description: 'Updated review' }))
    );
  }),

  rest.delete(`${API_BASE_URL}/reviews/:id/`, (req, res, ctx) => {
    return res(ctx.status(204));
  }),

  // Users Endpoints
  rest.get(`${API_BASE_URL}/users/`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        mockUser(1),
        mockUser(2),
        mockUser(3),
      ])
    );
  }),

  rest.post(`${API_BASE_URL}/users/`, (req, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json(mockUser(1, { username: 'newuser' }))
    );
  }),

  // Chapters Endpoints
  rest.get(`${API_BASE_URL}/chapters/`, (req, res, ctx) => {
    const manga = req.url.searchParams.get('manga');
    
    const allChapters = Array.from({ length: 20 }, (_, i) => mockChapter(i + 1));
    
    let filteredChapters = [...allChapters];
    if (manga) {
      filteredChapters = filteredChapters.filter(c => c.manga === Number(manga));
    }
    
    return res(
      ctx.status(200),
      ctx.json({
        count: filteredChapters.length,
        results: filteredChapters,
      })
    );
  }),

  // Series Endpoints
  rest.get(`${API_BASE_URL}/series/`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        count: 3,
        results: [
          { id: 1, title: 'Series 1', first_published: '2024-01-01', last_published: null, genre: 'shonen', average_rating: 4.5, count_rating: 10 },
          { id: 2, title: 'Series 2', first_published: '2024-02-01', last_published: null, genre: 'seinen', average_rating: 4.0, count_rating: 8 },
          { id: 3, title: 'Series 3', first_published: '2024-03-01', last_published: '2024-04-01', genre: 'shoujo', average_rating: 4.7, count_rating: 15 },
        ],
      })
    );
  }),

  // Profiles Endpoints
  rest.get(`${API_BASE_URL}/profiles/:id/`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        id: Number(req.params.id),
        user: 1,
        bio: 'Test bio',
        mangas: [],
      })
    );
  }),

  rest.patch(`${API_BASE_URL}/profiles/:id/`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        id: Number(req.params.id),
        user: 1,
        bio: 'Updated bio',
        mangas: [],
      })
    );
  }),
];

module.exports = { handlers, mockReview, mockUser, mockChapter, createPaginatedResponse };
