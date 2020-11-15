import * as React from 'react';

type AuthProviderProps = {
  children: React.ReactNode;
};

type Context = {
  isAuth: boolean;
  logout: () => void;
  login: (token: string) => void;
};

export const AuthContext = React.createContext<Context | undefined>(undefined);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = React.useState(() => localStorage.getItem('user'));
  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };
  const login = (token: string) => {
    localStorage.setItem('user', token);
    setUser(token);
  };
  return (
    <AuthContext.Provider value={{ isAuth: Boolean(user), logout, login }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = (): Context => {
  const ctx = React.useContext(AuthContext);
  if (ctx === undefined) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return ctx;
};
