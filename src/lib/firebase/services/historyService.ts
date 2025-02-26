import { db, auth } from '../config';
import { HistoryEntry } from '@/types/models';
import { collection, addDoc, query, where, getDocs, serverTimestamp } from 'firebase/firestore';

const historyCollection = collection(db, 'history');

export const historyService = {
  createHistoryEntry: async (historyData: Omit<HistoryEntry, 'historyId' | 'timestamp'>) => {
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error('Usuário não autenticado');

    const newEntry = await addDoc(historyCollection, {
      ...historyData,
      timestamp: serverTimestamp()
    });
    
    return newEntry.id;
  },

  getUserHistory: async (): Promise<HistoryEntry[]> => {
    const userId = auth.currentUser?.uid;
    if (!userId) return [];
    
    const q = query(historyCollection, where('userId', '==', userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ 
      historyId: doc.id, 
      ...doc.data() 
    } as HistoryEntry));
  }
};