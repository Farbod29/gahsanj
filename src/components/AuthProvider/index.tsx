'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import SignInModal from '../SignInModal';

interface AuthContextType {
  showSignInModal: () => void;
}

const AuthContext = createContext<AuthContextType>({
  showSignInModal: () => {},
});

export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      setIsModalOpen(true);
    }
  }, [status]);

  const showSignInModal = () => {
    setIsModalOpen(true);
  };

  return (
    <AuthContext.Provider value={{ showSignInModal }}>
      {children}
      <SignInModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </AuthContext.Provider>
  );
}
