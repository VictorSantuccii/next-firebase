'use client';

import { useState, useEffect } from 'react';
import { auth } from '../../../lib/firebase/config';
import { useAuth } from '../../../lib/context/authContext';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { FcGoogle } from 'react-icons/fc';
import { db } from '../../../lib/firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { User } from '../../../types/models';
import { userService } from '../../../lib/firebase/services/userService';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) router.push('/');
  }, [user, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError('Falha no login. Verifique suas credenciais.');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const userCredential = await signInWithPopup(auth, new GoogleAuthProvider());
      const firebaseUser = userCredential.user;
      
      // Verificar se o usuário já tem registro completo
      const userData = await userService.getCurrentUser();
      
      if (!userData || !userData.phone) {
        router.push('/cadastro');
      }
    } catch (err) {
      setError('Falha no login com Google.');
    }
  };

  if (loading) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 font-montserrat">
      <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-2xl shadow-xl">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text mb-2">
            EcoCash
          </h2>
          <p className="text-2xl font-medium text-gray-900">Bem-vindo de volta</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Senha
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 transition-all shadow-lg"
          >
            Entrar
          </button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Ou continue com</span>
          </div>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full flex justify-center items-center gap-2 py-3 px-4 bg-white text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50 transition-all font-medium"
        >
          <FcGoogle className="h-6 w-6" />
          Entrar com Google
        </button>

        <p className="text-center text-sm text-gray-600">
          Não tem conta?{' '}
          <a 
            href="/cadastro" 
            className="font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:from-blue-700 hover:to-purple-700 transition-all"
          >
            Cadastre-se
          </a>
        </p>
      </div>
    </div>
  );
}