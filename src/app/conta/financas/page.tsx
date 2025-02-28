'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase/config';
import { financeHistoryService } from '../../../lib/firebase/services/financeHistoryService';
import { financeService } from '../../../lib/firebase/services/financeService';
import { useAuth } from '@/lib/context/authContext';
import { Finance, FinanceHistoryEntry } from '@/types/models';
import { Timestamp } from 'firebase/firestore';
import { FaTrash } from 'react-icons/fa';

export default function FinancasPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  
  const [finance, setFinance] = useState<Finance | null>(null);
  const [formData, setFormData] = useState({
    currentBalance: 0,
    totalExpenses: 0
  });
  const [error, setError] = useState('');
  const [history, setHistory] = useState<FinanceHistoryEntry[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<FinanceHistoryEntry[]>([]);
  const [sortBy, setSortBy] = useState<'maior' | 'menor' | 'data'>('data');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  useEffect(() => {
    if (!loading && !user) router.push('/login');
    if (user) {
      loadFinance();
      loadFinanceHistory();
    }
  }, [user, loading]);

  useEffect(() => {
    filterHistory();
  }, [history, sortBy, startDate, endDate]);

  const loadFinance = async () => {
    try {
      const financeData = await financeService.getCurrentUserFinance();
      if (financeData) {
        setFinance(financeData);
        setFormData({
          currentBalance: financeData.currentBalance,
          totalExpenses: financeData.totalExpenses
        });
      }
    } catch (err) {
      setError('Erro ao carregar dados financeiros');
    }
  };

  const loadFinanceHistory = async () => {
    try {
      const userId = auth.currentUser?.uid;
      if (userId) {
        const historyData = await financeHistoryService.getUserFinanceHistory();
        setHistory(historyData);
      }
    } catch (err) {
      setError('Erro ao carregar histórico financeiro');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      const totalIncome = formData.currentBalance - formData.totalExpenses;

      await financeService.createOrUpdateFinance({
        userId: auth.currentUser?.uid || '',
        currentBalance: formData.currentBalance,
        totalIncome: totalIncome,
        totalExpenses: formData.totalExpenses
      });

      if (formData.currentBalance !== finance?.currentBalance) {
        await financeService.updateCurrentBalance(formData.currentBalance);
      }
      if (formData.totalExpenses !== finance?.totalExpenses) {
        await financeService.updateTotalExpenses(formData.totalExpenses);
      }

      await loadFinance();
      await loadFinanceHistory();
    } catch (err) {
      setError('Erro ao salvar dados financeiros');
    }
  };

  const filterHistory = () => {
    let filtered = [...history];

    if (startDate && endDate) {
      filtered = filtered.filter(entry => {
        const entryDate = entry.timestamp instanceof Timestamp ? entry.timestamp.toDate() : new Date(entry.timestamp);
        return entryDate >= new Date(startDate) && entryDate <= new Date(endDate);
      });
    }

    if (sortBy === 'maior') {
      filtered.sort((a, b) => (b.newValue || 0) - (a.newValue || 0));
    } else if (sortBy === 'menor') {
      filtered.sort((a, b) => (a.newValue || 0) - (b.newValue || 0));
    } else if (sortBy === 'data') {
      filtered.sort((a, b) => {
        const dateA = a.timestamp instanceof Timestamp ? a.timestamp.toDate() : new Date(a.timestamp);
        const dateB = b.timestamp instanceof Timestamp ? b.timestamp.toDate() : new Date(b.timestamp);
        return dateB.getTime() - dateA.getTime();
      });
    }

    setFilteredHistory(filtered);
  };

  const deleteHistoryEntry = async (historyId: string) => {
    try {
      await financeHistoryService.deleteFinanceHistoryEntry(historyId);
      await loadFinanceHistory();
    } catch (err) {
      setError('Erro ao excluir registro do histórico');
    }
  };

  if (loading) return <div className="text-center py-8">Carregando...</div>;

  return (
    <div className="min-h-screen bg-gray-50 pt-20 p-4 sm:p-8 font-montserrat">
      <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl sm:text-4xl font-bold text-purple-600 sm:text-transparent mb-4 sm:mb-8">
        Gerenciar Finanças
      </h1>

        <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 mb-6">
          <h2 className="text-violet-400 text-center mb-5 text-xl sm:text-2xl font-poppins font-thin">
            {finance ? 'Atualizar Dados' : 'Novo Registro Financeiro'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Saldo Atual
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.currentBalance}
                  onChange={(e) => setFormData({ ...formData, currentBalance: Number(e.target.value) })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Despesas Totais
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.totalExpenses}
                  onChange={(e) => setFormData({ ...formData, totalExpenses: Number(e.target.value) })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-black"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 transition-all shadow-lg"
            >
              {finance ? 'Atualizar Dados' : 'Criar Registro'}
            </button>
          </form>
        </div>

        {finance && (
          <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6">
            <h2 className="text-xl text-center text-purple-500 sm:text-2xl font-poppins font-thin mb-4">
              Resumo Financeiro
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg text-center">
                <p className="text-sm text-gray-600">Saldo Atual</p>
                <p className="text-2xl font-bold text-blue-600">
                  R$ {finance.currentBalance.toFixed(2)}
                </p>
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg text-center">
                <p className="text-sm text-gray-600">Receita Total</p>
                <p className="text-2xl font-bold text-green-600">
                  R$ {(finance.currentBalance - finance.totalExpenses).toFixed(2)}
                </p>
              </div>
              
              <div className="p-4 bg-red-50 rounded-lg text-center">
                <p className="text-sm text-gray-600">Despesas Totais</p>
                <p className="text-2xl font-bold text-red-600">
                  R$ {finance.totalExpenses.toFixed(2)}
                </p>
              </div>
            </div>

            <div className="mt-4 text-center text-sm text-gray-500">
              Última atualização: {finance.lastUpdated && (
                new Date(finance.lastUpdated instanceof Timestamp ? finance.lastUpdated.toDate() : finance.lastUpdated)
                  .toLocaleDateString('pt-BR')
              )}
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 mt-6">
          <h2 className="text-xl text-center text-purple-500 sm:text-2xl font-poppins font-thin mb-4">
            Histórico de Transações
          </h2>

          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'maior' | 'menor' | 'data')}
              className="w-full sm:w-auto px-4 py-2 rounded-lg border text-gray-600 border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="maior">Maior Valor</option>
              <option value="menor">Menor Valor</option>
              <option value="data">Data</option>
            </select>

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
          
          <div className="space-y-4">
            {filteredHistory.map(entry => (
              <div key={entry.historyId} className="p-4 bg-gray-50 rounded-lg flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">{entry.description}</p>
                  <p className="text-sm text-gray-600">Valor Antigo: R$ {entry.oldValue?.toFixed(2) || 'N/A'}</p>
                  <p className="text-sm text-gray-600">Novo Valor: R$ {entry.newValue?.toFixed(2) || 'N/A'}</p>
                  <p className="text-sm text-gray-600">Data: {new Date(entry.timestamp instanceof Timestamp ? entry.timestamp.toDate() : entry.timestamp).toLocaleString('pt-BR')}</p>
                </div>
                <button
                  onClick={() => deleteHistoryEntry(entry.historyId)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}