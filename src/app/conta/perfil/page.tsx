'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase/config';
import { userService } from '@/lib/firebase/services/userService';
import { useAuth } from '@/lib/context/authContext';
import { User, Address } from '@/types/models';

export default function PerfilPage() {
  const { user: authUser, loading } = useAuth();
  const router = useRouter();
  
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: {
      street: '',
      number: '',
      city: '',
      state: '',
    } as Address,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!loading && !authUser) router.push('/login');
    if (authUser) loadUser();
  }, [authUser, loading]);

  const loadUser = async () => {
    try {
      const currentUser = await userService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        setFormData({
          name: currentUser.name,
          email: currentUser.email,
          phone: currentUser.phone || '',
          address: currentUser.address || {
            street: '',
            number: '',
            city: '',
            state: '',
          },
        });
      }
    } catch (err) {
      setError('Erro ao carregar perfil');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await userService.updateCurrentUser({
        name: formData.name,
        phone: formData.phone,
      });
      setSuccess('Perfil atualizado com sucesso!');
    } catch (err) {
      setError('Erro ao atualizar perfil');
    }
  };

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await userService.updateAddress(formData.address);
      setSuccess('Endereço atualizado com sucesso!');
    } catch (err) {
      setError('Erro ao atualizar endereço');
    }
  };

  if (loading) return <div className="text-center py-8">Carregando...</div>;

  return (
    <div className="min-h-screen bg-gray-50 pt-20 p-4 sm:p-8 font-montserrat">
      <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl sm:text-4xl font-bold text-purple-600 sm:text-transparent mb-4 sm:mb-8">
        Meu Perfil 
      </h1>

        {/* Formulário de Perfil */}
        <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 mb-6">
          <h2 className="text-xl text-center text-purple-500 sm:text-2xl font-poppins font-thin mb-4">
            Informações Pessoais
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {success && <p className="text-green-500 text-sm">{success}</p>}

            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Nome
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Email
              </label>
              <input
                type="email"
                disabled
                value={formData.email}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Telefone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-black"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 transition-all shadow-lg"
            >
              Atualizar Perfil
            </button>
          </form>
        </div>

        {/* Formulário de Endereço */}
        <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6">
          <h2 className="text-xl text-center text-purple-500 sm:text-2xl font-poppins font-thin mb-7">
            Endereço
          </h2>
          
          <form onSubmit={handleAddressSubmit} className="space-y-4">
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {success && <p className="text-green-500 text-sm">{success}</p>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Rua
                </label>
                <input
                  type="text"
                  value={formData.address.street}
                  onChange={(e) => setFormData({
                    ...formData,
                    address: { ...formData.address, street: e.target.value }
                  })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Número
                </label>
                <input
                  type="text"
                  value={formData.address.number}
                  onChange={(e) => setFormData({
                    ...formData,
                    address: { ...formData.address, number: e.target.value }
                  })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Cidade
                </label>
                <input
                  type="text"
                  value={formData.address.city}
                  onChange={(e) => setFormData({
                    ...formData,
                    address: { ...formData.address, city: e.target.value }
                  })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Estado
                </label>
                <input
                  type="text"
                  value={formData.address.state}
                  onChange={(e) => setFormData({
                    ...formData,
                    address: { ...formData.address, state: e.target.value }
                  })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-black"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 transition-all shadow-lg"
            >
              Atualizar Endereço
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}