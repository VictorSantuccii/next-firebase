import { db, auth } from '../config';
import { FinanceHistoryEntry } from '@/types/models';
import { collection, addDoc, query, where, getDocs, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';

const financeHistoryCollection = collection(db, 'financeHistory');

export const financeHistoryService = {
  createFinanceHistoryEntry: async (
    historyData: Omit<FinanceHistoryEntry, 'historyId' | 'timestamp'>
  ) => {
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error('Usuário não autenticado');

    const newEntry = await addDoc(financeHistoryCollection, {
      ...historyData,
      timestamp: serverTimestamp(),
    });

    return newEntry.id;
  },

  getFinanceHistory: async (financeId: string): Promise<FinanceHistoryEntry[]> => {
    const q = query(financeHistoryCollection, where('financeId', '==', financeId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      historyId: doc.id,
      ...doc.data(),
    } as FinanceHistoryEntry));
  },

  getUserFinanceHistory: async (): Promise<FinanceHistoryEntry[]> => {
    const userId = auth.currentUser?.uid;
    if (!userId) return [];

    const q = query(financeHistoryCollection, where('userId', '==', userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      historyId: doc.id,
      ...doc.data(),
    } as FinanceHistoryEntry));
  },

  deleteFinanceHistoryEntry: async (historyId: string) => {
    await deleteDoc(doc(financeHistoryCollection, historyId));
  },
};