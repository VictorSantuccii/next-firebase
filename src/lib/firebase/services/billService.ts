import { db, auth } from '../config';
import { Bill, HistoryEntry, Payment } from '@/types/models';
import { 
  collection, addDoc, getDocs, query, where, doc, 
  updateDoc, serverTimestamp, writeBatch, getDoc 
} from 'firebase/firestore';

const billsCollection = collection(db, 'bills');

export const billService = {
  createBill: async (billData: Omit<Bill, 'billId' | 'paid' | 'paymentDate'>) => {
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error('Usuário não autenticado');

    const newBill = await addDoc(billsCollection, {
      ...billData,
      userId,
      paid: false,
      paymentDate: null,
      createdAt: serverTimestamp()
    });
    
    return newBill.id;
  },

  getUserBills: async (): Promise<Bill[]> => {
    const userId = auth.currentUser?.uid;
    if (!userId) return [];
    
    const q = query(billsCollection, where('userId', '==', userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ 
      billId: doc.id, 
      ...doc.data() 
    } as Bill));
  },

  getBillById: async (billId: string): Promise<Bill | null> => {
    const docRef = doc(billsCollection, billId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { 
      billId: docSnap.id, 
      ...docSnap.data() 
    } as Bill : null;
  },

  updateBill: async (billId: string, updates: Partial<Bill>) => {
    const billRef = doc(billsCollection, billId);
    await updateDoc(billRef, updates);
  },

  markAsPaid: async (billId: string, paymentData: Omit<Payment, 'paymentId' | 'userId' | 'billId' | 'paymentDate'>) => {
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error('Usuário não autenticado');

    const batch = writeBatch(db);
    const billRef = doc(billsCollection, billId);
    
    // Atualiza a conta
    batch.update(billRef, {
      paid: true,
      paymentDate: serverTimestamp()
    });

    // Cria o pagamento
    const paymentRef = doc(collection(db, 'payments'));
    batch.set(paymentRef, {
      ...paymentData,
      userId,
      billId,
      paymentDate: serverTimestamp(),
      paymentStatus: 'Confirmado'
    });

    // Cria histórico
    const historyRef = doc(collection(db, 'history'));
    batch.set(historyRef, {
      userId,
      billId,
      action: 'Pagamento confirmado',
      oldData: { paid: false },
      newData: { 
        paid: true, 
        paymentDate: serverTimestamp() 
      },
      timestamp: serverTimestamp()
    });

    await batch.commit();
  }
};