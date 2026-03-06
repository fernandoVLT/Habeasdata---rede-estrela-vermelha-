import React, { useState } from 'react';
import { Search, MoreHorizontal } from 'lucide-react';
import { TRENDS, WHO_TO_FOLLOW, LEADERS_LIST } from '../constants';

export const Trends: React.FC = () => {
  // Estado para controlar quem o usuário está seguindo (apenas visual/mock)
  const [followingState, setFollowingState] = useState<Record<string, boolean>>({});

  const handleFollowToggle = (userId: string) => {
    setFollowingState(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  return (
    <div className="hidden lg:flex flex-col w-[350px] pl-8 py-2 h-screen sticky top-0">
      {/* Search Bar */}
      <div className="sticky top-0 bg-white pt-2 pb-2 z-10 mb-2">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-500 group-focus-within:text-red-600" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2.5 border-none rounded-full leading-5 bg-gray-100 text-gray-900 placeholder-gray-500 focus:outline-none focus:bg-white focus:ring-1 focus:ring-red-600 sm:text-sm transition-all"
            placeholder="Buscar"
          />
        </div>
      </div>

      <div className="overflow-y-auto pb-4 custom-scrollbar flex-1 space-y-4">
        {/* Featured Card */}
        <div className="bg-gray-50 rounded-2xl overflow-hidden border border-gray-100">
          <div className="p-4">
            <h3 className="font-bold text-xl text-gray-900 leading-tight mb-2">Filie-se ao PT</h3>
            <p className="text-xs text-gray-600 mb-4 leading-relaxed">
              Fortaleça a luta e ajude a construir um Brasil melhor. Faça parte do Partido dos Trabalhadores.
            </p>
            <button className="w-full bg-gray-900 text-white rounded-full py-2 font-bold text-sm hover:bg-black transition-colors">
              Filiar-se agora
            </button>
          </div>
        </div>

        {/* Featured Leaders Section (NEW) */}
        <div className="bg-gray-50 rounded-2xl border border-gray-100">
           <h3 className="px-4 pt-3 pb-2 font-extrabold text-xl text-gray-900">Lideranças em Destaque</h3>
           {LEADERS_LIST.map((user) => {
             const isFollowing = followingState[user.id];
             return (
               <div key={user.id} className="px-4 py-3 hover:bg-gray-100 cursor-pointer transition-colors flex items-center gap-3">
                  <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover ring-2 ring-red-100" />
                  <div className="flex-1 min-w-0">
                     <div className="flex items-center gap-1">
                        <span className="font-bold text-sm text-gray-900 truncate">{user.name}</span>
                        {user.isVerified && (
                          <svg viewBox="0 0 24 24" aria-label="Conta verificada" className="w-4 h-4 text-red-600 fill-current flex-shrink-0"><g><path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .495.083.965.238 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z"></path></g></svg>
                        )}
                     </div>
                     <div className="text-sm text-gray-500 truncate">{user.handle}</div>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFollowToggle(user.id);
                    }}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200 border ${
                      isFollowing 
                        ? 'bg-white text-gray-900 border-gray-300 hover:bg-red-50 hover:text-red-600' 
                        : 'bg-red-600 text-white border-transparent hover:bg-red-700'
                    }`}
                  >
                    {isFollowing ? 'Seguindo' : 'Seguir'}
                  </button>
               </div>
             );
           })}
        </div>

        {/* Trends List */}
        <div className="bg-gray-50 rounded-2xl border border-gray-100">
          <h3 className="px-4 pt-3 pb-2 font-extrabold text-xl text-gray-900">O que está acontecendo</h3>
          
          {TRENDS.map((trend) => (
            <div key={trend.id} className="px-4 py-3 hover:bg-gray-100 cursor-pointer transition-colors relative">
               <button className="absolute top-3 right-2 p-1.5 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-50">
                 <MoreHorizontal size={16} />
               </button>
               <div className="text-xs text-gray-500 font-medium">{trend.category}</div>
               <div className="font-bold text-gray-900 mt-0.5 text-sm">{trend.topic}</div>
               <div className="text-xs text-gray-500 mt-0.5">{trend.postsCount}</div>
            </div>
          ))}
          
          <button className="w-full text-left px-4 py-4 text-red-600 text-sm hover:bg-gray-100 rounded-b-2xl transition-colors">
            Mostrar mais
          </button>
        </div>

        {/* Who to Follow (General Suggestions) */}
        <div className="bg-gray-50 rounded-2xl border border-gray-100">
           <h3 className="px-4 pt-3 pb-2 font-extrabold text-xl text-gray-900">Sugestões para você</h3>
           
           {WHO_TO_FOLLOW.map((user) => {
             const isFollowing = followingState[user.id];
             
             return (
               <div key={user.id} className="px-4 py-3 hover:bg-gray-100 cursor-pointer transition-colors flex items-center gap-3">
                  <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
                  <div className="flex-1 min-w-0">
                     <div className="flex items-center gap-1">
                        <span className="font-bold text-sm text-gray-900 truncate">{user.name}</span>
                        {user.isVerified && (
                          <svg viewBox="0 0 24 24" aria-label="Conta verificada" className="w-4 h-4 text-red-600 fill-current flex-shrink-0"><g><path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .495.083.965.238 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z"></path></g></svg>
                        )}
                     </div>
                     <div className="text-sm text-gray-500 truncate">{user.handle}</div>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFollowToggle(user.id);
                    }}
                    className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all duration-200 border ${
                      isFollowing 
                        ? 'bg-white text-gray-900 border-gray-300 hover:bg-red-50 hover:text-red-600 hover:border-red-200 group' 
                        : 'bg-black text-white border-transparent hover:bg-gray-800'
                    }`}
                  >
                    {isFollowing ? (
                      <span className="group-hover:hidden">Seguindo</span>
                    ) : 'Seguir'}
                    {isFollowing && (
                      <span className="hidden group-hover:inline">Deixar de seguir</span>
                    )}
                  </button>
               </div>
             );
           })}
           
           <button className="w-full text-left px-4 py-4 text-red-600 text-sm hover:bg-gray-100 rounded-b-2xl transition-colors">
             Mostrar mais
           </button>
        </div>

        {/* Footer Links */}
        <div className="px-4 text-xs text-gray-500 flex flex-wrap gap-x-3 gap-y-1 pb-10">
          <a href="#" className="hover:underline">Termos</a>
          <a href="#" className="hover:underline">Privacidade</a>
          <a href="#" className="hover:underline">Cookies</a>
          <a href="#" className="hover:underline">Acessibilidade</a>
          <a href="#" className="hover:underline">Anúncios</a>
          <span>© 2024 Rede Estrela</span>
        </div>
      </div>
    </div>
  );
};