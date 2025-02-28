'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase/config';
import { billService } from '@/lib/firebase/services/billService';
import { useAuth } from '@/lib/context/authContext';
import { Timestamp } from 'firebase/firestore';
import { Bill } from '@/types/models';

export default function HistoricoPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  
  const [bills, setBills] = useState<Bill[]>([]);
  const [filter, setFilter] = useState<'all' | 'paid' | 'pending'>('all');
  const [dateFilter, setDateFilter] = useState<'all' | '30' | '180' | 'custom'>('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortBy, setSortBy] = useState<'maior' | 'menor'>('maior');
  const [error, setError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedBillId, setSelectedBillId] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) router.push('/login');
    if (user) loadBills();
  }, [user, loading]);

  const loadBills = async () => {
    try {
      const userBills = await billService.getUserBills();
      setBills(userBills);
    } catch (err) {
      setError('Erro ao carregar histórico de despesas');
    }
  };

  const handleDeleteBill = async (billId: string) => {
    try {
      await billService.deleteBill(billId);
      setBills(bills.filter(bill => bill.billId !== billId));
    } catch (err) {
      setError('Erro ao excluir despesa');
    }
  };

  const allBillsTotal = bills.reduce((acc, bill) => acc + bill.amount, 0);
  const paidTotal = bills.filter(b => b.paid).reduce((acc, bill) => acc + bill.amount, 0);
  const pendingTotal = bills.filter(b => !b.paid).reduce((acc, bill) => acc + bill.amount, 0);

  const filteredBills = bills
    .filter(bill => {
      const statusMatch = filter === 'all' || 
        (filter === 'paid' && bill.paid) || 
        (filter === 'pending' && !bill.paid);

      const billDate = bill.dueDate.toDate();
      let dateMatch = true;
      
      if (dateFilter === '30') {
        const limitDate = new Date();
        limitDate.setDate(limitDate.getDate() - 30);
        dateMatch = billDate >= limitDate;
      }
      else if (dateFilter === '180') {
        const limitDate = new Date();
        limitDate.setMonth(limitDate.getMonth() - 6);
        dateMatch = billDate >= limitDate;
      }
      else if (dateFilter === 'custom' && startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        dateMatch = billDate >= start && billDate <= end;
      }

      return statusMatch && dateMatch;
    })
    .sort((a, b) => {
      if (sortBy === 'maior') return b.amount - a.amount;
      return a.amount - b.amount;
    });

  if (loading) return <div className="text-center py-8">Carregando...</div>;

  return (
    <div className="min-h-screen bg-gray-50 pt-20 p-4 sm:p-8 font-montserrat">
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full">
            <h3 className="text-lg text-gray-600 font-semibold mb-4">Confirmar exclusão</h3>
            <p className="mb-6 text-gray-600">Tem certeza que deseja excluir esta despesa?</p>
            <div className="flex gap-4 justify-end">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  if (selectedBillId) {
                    handleDeleteBill(selectedBillId);
                    setShowDeleteModal(false);
                  }
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl sm:text-4xl font-bold text-purple-600 sm:text-transparent mb-4 sm:mb-8">
          Histórico de Despesas
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-r bg-blue-100  p-4 rounded-xl text-blue-400 shadow-lg transform hover:scale-105 transition-transform">
            <h3 className="text-sm font-poppins font-thin">Total Geral</h3>
            <p className="text-2xl font-poppins font-bold">R$ {allBillsTotal.toFixed(2)}</p>
          </div>
          <div className="bg-gradient-to-r bg-green-100 p-4 rounded-xl text-green-400 shadow-lg transform hover:scale-105 transition-transform">
            <h3 className="text-sm font-poppins font-thin">Total Pagas</h3>
            <p className="text-2xl font-poppins font-bold">R$ {paidTotal.toFixed(2)}</p>
          </div>
          <div className="bg-gradient-to-r bg-red-100 p-4 rounded-xl text-red-500 shadow-lg transform hover:scale-105 transition-transform">
            <h3 className="text-sm font-poppins font-thin">Total Pendentes</h3>
            <p className="text-2xl font-poppins font-bold">R$ {pendingTotal.toFixed(2)}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h2 className="text-lg font-poppins font-thin text-purple-500 mb-2">Status</h2>
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2 rounded-lg ${
                    filter === 'all'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  } transition-colors`}
                >
                  Todas
                </button>
                <button
                  onClick={() => setFilter('paid')}
                  className={`px-4 py-2 rounded-lg ${
                    filter === 'paid'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  } transition-colors`}
                >
                  Pagas
                </button>
                <button
                  onClick={() => setFilter('pending')}
                  className={`px-4 py-2 rounded-lg ${
                    filter === 'pending'
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  } transition-colors`}
                >
                  Pendentes
                </button>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-poppins font-thin text-purple-500 mb-2">Período</h2>
              <div className="flex flex-col gap-2">
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value as any)}
                  className="w-full px-4 py-2 rounded-lg border text-gray-600 border-gray-300 focus:ring-2 focus:ring-purple-500"
                >
                  <option value="all">Todo o período</option>
                  <option value="30">Últimos 30 dias</option>
                  <option value="180">Últimos 6 meses</option>
                  <option value="custom">Personalizado</option>
                </select>

                {dateFilter === 'custom' && (
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col">
                    <label htmlFor="endDate" className="text-sm font-poppins font-thin text-purple-500 mb-2">
                      Data de início
                    </label>
                    <input
                      id="endDate"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="px-4 py-2 rounded-lg border border-indigo-500 focus:ring-2 focus:ring-indigo-300 text-gray-600"
                    />
                  </div>
                    <div className="flex flex-col">
                    <label htmlFor="endDate" className="text-sm font-poppins font-thin text-purple-500 mb-2">
                      Data de término
                    </label>
                    <input
                      id="endDate"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="px-4 py-2 rounded-lg border border-indigo-500 focus:ring-2 focus:ring-indigo-300 text-gray-600"
                    />
                  </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-4">
            <h2 className="text-lg font-poppins font-thin text-purple-500 mb-2">Ordenar por Valor</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setSortBy('maior')}
                className={`px-4 py-2 rounded-lg ${
                  sortBy === 'maior'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                } transition-colors`}
              >
                Maior para Menor
              </button>
              <button
                onClick={() => setSortBy('menor')}
                className={`px-4 py-2 rounded-lg ${
                  sortBy === 'menor'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                } transition-colors`}
              >
                Menor para Maior
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6">
          <h2 className="text-xl text-center text-purple-500 sm:text-2xl font-poppins font-thin mb-4">
            {filter === 'all' && 'Todas as Despesas'}
            {filter === 'paid' && 'Despesas Pagas'}
            {filter === 'pending' && 'Despesas Pendentes'}
          </h2>

          {filteredBills.length === 0 ? (
            <p className="text-gray-500 text-center py-4">Nenhuma despesa encontrada</p>
          ) : (
            <div className="space-y-4">
              {filteredBills.map((bill) => (
                <div
                  key={bill.billId}
                  className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow transform hover:-translate-y-1 transition-transform duration-300"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-black">{bill.billName}</h3>
                      <p className="text-gray-600">{bill.category}</p>
                      <p className="text-sm text-gray-500">
                        Vencimento: {new Date(bill.dueDate.toDate()).toLocaleDateString('pt-BR')}
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
                  {bill.paid && bill.paymentDate && (
                    <p className="mt-2 text-sm text-gray-900">
                      Pago em: {new Date(bill.paymentDate.toDate()).toLocaleDateString('pt-BR')}
                    </p>
                  )}
                  <button
                    onClick={() => {
                      setSelectedBillId(bill.billId);
                      setShowDeleteModal(true);
                    }}
                    className="mt-2 text-red-500 hover:text-red-700"
                  >
                    Excluir
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}