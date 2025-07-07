import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { auth } from "../firebase";

const db = getFirestore();


export const getUserDocRef = async () => {
  const user = auth.currentUser;
  if (user) return doc(db, "users", user.uid);

  return new Promise((resolve, reject) => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      unsubscribe();
      if (user) resolve(doc(db, "users", user.uid));
      else reject(new Error("User not authenticated"));
    });
  });
};


export const isDisplayNameTaken = async (displayName) => {
  const nameDocRef = doc(db, "displayNames", displayName.toLowerCase());
  const snap = await getDoc(nameDocRef);

  if (snap.exists()) {
    const currentUserId = auth.currentUser?.uid;
    const claimedBy = snap.data().uid;
    return claimedBy !== currentUserId;
  }
  return false;
};


export const saveUserProfileToFirestore = async (displayName, avatarURL) => {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");

  const taken = await isDisplayNameTaken(displayName);
  if (taken) throw new Error("Display name already taken");

  const userDocRef = doc(db, "users", user.uid);
  const nameDocRef = doc(db, "displayNames", displayName.toLowerCase());

  await setDoc(userDocRef, { displayName, avatarURL }, { merge: true });
  await setDoc(nameDocRef, { uid: user.uid }, { merge: true });
};


export const saveFavoritesToFirestore = async (favorites, type = "movies") => {
  try {
    const docRef = await getUserDocRef();
    await setDoc(docRef, { [type]: favorites }, { merge: true });
  } catch (error) {
    console.error("❌ Error saving favorites:", error);
  }
};

export const loadFavoritesFromFirestore = async (type = "movies") => {
  try {
    const docRef = await getUserDocRef();
    const snap = await getDoc(docRef);
    return snap.exists() ? (snap.data()[type] || []) : [];
  } catch (error) {
    console.error("❌ Error loading favorites:", error);
    return [];
  }
};


export const loadFavoriteGenres = async () => {
  try {
    const docRef = await getUserDocRef();
    const snap = await getDoc(docRef);
    return snap.exists() ? (snap.data().favoriteGenres || []) : [];
  } catch (error) {
    console.error("❌ Error loading genres:", error);
    return [];
  }
};

export const saveFavoriteGenres = async (genres) => {
  try {
    const docRef = await getUserDocRef();
    await setDoc(docRef, { favoriteGenres: genres }, { merge: true });
  } catch (error) {
    console.error("❌ Error saving genres:", error);
  }
};


export const loadUserData = async () => {
  const docRef = await getUserDocRef();
  const snap = await getDoc(docRef);
  return snap.exists() ? snap.data() : {};
};


export const saveWatchlist = async (ids, type = "movies") => {
  try {
    const docRef = await getUserDocRef();
    const numericIds = ids.map(id => Number(id));
    await setDoc(docRef, { [`watchlist_${type}`]: numericIds }, { merge: true });
  } catch (e) {
    console.error("❌ Error saving watchlist", e);
  }
};

export const loadWatchlist = async (type = "movies") => {
  try {
    const docRef = await getUserDocRef();
    const snap = await getDoc(docRef);
    if (!snap.exists()) return [];
    const data = snap.data()[`watchlist_${type}`] || [];
    return data.map(id => Number(id));
  } catch (e) {
    console.error("❌ Error loading watchlist", e);
    return [];
  }
};
