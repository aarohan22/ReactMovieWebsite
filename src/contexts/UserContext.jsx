
import { createContext, useState, useEffect } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { loadUserData } from "../firebase/firestoreHelpers";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const extraData = await loadUserData();
        setUser({
          ...currentUser,
          photoURL: extraData.avatarURL || currentUser.photoURL,
          displayName: extraData.displayName || currentUser.displayName,
        });
      } else {
        setUser(null);
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = () => {
    auth.signOut();
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, authLoading, logout }}>
      {children}
    </UserContext.Provider>
  );
};
