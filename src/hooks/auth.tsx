import { useRouter } from 'next/router';
import React, {
  createContext,
  useCallback,
  useState,
  useContext,
  useEffect,
} from 'react';
import api from '../services/api';

interface User {
  id: string;
  name: string;
  email: string;
  is_admin: boolean;
}
interface AuthState {
  token: string;
  user: User;
}
interface SignInCredentials {
  email: string;
  password: string;
}
interface AuthContextData {
  user: User;
  signIn(credentials: SignInCredentials): Promise<void>;
  signOut(): void;
  updateUser(user: User): void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const AuthProvider: React.FC = ({ children }) => {
  const [data, setData] = useState<AuthState>({} as AuthState);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('@TodoList:token');
    const user = localStorage.getItem('@TodoList:user');

    if (token && user) {
      api.defaults.headers.authorization = `Bearer ${token}`;
      setData({ token, user: JSON.parse(user) });
    }

    setIsLoading(false);
  }, [router]);

  const signIn = useCallback(async ({ email, password }) => {
    const response = await api.post('sessions', {
      email,
      password,
    });

    const { token, user } = response.data;
    localStorage.setItem('@TodoList:token', token);
    localStorage.setItem('@TodoList:user', JSON.stringify(user));

    api.defaults.headers.authorization = `Bearer ${token}`;

    setData({ token, user });
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem('@TodoList:token');
    localStorage.removeItem('@TodoList:user');

    setData({} as AuthState);
  }, []);

  const updateUser = useCallback(
    (user: User) => {
      localStorage.setItem('@TodoList:user', JSON.stringify(user));

      setData({
        token: data.token,
        user,
      });
    },
    [data],
  );

  return (
    <AuthContext.Provider
      value={{ user: data.user, signIn, signOut, updateUser, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  return context;
}

export { AuthProvider, useAuth };
