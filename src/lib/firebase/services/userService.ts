import { db } from '../config';
import { User, Address } from '../../../types/models';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { auth } from '../config';

const usersCollection = collection(db, 'users');

export const userService = {
  createUser: async (userData: Omit<User, 'userId' | 'createdAt' | 'lastLogin'>) => {
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error('Usuário não autenticado');
    
    const userDoc = doc(usersCollection, userId);
    await setDoc(userDoc, {
      ...userData,
      userId,
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp()
    });
  },

  getCurrentUser: async (): Promise<User | null> => {
    const userId = auth.currentUser?.uid;
    if (!userId) return null;
    
    const userDoc = await getDoc(doc(usersCollection, userId));
    return userDoc.exists() ? (userDoc.data() as User) : null;
  },

  updateCurrentUser: async (updates: Partial<Omit<User, 'userId' | 'createdAt'>>) => {
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error('Usuário não autenticado');
    
    const userDoc = doc(usersCollection, userId);
    await setDoc(userDoc, {
      ...updates,
      lastLogin: serverTimestamp()
    }, { merge: true });
  },

  updateAddress: async (address: Address) => {
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error('Usuário não autenticado');
    
    const userDoc = doc(usersCollection, userId);
    await setDoc(userDoc, { 
      address,
      lastLogin: serverTimestamp()
    }, { merge: true });
  }
};