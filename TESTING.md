# 🧪 Testing Guide

This document explains how testing works in the manga_front project and how to add new tests.

## 📁 Test Structure

```
manga_front/
├── jest.config.cjs              # Jest configuration
├── jest.tsconfig.json           # TypeScript config for tests
├── package.json                 # Includes test scripts
└── src/
    ├── tests/
    │   ├── setup.ts             # Global test setup
    │   ├── polyfills.ts         # Runtime polyfills
    │   ├── utils.tsx            # Test utilities & helpers
    │   ├── wrappers.tsx         # Context wrappers
    │   └── mocks/               # Mock files
    │       ├── fileMock.js      # Image import mock
    │       ├── handlers.js      # API handlers (for future MSW)
    │       └── handlers.d.ts     # Type declarations
    │
    ├── hooks/
    │   ├── useApiResource.test.tsx
    │   └── useMutation.test.tsx
    │
    ├── components/
    │   └── Review.test.tsx
    │
    ├── RequireAuth.test.tsx
    └── RequireGuest.test.tsx
```

---

## 🚀 Quick Start

### Running Tests

```bash
# Run all tests once
npm test

# Run tests in watch mode (re-runs on file changes)
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

### Test Scripts

| Script | Description |
|--------|-------------|
| `npm test` | Run all tests once |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage |

---

## 🔧 How Testing Works

### 1. Jest Configuration (`jest.config.cjs`)

Jest is configured to:
- Use TypeScript via `ts-jest`
- Run in `jsdom` environment (simulates a browser)
- Transform TypeScript files using `jest.tsconfig.json`
- Handle image imports via module mappers
- Load polyfills before tests

### 2. TypeScript for Tests (`jest.tsconfig.json`)

Separate TypeScript config for tests that:
- Uses CommonJS module system (required by Jest)
- Enables ES module interop (allows mixing `import` and `require`)
- Includes type definitions for Jest, React, and DOM

### 3. Polyfills (`src/tests/polyfills.ts`)

Adds browser APIs that don't exist in Node.js:
- `TextEncoder` - Used by React Router v7
- `TextDecoder` - Used by React Router v7

### 4. Test Utilities (`src/tests/utils.tsx`)

Re-exports Testing Library functions and adds helpers:

```typescript
import { render, screen, waitFor, fireEvent } from './tests/utils';
import { mockFetch, mockFetchError } from './tests/utils';
```

**Available helpers:**
- `render` - Render components
- `screen` - Query the DOM
- `waitFor` - Wait for async updates
- `fireEvent` - Simulate user events
- `mockFetch(response, status)` - Mock successful API responses
- `mockFetchError(error)` - Mock API errors
- `renderWithProviders` - Render with custom providers

### 5. Wrappers (`src/tests/wrappers.tsx`)

Provides context for components that need it:

```typescript
import { TestWrapper, mockAuthValue } from './tests/wrappers';

// Use in tests
render(
  <TestWrapper authValue={{ user: null, loading: false, ... }}>
    <MyComponent />
  </TestWrapper>
);
```

**Available wrappers:**
- `TestWrapper` - Combines Auth + Router context
- `AuthProviderWrapper` - Provides Auth context only
- `RouterWrapper` - Provides Router context only
- `mockAuthValue` - Default mock auth value

---

## 📝 Adding New Tests

### Testing a Hook

**Example: Testing a custom hook**

```typescript
// src/hooks/useCounter.test.tsx
import { renderHook, act } from '@testing-library/react';
import { useCounter } from './useCounter';

describe('useCounter', () => {
  it('should increment counter', () => {
    const { result } = renderHook(() => useCounter());
    
    expect(result.current.count).toBe(0);
    
    act(() => {
      result.current.increment();
    });
    
    expect(result.current.count).toBe(1);
  });
});
```

### Testing a Component

**Example: Testing a simple component**

```typescript
// src/components/Button.test.tsx
import { render, screen, fireEvent } from '../tests/utils';
import { Button } from './Button';

