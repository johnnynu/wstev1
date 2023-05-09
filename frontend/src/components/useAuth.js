import { useState, useEffect } from 'react';
import { auth } from './firebase'; // Import your Firebase app instance

const useAuth = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setUser(user);
    });

    return unsubscribe;
  }, []);

  return user;
}

export default useAuth;