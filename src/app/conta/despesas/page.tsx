'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { auth } from '@/lib/firebase/config';
import { billService } from '@/lib/firebase/services/billService';
import { useAuth } from '@/lib/context/authContext';
import { Timestamp } from 'firebase/firestore';
import { Bill } from '@/types/models';

export default function DespesasPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  
  const [bills, setBills] = useState<Bill[]>([]);
  const [formData, setFormData] = useState({
    billName: '',
    dueDate: '',
    amount: 0,
    category: 'Outros',
    description: '',
    tags: [] as string[],
  });
  const [error, setError] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [editBillId, setEditBillId] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('Dinheiro');

  useEffect(() => {
    if (!loading && !user) router.push('/login');
    if (user) loadBills();
  }, [user, loading]);

  const loadBills = async () => {
    try {
      const userBills = await billService.getUserBills();
      setBills(userBills.filter(bill => !bill.paid));
    } catch (err) {
      setError('Erro ao carregar despesas');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const today = new Date();
    const selectedDate = new Date(formData.dueDate);
    
    if (selectedDate < today) {
      setError('A data de vencimento não pode ser anterior à data atual');
      return;
    }

    if (formData.amount < 1) {
      setError('O valor mínimo é R$ 1,00');
      return;
    }

    try {
      if (editBillId) {
        await billService.updateBill(editBillId, {
          ...formData,
          dueDate: Timestamp.fromDate(new Date(formData.dueDate)),
          amount: Number(formData.amount),
        });
        setEditBillId(null);
      } else {
        await billService.createBill({
          ...formData,
          userId: auth.currentUser?.uid || '',
          dueDate: Timestamp.fromDate(new Date(formData.dueDate)),
          amount: Number(formData.amount),
        });
      }
      
      setFormData({
        billName: '',
        dueDate: '',
        amount: 0,
        category: 'Outros',
        description: '',
        tags: [],
      });
      await loadBills();
    } catch (err) {
      setError('Erro ao salvar despesa');
    }
  };

  const addTag = () => {
    if (tagInput && !formData.tags.includes(tagInput)) {
      setFormData({ ...formData, tags: [...formData.tags, tagInput] });
      setTagInput('');
    }
  };

  const handleMarkAsPaid = async (billId: string) => {
    try {
      await billService.markAsPaid(billId, {
        amountPaid: bills.find(b => b.billId === billId)?.amount || 0,
        paymentMethod: paymentMethod,
        paymentStatus: 'Confirmado'
      });
      await loadBills();
    } catch (err) {
      setError('Erro ao marcar como pago');
    }
  };

  const handleEdit = (bill: Bill) => {
    setFormData({
      billName: bill.billName,
      dueDate: bill.dueDate.toDate().toISOString().split('T')[0],
      amount: bill.amount,
      category: bill.category,
      description: bill.description || '',
      tags: bill.tags || [],
    });
    setEditBillId(bill.billId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) return <div className="text-center py-8">Carregando...</div>;

  return (
    <div className="min-h-screen bg-gray-50 pt-20 p-4 sm:p-8 font-montserrat">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl sm:text-4xl font-bold text-purple-600 sm:text-transparent mb-4 sm:mb-8">
          Gerenciar Despesas
        </h1>

        <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 mb-6">
          <h2 className="text-violet-400 text-center mb-5 text-xl sm:text-2xl font-poppins font-thin mb-4">
            {editBillId ? 'Editar Despesa' : 'Nova Despesa'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Nome da Despesa
                </label>
                <input
                  type="text"
                  required
                  value={formData.billName}
                  onChange={(e) => setFormData({ ...formData, billName: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Data de Vencimento
                </label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Valor
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="1"
                  required
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Categoria
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-black"
                >
                  <option value="Alimentação">Alimentação</option>
                  <option value="Moradia">Moradia</option>
                  <option value="Transporte">Transporte</option>
                  <option value="Educação">Educação</option>
                  <option value="Outros">Outros</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Descrição
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Tags
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addTag()}
                  className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-black"
                />
                <motion.button
                  type="button"
                  onClick={addTag}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-purple-600 text-white font-poppins font-thin rounded-lg hover:bg-purple-700 transition-colors shadow-md"
                >
                  Adicionar
                </motion.button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-gray-100 rounded-full text-sm text-black"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-lg font-poppins font-thin hover:from-blue-700 hover:via-purple-700  hover:to-pink-700 transition-all shadow-lg hover:shadow-xl"
              >
                {editBillId ? 'Atualizar Despesa' : 'Cadastrar Despesa'}
              </motion.button>
              {editBillId && (
                <motion.button
                  type="button"
                  onClick={() => {
                    setEditBillId(null);
                    setFormData({
                      billName: '',
                      dueDate: '',
                      amount: 0,
                      category: 'Outros',
                      description: '',
                      tags: [],
                    });
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors shadow-md"
                >
                  Cancelar
                </motion.button>
              )}
            </div>
          </form>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6">
          <h2 className="text-xl text-center text-purple-500 sm:text-2xl font-poppins font-thin mb-4">Suas Despesas</h2>
          
          {bills.length === 0 ? (
            <p className="text-gray-500 text-center py-4">Nenhuma despesa pendente</p>
          ) : (
            <div className="space-y-4">
              {bills.map((bill) => (
                <motion.div
                  key={bill.billId}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-black">{bill.billName}</h3>
                      <p className="text-gray-600">{bill.category}</p>
                      <p className="text-sm text-gray-500">
                        Vencimento: {new Date(bill.dueDate.toDate()).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`text-xl font-bold ${bill.paid ? 'text-green-600' : 'text-red-600'}`}>
                        R$ {bill.amount.toFixed(2)}
                      </p>
                      <span className={`px-2 py-1 text-sm rounded-full ${bill.paid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {bill.paid ? 'Pago' : 'Pendente'}
                      </span>
                    </div>
                  </div>
                  {bill.description && (
                    <p className="mt-2 text-gray-600">{bill.description}</p>
                  )}
                  {bill.tags && bill.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {bill.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-gray-100 text-black rounded-full text-sm"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="mt-4 space-y-2">
                    {!bill.paid && (
                      <div className="relative">
                        <select
                          value={paymentMethod}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg appearance-none bg-white text-gray-800 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                          <option value="Dinheiro">Dinheiro</option>
                          <option value="Cartão de Crédito">Cartão de Crédito</option>
                          <option value="Cartão de Débito">Cartão de Débito</option>
                          <option value="PIX">PIX</option>
                          <option value="Transferência Bancária">Transferência Bancária</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    )}
                    <div className="flex gap-2">
                      {!bill.paid && (
                        <motion.button
                          onClick={() => handleMarkAsPaid(bill.billId)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-md"
                        >
                          Marcar como Pago
                        </motion.button>
                      )}
                      <motion.button
                        onClick={() => handleEdit(bill)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
                      >
                        Editar
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}