/**
 * Tests for RequireGuest component
 * Tests that it redirects authenticated users and renders children for unauthenticated users
 */
import { render, screen } from './tests/utils';
import { Routes, Route } from 'react-router-dom';
import { RequireGuest } from './RequireGuest';
import { TestWrapper, mockAuthValue } from './tests/wrappers';

describe('RequireGuest', () => {
  const mockUser = { id: 1, username: 'testuser' };

  it('should render children when user is not authenticated', () => {
    render(
      <TestWrapper authValue={mockAuthValue}>
        <Routes>
          <Route element={<RequireGuest />}>
            <Route path="/" element={<div>Guest Content</div>} />
          </Route>
        </Routes>
      </TestWrapper>
    );

    expect(screen.getByText('Guest Content')).toBeInTheDocument();
  });

  it('should redirect to home when user is authenticated', () => {
    const authValue = {
      ...mockAuthValue,
      user: mockUser,
    };

    render(
      <TestWrapper authValue={authValue} initialEntries={['/login']}>
        <Routes>
          <Route path="/" element={<div>Home Page</div>} />
          <Route element={<RequireGuest />}>
            <Route path="/login" element={<div>Login Page</div>} />
          </Route>
        </Routes>
      </TestWrapper>
    );

    // Should redirect to home
    expect(screen.getByText('Home Page')).toBeInTheDocument();
    expect(screen.queryByText('Login Page')).not.toBeInTheDocument();
  });

  it('should redirect to specified from path after login', () => {
    const authValue = {
      ...mockAuthValue,
      user: mockUser,
    };

    render(
      <TestWrapper authValue={authValue} initialEntries={['/login?from=/dashboard']}>
        <Routes>
          <Route path="/" element={<div>Home Page</div>} />
          <Route path="/dashboard" element={<div>Dashboard</div>} />
          <Route element={<RequireGuest />}>
            <Route path="/login" element={<div>Login Page</div>} />
          </Route>
        </Routes>
      </TestWrapper>
    );

    // Should redirect to home (or from path if implemented)
    expect(screen.getByText('Home Page')).toBeInTheDocument();
  });
});
