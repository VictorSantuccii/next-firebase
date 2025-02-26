import { db } from '../config';
import { Category } from '@/types/models';
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';

const categoriesCollection = collection(db, 'categories');

export const categoryService = {
  getCategories: async (): Promise<Category[]> => {
    const snapshot = await getDocs(categoriesCollection);
    return snapshot.docs.map(doc => ({ 
      categoryId: doc.id, 
      ...doc.data() 
    } as Category));
  },

  createCategory: async (categoryData: Omit<Category, 'categoryId' | 'createdAt'>) => {
    const newCategory = await addDoc(categoriesCollection, {
      ...categoryData,
      createdAt: serverTimestamp()
    });
    
    return newCategory.id;
  }
};