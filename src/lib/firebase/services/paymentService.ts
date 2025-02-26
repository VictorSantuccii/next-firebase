import { db, auth } from '../config';
import { Payment } from '@/types/models';
import { collection, addDoc, getDocs, query, where, serverTimestamp } from 'firebase/firestore';

const paymentsCollection = collection(db, 'payments');

export const paymentService = {
  createPayment: async (paymentData: Omit<Payment, 'paymentId' | 'paymentDate'>) => {
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error('Usuário não autenticado');

    const newPayment = await addDoc(paymentsCollection, {
      ...paymentData,
      userId,
      paymentDate: serverTimestamp()
    });
    
    return newPayment.id;
  },

  getUserPayments: async (): Promise<Payment[]> => {
    const userId = auth.currentUser?.uid;
    if (!userId) return [];
    
    const q = query(paymentsCollection, where('userId', '==', userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ 
      paymentId: doc.id, 
      ...doc.data() 
    } as Payment));
  }
};