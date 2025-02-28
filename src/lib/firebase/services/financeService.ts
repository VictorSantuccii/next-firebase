import { db } from '../config';
import { Finance } from '@/types/models';
import {
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { auth } from '../config';
import { financeHistoryService } from './financeHistoryService';

const financesCollection = collection(db, 'finances');

export const financeService = {
  createOrUpdateFinance: async (financeData: Omit<Finance, 'financeId' | 'lastUpdated'>) => {
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error('Usuário não autenticado');

    const financeDoc = doc(financesCollection, userId);
    const isNew = !(await getDoc(financeDoc)).exists();

    await setDoc(
      financeDoc,
      {
        ...financeData,
        lastUpdated: serverTimestamp(),
      },
      { merge: true }
    );

    if (isNew) {
      await financeHistoryService.createFinanceHistoryEntry({
        financeId: userId,
        userId: userId,
        action: 'finance_created',
        oldValue: null,
        newValue: financeData.currentBalance,
        description: 'Criação do registro financeiro',
      });
    }
  },

  getCurrentUserFinance: async (): Promise<Finance | null> => {
    const userId = auth.currentUser?.uid;
    if (!userId) return null;

    const financeDoc = await getDoc(doc(financesCollection, userId));
    return financeDoc.exists()
      ? ({
          financeId: financeDoc.id,
          ...financeDoc.data(),
        } as Finance)
      : null;
  },

  updateCurrentBalance: async (newBalance: number) => {
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error('Usuário não autenticado');

    const financeDoc = doc(financesCollection, userId);
    const currentData = (await getDoc(financeDoc)).data() as Finance;

    await updateDoc(financeDoc, {
      currentBalance: newBalance,
      totalIncome: newBalance - currentData.totalExpenses,
      lastUpdated: serverTimestamp(),
    });

    await financeHistoryService.createFinanceHistoryEntry({
      financeId: userId,
      userId: userId,
      action: 'balance_update',
      oldValue: currentData.currentBalance,
      newValue: newBalance,
      description: 'Atualização do saldo atual',
    });
  },

  updateTotalExpenses: async (newTotalExpenses: number) => {
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error('Usuário não autenticado');

    const financeDoc = doc(financesCollection, userId);
    const currentData = (await getDoc(financeDoc)).data() as Finance;

    await updateDoc(financeDoc, {
      totalExpenses: newTotalExpenses,
      totalIncome: currentData.currentBalance - newTotalExpenses,
      lastUpdated: serverTimestamp(),
    });

    await financeHistoryService.createFinanceHistoryEntry({
      financeId: userId,
      userId: userId,
      action: 'expense_update',
      oldValue: currentData.totalExpenses,
      newValue: newTotalExpenses,
      description: 'Atualização do total de despesas',
    });
  },

  updateTotalIncome: async (newTotalIncome: number) => {
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error('Usuário não autenticado');

    const financeDoc = doc(financesCollection, userId);
    const currentData = (await getDoc(financeDoc)).data() as Finance;

    await updateDoc(financeDoc, {
      totalIncome: newTotalIncome,
      lastUpdated: serverTimestamp(),
    });

    await financeHistoryService.createFinanceHistoryEntry({
      financeId: userId,
      userId: userId,
      action: 'income_update',
      oldValue: currentData.totalIncome,
      newValue: newTotalIncome,
      description: 'Atualização do total de receitas',
    });
  },
};