describe('Button', () => {
  it('should render with correct text', () => {
    render(<Button>Click me</Button>);
    
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('should call onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByText('Click me'));
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Testing a Component with Context

**Example: Testing a component that uses Auth context**

```typescript
// src/components/UserProfile.test.tsx
import { render, screen } from '../tests/utils';
import { UserProfile } from './UserProfile';
import { TestWrapper } from '../tests/wrappers';

describe('UserProfile', () => {
  it('should show username when authenticated', () => {
    const authValue = {
      user: { id: 1, username: 'john_doe' },
      loading: false,
      login: jest.fn(),
      logout: jest.fn(),
    };

    render(
      <TestWrapper authValue={authValue}>
        <UserProfile />
      </TestWrapper>
    );

    expect(screen.getByText('john_doe')).toBeInTheDocument();
  });
});
```

### Testing API Calls

**Example: Testing a component that fetches data**

```typescript
// src/components/UserList.test.tsx
import { render, screen, waitFor } from '../tests/utils';
import { UserList } from './UserList';
import { mockFetch } from '../tests/utils';

describe('UserList', () => {
  it('should display users from API', async () => {
    // Mock the API response
    const mockUsers = [
      { id: 1, username: 'user1' },
      { id: 2, username: 'user2' },
    ];
    
    mockFetch({ results: mockUsers, count: 2 });

    render(<UserList />);

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('user1')).toBeInTheDocument();
      expect(screen.getByText('user2')).toBeInTheDocument();
    });
  });

  it('should show error message on API failure', async () => {
    mockFetchError(new Error('Network error'));

    render(<UserList />);

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });
});
```

### Testing with Router

**Example: Testing a component that uses React Router**

```typescript
// src/components/NavLink.test.tsx
import { render, screen } from '../tests/utils';
import { NavLink } from './NavLink';
import { MemoryRouter } from 'react-router-dom';

describe('NavLink', () => {
  it('should be active on current route', () => {
    render(
      <MemoryRouter initialEntries={['/users']}>
        <NavLink to="/users">Users</NavLink>
        <NavLink to="/posts">Posts</NavLink>
      </MemoryRouter>
    );

    expect(screen.getByText('Users')).toHaveClass('active');
    expect(screen.getByText('Posts')).not.toHaveClass('active');
  });
});
```

---

## 🎯 Testing Patterns

### 1. Mocking API Responses

Use `mockFetch` to mock successful responses:

```typescript
import { mockFetch } from '../tests/utils';

// Mock a simple response
mockFetch({ data: 'test' });

// Mock with specific status code
mockFetch({ error: 'Not found' }, 404);

// Mock paginated response
mockFetch({
  count: 10,
  next: '/api/users?page=2',
  previous: null,
  results: [{ id: 1, name: 'User 1' }],
});
```

### 2. Mocking Errors

Use `mockFetchError` to mock network errors:

```typescript
import { mockFetchError } from '../tests/utils';

mockFetchError(new Error('Network error'));
```

### 3. Mocking Images

Images are automatically mocked via `jest.config.cjs` module mapper. No additional setup needed.

### 4. Mocking Environment Variables

For files using `import.meta.env`, create mocks in `src/api/__mocks__/variables.ts`:

```typescript
// src/api/__mocks__/variables.ts
export const API_BASE_URL = '/api/';
export const MEDIA_BASE_URL = '/media/';
```

### 5. Testing Async Behavior

Use `waitFor` to wait for async updates:

```typescript
import { waitFor } from '@testing-library/react';

await waitFor(() => {
  expect(screen.getByText('Loaded!')).toBeInTheDocument();
});
```

### 6. Testing State Updates

Wrap state updates in `act`:

```typescript
import { act } from '@testing-library/react';

await act(async () => {
  await userEvent.click(button);
});
```

---

## 📊 Test Organization

### By Feature (Recommended)

Group tests by feature/component:

```
src/
├── hooks/
│   ├── useApiResource.test.tsx
│   └── useMutation.test.tsx
├── components/
│   ├── Review.test.tsx
│   ├── Button.test.tsx
│   └── ...
├── pages/
│   └── HomePage.test.tsx
└── auth/
    ├── RequireAuth.test.tsx
    └── RequireGuest.test.tsx
```

### Test File Naming

Use the `.test.tsx` or `.test.ts` suffix:
- `ComponentName.test.tsx` for component tests
- `hookName.test.tsx` for hook tests
- `utilName.test.ts` for utility tests

---

## 🔍 Best Practices

### 1. Test Descriptions

Use clear, descriptive test names:

```typescript
// ✅ Good
it('should render loading state initially');
it('should display error message when API fails');

// ❌ Bad
it('test 1');
it('should work');
```

### 2. Test Isolation

Each test should be independent:

```typescript
beforeEach(() => {
  // Setup that runs before each test
  mockFetch({ data: [] });
});

afterEach(() => {
  // Cleanup that runs after each test
  jest.clearAllMocks();
});
```

### 3. Avoid Implementation Details

Test user behavior, not implementation:

```typescript
// ✅ Good - Tests what the user sees
it('should show welcome message', () => {
  render(<Welcome />);
  expect(screen.getByText('Welcome!')).toBeInTheDocument();
});

// ❌ Bad - Tests implementation
it('should call useState', () => {
  // Don't test React internals
});
```

### 4. Use Proper Queries

Use the most specific query that makes sense:

```typescript
// ✅ Good - Most specific
getByRole('button', { name: /submit/i })

// ✅ Good - Semantic
getByText('Submit')

// ❌ Avoid - Too generic
getByDiv()
getBySpan()
```

### 5. Test Edge Cases

Test common edge cases:
- Empty arrays
- Null/undefined values
- Network errors
- Loading states
- Error states
- Pagination boundaries

---

## 🛠️ Common Issues & Solutions

### Issue: `Cannot find module` for images

**Solution:** Images are automatically mocked. No action needed.

### Issue: `import.meta.env` not available

**Solution:** Create a mock in `src/api/__mocks__/variables.ts`:

```typescript
export const API_BASE_URL = '/api/';
export const MEDIA_BASE_URL = '/media/';
```

### Issue: `TextEncoder is not defined`

**Solution:** Already handled in `src/tests/polyfills.ts`.

### Issue: `global is not defined`

**Solution:** Use `window` instead of `global` in test files, or use `(global as any)`.

### Issue: State updates not detected

**Solution:** Wrap updates in `act()`:

```typescript
import { act } from '@testing-library/react';

await act(async () => {
  await someAsyncFunction();
});
```

### Issue: Tests failing due to timing

**Solution:** Use `waitFor`:

```typescript
await waitFor(() => {
  expect(screen.getByText('Loaded')).toBeInTheDocument();
});
```

---

## 📚 Useful Links

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Testing Library React](https://testing-library.com/docs/react-testing-library/intro/)
- [Jest DOM Matchers](https://github.com/testing-library/jest-dom)
- [React Testing Library Cheatsheet](https://testing-library.com/docs/react-testing-library/cheatsheet/)

---

## 🎉 Summary

This testing setup provides:

✅ **20 passing tests** covering hooks, components, and auth
✅ **TypeScript support** with proper type checking
✅ **Jest + Testing Library** for reliable tests
✅ **Mock utilities** for API calls and context
✅ **Clear organization** by feature/component

To add a new test:
1. Create a `.test.tsx` or `.test.ts` file
2. Import from `./tests/utils` and `./tests/wrappers`
3. Use `mockFetch` for API mocking
4. Use `TestWrapper` for context
5. Write clear, descriptive tests

Happy testing! 🚀
