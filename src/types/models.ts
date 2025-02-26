import { Timestamp } from 'firebase/firestore';

export type Address = {
  street: string;
  number: string;
  city: string;
  state: string;
};

export type User = {
    userId: string;
    name: string;
    email: string;
    phone?: string;
    address?: Address;
    createdAt: Timestamp | Date;
    lastLogin: Timestamp | Date;
    profilePicture?: string;
  };

export type Bill = {
  billId: string;
  userId: string;
  billName: string;
  dueDate: Timestamp;
  amount: number;
  category: string;
  paid: boolean;
  paymentDate?: Timestamp | null;
  description?: string;
  tags?: string[];
  notes?: string[];
};

export type Payment = {
  paymentId: string;
  userId: string;
  billId: string;
  amountPaid: number;
  paymentDate: Timestamp;
  paymentMethod: string;
  paymentStatus: 'Confirmado' | 'Pendente' | 'Cancelado';

};

export type Category = {
  categoryId: string;
  categoryName: string;
  description?: string;
  createdAt: Timestamp;
};

export type HistoryEntry = {
  historyId: string;
  userId: string;
  billId: string;
  action: string;
  oldData: Record<string, any>;
  newData: Record<string, any>;
  timestamp: Timestamp;
};