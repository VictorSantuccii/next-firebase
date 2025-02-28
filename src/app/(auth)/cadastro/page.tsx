'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../lib/context/authContext';
import { auth, db } from '../../../lib/firebase/config';
import { userService } from '../../../lib/firebase/services/userService';
import { FcGoogle } from 'react-icons/fc';
import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  createUserWithEmailAndPassword,
  signOut
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  serverTimestamp 
} from 'firebase/firestore';

export default function CadastroPage() {
  const router = useRouter();
  const { user, isProfileComplete } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: {
      street: '',
      number: '',
      city: '',
      state: ''
    }
  });
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const checkProfile = async () => {
      if (user) {
        const complete = await isProfileComplete();
        if (complete) {
          router.push('/');
        } else {
          setFormData(prev => ({
            ...prev,
            email: user.email || '',
            name: user.displayName || '',
            profilePicture: user.photoURL || ''
          }));
        }
      }
    };
    checkProfile();
  }, [user, router, isProfileComplete]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (user) {
        await setDoc(doc(db, 'users', user.uid), {
          ...formData,
          userId: user.uid,
          createdAt: serverTimestamp(),
          lastLogin: serverTimestamp()
        }, { merge: true });
        router.push('/');
      } else {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          formData.email,
          password
        );
        await userService.createUser({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address
        });
        router.push('/');
      }
    } catch (error: any) {
      console.error('Erro:', error);
      setError(error.message || 'Erro ao processar cadastro.');
    }
  };

  const handleGoogleSignup = async () => {
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
      const complete = await isProfileComplete();
      if (!complete) router.push('/cadastro');
    } catch (error: any) {
      await signOut(auth);
      setError(error.message || 'Erro ao autenticar com Google');
    }
  };

  const handleChange = (field: string, value: string | object) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen text-gray-400 flex items-center justify-center bg-gray-50 font-montserrat">
      <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-2xl shadow-xl">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text mb-2">
            EcoCash
          </h2>
          <p className="text-2xl font-medium text-gray-900">
            {user ? 'Complete seu cadastro' : 'Criar nova conta'}
          </p>
        </div>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {!user && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Senha</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  required
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nome completo</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Telefone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              required
            />
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Endereço</label>
            <input
              type="text"
              placeholder="Rua"
              value={formData.address.street}
              onChange={(e) => handleChange('address', {...formData.address, street: e.target.value})}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            />
            <input
              type="text"
              placeholder="Número"
              value={formData.address.number}
              onChange={(e) => handleChange('address', {...formData.address, number: e.target.value})}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            />
            <input
              type="text"
              placeholder="Cidade"
              value={formData.address.city}
              onChange={(e) => handleChange('address', {...formData.address, city: e.target.value})}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            />
            <input
              type="text"
              placeholder="Estado"
              value={formData.address.state}
              onChange={(e) => handleChange('address', {...formData.address, state: e.target.value})}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 transition-all shadow-lg"
          >
            {user ? 'Salvar informações' : 'Cadastrar'}
          </button>
        </form>

        {!user && (
          <>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Ou cadastre-se com</span>
              </div>
            </div>

            <button
              onClick={handleGoogleSignup}
              className="w-full flex justify-center items-center gap-2 py-3 px-4 bg-white text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50 transition-all font-medium"
            >
              <FcGoogle className="h-6 w-6" />
              Cadastre-se com Google
            </button>
          </>
        )}

        <p className="text-center text-sm text-gray-600">
          {user ? 'Voltar para ' : 'Já tem uma conta? '}
          <a 
            href={user ? "/" : "/login"} 
            className="font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:from-blue-700 hover:to-purple-700 transition-all"
          >
            {user ? 'Página inicial' : 'Faça login'}
          </a>
        </p>
      </div>
    </div>
  );
}