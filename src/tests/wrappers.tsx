/**
 * Test wrappers for providing context to components
 */
import { ReactNode } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { AuthContext, AuthContextValue } from '../context/useAuth';

// Default mock auth value
export const mockAuthValue: AuthContextValue = {
  user: null,
  loading: false,
  login: jest.fn().mockResolvedValue(undefined),
  logout: jest.fn().mockResolvedValue(undefined),
  refresh: jest.fn().mockResolvedValue(undefined),
};

// AuthProvider wrapper for tests
export const AuthProviderWrapper = ({
  children,
  value = mockAuthValue,
}: {
  children: ReactNode;
  value?: AuthContextValue;
}) => {
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Router wrapper for tests
export const RouterWrapper = ({
  children,
  initialEntries = ['/'],
}: {
  children: ReactNode;
  initialEntries?: string[];
}) => {
  return (
    <MemoryRouter initialEntries={initialEntries}>
      {children}
    </MemoryRouter>
  );
};

// Combined wrapper
export const TestWrapper = ({
  children,
  authValue = mockAuthValue,
  initialEntries = ['/'],
}: {
  children: ReactNode;
  authValue?: AuthContextValue;
  initialEntries?: string[];
}) => {
  return (
    <MemoryRouter initialEntries={initialEntries}>
      <AuthContext.Provider value={authValue}>
        {children}
      </AuthContext.Provider>
    </MemoryRouter>
  );
};
