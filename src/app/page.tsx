'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRightIcon, PlusIcon, ChartBarIcon, CurrencyDollarIcon, ChartPieIcon, ClockIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/lib/context/authContext';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();
  const { user, loading, isProfileComplete } = useAuth();

  useEffect(() => {
    // Lógica de redirecionamento se necessário
  }, [user, loading, router, isProfileComplete]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { 
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'easeInOut', duration: 0.6 }
    }
  };

  const cardHover = {
    hover: {
      y: -5,
      scale: 1.02,
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05)',
      transition: {
        type: 'spring',
        stiffness: 300
      }
    }
  };

  if (loading) return null;

  return (
    <div className="min-h-screen bg-white overflow-hidden relative">
      {/* Espaço para Navbar */}
      <div className="h-9" />

      <div className="container mx-auto px-4 pt-8 pb-16 flex flex-col items-center justify-center text-center relative z-10">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        
        >
          <img 
            src="/logosite.png" 
            alt="Logo EcoCash" 
            className="mx-auto max-w-[250px] md:max-w-[250px]"
          />
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="max-w-3xl lg:max-w-5xl mx-auto"
        >
          <motion.p
            variants={itemVariants}
            className="font-poppins font-normal text-xl text-gray-400 mb-8 mx-auto"
          >
            {user ? 'Controle total das suas finanças' : 'Simplifique sua vida financeira'}
          </motion.p>

          {/* Cards de Recursos */}
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
          >
            <motion.div 
              variants={itemVariants}
              whileHover="hover"
              className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
            >
              <div className="mb-4 inline-flex p-3 rounded-lg bg-blue-50">
                <CurrencyDollarIcon className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-poppins font-thin text-gray-800 mb-2">Controle Simplificado</h3>
              <p className="text-sm text-gray-500 font-poppins font-thin">
                Gerencie despesas e receitas em um único lugar
              </p>
            </motion.div>

            <motion.div 
              variants={itemVariants}
              whileHover="hover"
              className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
            >
              <div className="mb-4 inline-flex p-3 rounded-lg bg-purple-50">
                <ChartPieIcon className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-poppins font-thin text-gray-800 mb-2">Análise Detalhada</h3>
              <p className="text-sm text-gray-500 font-poppins font-thin">
                Veja tudo sendo atualizado em tempo real
              </p>
            </motion.div>

            <motion.div 
              variants={itemVariants}
              whileHover="hover"
              className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
            >
              <div className="mb-4 inline-flex p-3 rounded-lg bg-pink-50">
                <ClockIcon className="h-6 w-6 text-pink-600" />
              </div>
              <h3 className="text-lg font-poppins font-thin text-gray-800 mb-2">Economize Tempo</h3>
              <p className="text-sm text-gray-500 font-poppins font-thin">
                Automações para gestão financeira eficiente
              </p>
            </motion.div>
          </motion.div>

          {/* Botões Principais */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col md:flex-row gap-3 justify-center"
          >
            {user ? (
              <>
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="w-full md:w-auto"
                >
                  <Link
                    href="/conta/despesas"
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-sm hover:shadow-md transition-all"
                  >
                    <PlusIcon className="h-5 w-5" />
                    <span className="text-base font-poppins font-thin">Nova Despesa</span>
                  </Link>
                </motion.div>

                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="w-full md:w-auto"
                >
                  <Link
                    href="/conta/financas"
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg shadow-sm hover:shadow-md transition-all"
                  >
                    <ChartBarIcon className="h-5 w-5" />
                    <span className="text-base font-poppins font-thin">Painel Financeiro</span>
                  </Link>
                </motion.div>
              </>
            ) : (
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="w-full md:w-auto"
              >
                <Link
                  href="/login"
                  className="flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg shadow-sm hover:shadow-md transition-all"
                >
                  <span className="text-sm">Começar Agora</span>
                  <ArrowRightIcon className="h-5 w-5" />
                </Link>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </div>

      {/* Espaço para Footer */}
      <div className="w-full" />
    </div>
  );
}