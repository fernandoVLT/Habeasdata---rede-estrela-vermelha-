import React, { useState } from 'react';
import { Star, Users, Map as MapIcon, Megaphone } from 'lucide-react';
import { auth, db } from '../firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

export const LandingPage = () => {
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async () => {
    if (isLoggingIn) return;
    setIsLoggingIn(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if user exists in Firestore
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        // Create new user profile
        await setDoc(userRef, {
          uid: user.uid,
          name: user.displayName || 'Usuário',
          email: user.email || '',
          avatar: user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`,
          role: 'user',
          createdAt: serverTimestamp()
        });
      }
    } catch (error) {
      console.error("Error signing in with Google", error);
      alert("Erro ao fazer login com o Google. Tente novamente.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="px-6 py-4 flex justify-between items-center border-b border-gray-100">
        <div className="flex items-center gap-2 text-red-600">
          <Star size={32} className="fill-current" />
          <span className="text-xl font-bold tracking-tight">Rede Estrela MG</span>
        </div>
        <button onClick={handleLogin} disabled={isLoggingIn} className="px-5 py-2 bg-red-600 text-white font-bold rounded-full hover:bg-red-700 transition-colors disabled:opacity-50">
          {isLoggingIn ? 'Entrando...' : 'Entrar'}
        </button>
      </header>
      
      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 max-w-4xl mx-auto py-12">
        <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight mb-6">
          A força da nossa militância em <span className="text-red-600">Minas Gerais</span>.
        </h1>
        <p className="text-xl text-gray-600 mb-10 max-w-2xl">
          Uma plataforma de engajamento social e mapeamento para fortalecer o PT e os movimentos sociais. Conecte-se, participe de ações e acompanhe seu impacto.
        </p>
        <button onClick={handleLogin} disabled={isLoggingIn} className="px-8 py-4 bg-red-600 text-white text-lg font-bold rounded-full hover:bg-red-700 transition-transform hover:scale-105 shadow-lg flex items-center gap-2 disabled:opacity-50 disabled:hover:scale-100">
          {isLoggingIn ? 'Autenticando...' : 'Fazer parte da Rede'} <Star size={20} className="fill-current" />
        </button>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-20 text-left">
          <div className="p-6 bg-gray-50 rounded-2xl">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
              <Users size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2">Conexão</h3>
            <p className="text-gray-600">Encontre e interaja com outros militantes da sua região e compartilhe ideias.</p>
          </div>
          <div className="p-6 bg-gray-50 rounded-2xl">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
              <Megaphone size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2">Ações</h3>
            <p className="text-gray-600">Participe de campanhas, mobilizações e amplifique nossa voz nas redes.</p>
          </div>
          <div className="p-6 bg-gray-50 rounded-2xl">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
              <MapIcon size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2">Mapeamento</h3>
            <p className="text-gray-600">Visualize a força do nosso movimento em cada município de Minas Gerais.</p>
          </div>
        </div>
      </main>
    </div>
  );
};
