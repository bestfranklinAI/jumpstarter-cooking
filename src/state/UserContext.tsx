// src/state/UserContext.tsx
import { createContext, useContext, ReactNode, useState } from 'react';
import type { User } from '../types';

interface UserContextType {
  user: User | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user] = useState<User | null>({
    userId: 'user-1',
    name: 'Franklin',
    email: 'franklin@example.com',
  });

  return (
    <UserContext.Provider value={{ user }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
