import { useEffect, useState } from 'react';
import { User } from '@/types/models';
import { userService } from '../lib/firebase/services/userService';
import { useAuth } from '@/lib/context/authContext';

export const useUser = () => {
  const { user: authUser, loading } = useAuth();
  const [userData, setUserData] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && authUser) {
      userService.getCurrentUser()
        .then(setUserData)
        .catch((err) => setError(err.message));
    }
  }, [authUser, loading]);

  return {
    user: userData,
    loading: loading || (!userData && !error),
    error
  };
};