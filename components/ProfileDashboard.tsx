import React from 'react';
import { ArrowLeft, TrendingUp, Award, CheckCircle, Calendar, Map as MapIcon } from 'lucide-react';
import { CURRENT_USER } from '../constants';

export const ProfileDashboard = ({ user, onBack }: { user: any, onBack: () => void }) => {
  return (
    <div className="flex flex-col min-h-screen bg-white pb-20 sm:pb-0">
       {/* Header Navigation */}
       <div className="sticky top-0 bg-white/85 backdrop-blur-md z-10 px-4 py-1 flex items-center gap-6 border-b border-gray-100">
          <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-100">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-lg font-bold leading-none">{user.name}</h2>
            <span className="text-xs text-gray-500">1.254 posts</span>
          </div>
       </div>

       {/* Banner */}
       <div className="h-48 bg-gray-200 w-full overflow-hidden">
         {user.banner && <img src={user.banner} className="w-full h-full object-cover" />}
       </div>
       
       {/* Profile Info */}
       <div className="px-4 pb-4">
          <div className="flex justify-between items-start">
            <div className="relative -mt-20 mb-3">
              <img src={user.avatar} className="w-36 h-36 rounded-full border-4 border-white object-cover bg-white" />
            </div>
            {user.id === CURRENT_USER.id ? (
              <button className="mt-3 px-4 py-1.5 border border-gray-300 rounded-full font-bold text-sm hover:bg-gray-100 transition-colors">
                Editar perfil
              </button>
            ) : (
              <button className="mt-3 px-4 py-1.5 bg-red-600 text-white rounded-full font-bold text-sm hover:bg-red-700 transition-colors">
                Seguir
              </button>
            )}
          </div>
          
          <div className="mt-1">
            <div className="flex items-center gap-1">
               <h1 className="text-xl font-extrabold text-gray-900">{user.name}</h1>
               {user.isVerified && (
                  <svg viewBox="0 0 24 24" aria-label="Conta verificada" className="w-5 h-5 text-red-600 fill-current"><g><path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .495.083.965.238 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z"></path></g></svg>
               )}
            </div>
            <p className="text-gray-500 text-sm">{user.handle}</p>
          </div>

          <p className="mt-3 text-gray-900 text-[15px]">{user.bio}</p>
          
          <div className="flex gap-4 mt-3 text-gray-500 text-sm">
             <div className="flex items-center gap-1">
                <MapIcon size={16} />
                <span>Betim, Brasil</span>
             </div>
             <div className="flex items-center gap-1">
                <Calendar size={16} />
                <span>Ingressou em {user.joinedDate || '2023'}</span>
             </div>
          </div>

          <div className="flex gap-4 mt-3 text-sm">
            <span className="text-gray-500"><strong className="text-gray-900">{user.following || 0}</strong> Seguindo</span>
            <span className="text-gray-500"><strong className="text-gray-900">{user.followers || 0}</strong> Seguidores</span>
          </div>
       </div>

       {/* Dashboard Metrics */}
       <div className="px-4 py-4 border-t border-gray-100 bg-gray-50">
         <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
           <TrendingUp size={20} className="text-red-600" />
           Seu Impacto na Rede
         </h3>
         
         <div className="grid grid-cols-2 gap-3">
           <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
             <div className="flex items-center gap-2 text-gray-500 mb-2">
               <Award size={18} className="text-yellow-500" />
               <span className="text-sm font-medium">Pontos</span>
             </div>
             <p className="text-2xl font-bold text-gray-900">4.850</p>
             <p className="text-xs text-green-600 font-medium mt-1">+120 esta semana</p>
           </div>
           
           <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
             <div className="flex items-center gap-2 text-gray-500 mb-2">
               <CheckCircle size={18} className="text-green-500" />
               <span className="text-sm font-medium">Ações Concluídas</span>
             </div>
             <p className="text-2xl font-bold text-gray-900">42</p>
             <p className="text-xs text-green-600 font-medium mt-1">Top 5% na sua região</p>
           </div>
         </div>
       </div>

       {/* Tabs */}
       <div className="flex border-b border-gray-200 mt-2">
         {['Posts', 'Respostas', 'Destaques', 'Mídia', 'Curtidas'].map((tab, idx) => (
           <button key={tab} className="flex-1 py-3 hover:bg-gray-100 relative text-center transition-colors">
              <span className={`font-medium text-sm ${idx === 0 ? 'text-gray-900' : 'text-gray-500'}`}>{tab}</span>
              {idx === 0 && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-1 bg-red-600 rounded-full"></div>}
           </button>
         ))}
       </div>

       {/* Mock Content for Profile Feed */}
       <div className="flex-1 bg-white">
          <div className="p-8 text-center text-gray-500 text-sm">
             Aqui aparecerão seus posts.
          </div>
       </div>
    </div>
  );
};
