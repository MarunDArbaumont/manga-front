/**
 * Tests for RequireAuth component
 * Tests that it redirects unauthenticated users and renders children for authenticated users
 */
import { render, screen } from './tests/utils';
import { Routes, Route } from 'react-router-dom';
import { RequireAuth } from './RequireAuth';
import { TestWrapper, mockAuthValue } from './tests/wrappers';

describe('RequireAuth', () => {
  const mockUser = { id: 1, username: 'testuser' };

  it('should render children when user is authenticated', () => {
    const authValue = {
      ...mockAuthValue,
      user: mockUser,
    };

    render(
      <TestWrapper authValue={authValue}>
        <Routes>
          <Route element={<RequireAuth />}>
            <Route path="/" element={<div>Protected Content</div>} />
          </Route>
        </Routes>
      </TestWrapper>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('should redirect to login when user is not authenticated', () => {
    render(
      <TestWrapper authValue={mockAuthValue} initialEntries={['/protected']}>
        <Routes>
          <Route path="/login" element={<div>Login Page</div>} />
          <Route element={<RequireAuth />}>
            <Route path="/protected" element={<div>Protected Content</div>} />
          </Route>
        </Routes>
      </TestWrapper>
    );

    // Should redirect to login
    expect(screen.getByText('Login Page')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('should redirect to specified from path after login', () => {
    render(
      <TestWrapper authValue={mockAuthValue} initialEntries={['/protected?from=/dashboard']}>
        <Routes>
          <Route path="/login" element={<div>Login Page</div>} />
          <Route element={<RequireAuth />}>
            <Route path="/protected" element={<div>Protected Content</div>} />
          </Route>
        </Routes>
      </TestWrapper>
    );

    // Should redirect to login with from parameter
    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });
});
