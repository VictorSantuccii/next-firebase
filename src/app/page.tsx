'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRightIcon, PlusIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/lib/context/authContext';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();
  const { user, loading, isProfileComplete } = useAuth();

  useEffect(() => {
    const checkProfile = async () => {
      if (!loading && user) {
        const complete = await isProfileComplete();
        if (!complete) router.push('/cadastro');
      } else if (!loading && !user) {
        router.push('/login');
      }
    };
    checkProfile();
  }, [user, loading, router, isProfileComplete]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  if (loading) return null;

  return (
    <div className="min-h-screen bg-white overflow-hidden relative">
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          initial={{ x: -100, y: -100 }}
          animate={{ x: ["-10%", "90%", "-10%"], y: ["-20%", "120%", "-20%"] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute w-[300px] h-[300px] bg-gradient-to-r from-purple-100 to-blue-100 rounded-full blur-3xl opacity-40"
        />
        
        <motion.div
          initial={{ x: "100%", y: "100%" }}
          animate={{ x: ["100%", "-50%", "100%"], y: ["100%", "-50%", "100%"] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute w-[400px] h-[400px] bg-gradient-to-r from-pink-100 to-indigo-100 rounded-full blur-3xl opacity-30"
        />
      </div>

      <div className="container mx-auto px-4 h-screen flex flex-col items-center justify-center text-center relative z-10">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="max-w-2xl lg:max-w-4xl mx-auto"
        >
          <motion.h1
            variants={itemVariants}
            className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight"
          >
            Controle Financeiro
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Inteligente
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="font-montserrat text-lg md:text-xl text-gray-600 mb-8"
          >
            {user ? 'Gerencie suas finanças com precisão' : 'Comece a controlar suas finanças hoje mesmo'}
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col md:flex-row gap-4 md:gap-6 justify-center"
          >
            {user ? (
              <>
                <motion.div 
                  whileHover={{ scale: 1.05 }} 
                  whileTap={{ scale: 0.95 }}
                  className="relative overflow-hidden"
                >
                  <Link
                    href="/conta/despesas"
                    className="flex items-center justify-center gap-2 px-6 md:px-8 py-3 md:py-4 bg-indigo-600 text-white rounded-xl shadow-lg hover:shadow-indigo-400/30 transition-all duration-300 relative group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <PlusIcon className="h-5 w-5 md:h-6 md:w-6 z-10" />
                    <span className="font-medium z-10">Criar Nova Despesa</span>
                    <ArrowRightIcon className="h-4 w-4 md:h-5 md:w-5 ml-1 md:ml-2 z-10" />
                  </Link>
                </motion.div>

                <motion.div 
                  whileHover={{ scale: 1.05 }} 
                  whileTap={{ scale: 0.95 }}
                  className="relative overflow-hidden"
                >
                  <Link
                    href="/conta/perfil"
                    className="flex items-center justify-center gap-2 px-6 md:px-8 py-3 md:py-4 bg-white text-gray-900 rounded-xl shadow-lg hover:shadow-gray-300/40 transition-all duration-300 relative group border border-gray-100"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <UserCircleIcon className="h-5 w-5 md:h-6 md:w-6 z-10" />
                    <span className="font-medium z-10">Ver Meu Perfil</span>
                  </Link>
                </motion.div>
              </>
            ) : (
              <motion.div 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }}
                className="relative overflow-hidden"
              >
                <Link
                  href="/login"
                  className="flex items-center justify-center gap-2 px-8 md:px-10 py-3 md:py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-purple-400/30 transition-all duration-300 group"
                >
                  <span className="font-medium">Cadastre-se ou Faça Login</span>
                  <ArrowRightIcon className="h-5 w-5 ml-2 transform group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}