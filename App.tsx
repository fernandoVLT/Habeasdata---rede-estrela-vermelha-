import React, { useState } from 'react';
import { Home, Map as MapIcon, User as UserIcon, Bell, SquarePen, Star, ArrowLeft, Calendar, MoreHorizontal, Megaphone } from 'lucide-react';
import { Feed } from './components/Feed';
import { MapViz } from './components/MapViz';
import { Trends } from './components/Trends';
import { ActionsHub } from './components/ActionsHub';
import { CURRENT_USER, NOTIFICATIONS } from './constants';

enum View {
  HOME = 'HOME',
  MAP = 'MAP',
  ACTIONS = 'ACTIONS', // Nova view
  PROFILE = 'PROFILE',
  NOTIFICATIONS = 'NOTIFICATIONS'
}

// Mobile Bottom Navigation Item
const MobileNavItem = ({ view, icon: Icon, label, currentView, setCurrentView, hasNewActions }: { view: View, icon: any, label: string, currentView: View, setCurrentView: (v: View) => void, hasNewActions: boolean }) => (
  <button 
    onClick={() => setCurrentView(view)}
    className={`flex flex-col items-center justify-center p-1 flex-1 ${currentView === view ? 'text-gray-900 font-bold' : 'text-gray-500'}`}
  >
    <div className="relative">
      <Icon size={24} strokeWidth={currentView === view ? 2.5 : 2} />
      {view === View.NOTIFICATIONS && (
         <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-600 rounded-full border-2 border-white"></div>
      )}
      {view === View.ACTIONS && hasNewActions && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-600 rounded-full border-2 border-white animate-pulse"></div>
      )}
    </div>
    <span className="text-[10px] mt-0.5">{label}</span>
  </button>
);

// Desktop Sidebar Item
const SidebarItem = ({ view, icon: Icon, label, currentView, setCurrentView, hasNewActions }: { view: View, icon: any, label: string, currentView: View, setCurrentView: (v: View) => void, hasNewActions: boolean }) => (
  <button 
    onClick={() => setCurrentView(view)}
    className={`flex items-center gap-4 px-4 py-3 w-fit rounded-full transition-all duration-200 group hover:bg-gray-100`}
  >
    <div className="relative">
       <Icon size={28} strokeWidth={currentView === view ? 2.5 : 2} className="group-hover:scale-105 transition-transform" />
       {view === View.NOTIFICATIONS && (
         <div className="absolute top-0 right-0.5 w-2.5 h-2.5 bg-red-600 rounded-full border-2 border-white"></div>
       )}
       {view === View.ACTIONS && hasNewActions && (
           <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-600 rounded-full border-2 border-white animate-pulse"></div>
       )}
    </div>
    <span className={`text-xl hidden xl:block pr-4 ${currentView === view ? 'font-bold text-gray-900' : 'text-gray-700'}`}>{label}</span>
  </button>
);

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.HOME);
  
  // New state to control map focus from ActionsHub
  const [mapTarget, setMapTarget] = useState<{lat: number, lng: number, zoom: number} | null>(null);

  // Fake notification state
  const hasNewActions = true; 

  const handleNavigateToMap = (lat: number, lng: number) => {
    setMapTarget({ lat, lng, zoom: 16 });
    setCurrentView(View.MAP);
  };

  return (
    <div className="flex justify-center min-h-screen bg-white">
      <div className="flex w-full max-w-[1300px]">
        
        {/* Left Sidebar (Desktop) */}
        <header className="hidden sm:flex flex-col justify-between w-[80px] xl:w-[275px] px-2 py-4 h-screen sticky top-0 border-r border-gray-200 z-50">
          <div className="flex flex-col items-center xl:items-start gap-1">
            {/* Logo */}
            <div className="p-3 mb-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer w-fit">
               <Star size={30} className="text-red-600 fill-current" />
            </div>

            <nav className="flex flex-col gap-1 w-full items-center xl:items-start">
              <SidebarItem view={View.HOME} icon={Home} label="Página Inicial" currentView={currentView} setCurrentView={setCurrentView} hasNewActions={hasNewActions} />
              <SidebarItem view={View.ACTIONS} icon={Megaphone} label="Ações" currentView={currentView} setCurrentView={setCurrentView} hasNewActions={hasNewActions} />
              <SidebarItem view={View.MAP} icon={MapIcon} label="Mapa Militância" currentView={currentView} setCurrentView={setCurrentView} hasNewActions={hasNewActions} />
              <SidebarItem view={View.NOTIFICATIONS} icon={Bell} label="Notificações" currentView={currentView} setCurrentView={setCurrentView} hasNewActions={hasNewActions} />
              <SidebarItem view={View.PROFILE} icon={UserIcon} label="Perfil" currentView={currentView} setCurrentView={setCurrentView} hasNewActions={hasNewActions} />
            </nav>

            <button className="mt-8 bg-red-600 hover:bg-red-700 text-white rounded-full p-4 xl:py-3.5 xl:w-[90%] font-bold shadow-lg transition-transform hover:scale-105 flex justify-center items-center">
              <SquarePen className="xl:hidden" size={24} />
              <span className="hidden xl:block text-lg">Postar</span>
            </button>
          </div>

          <div className="mt-auto flex items-center gap-3 p-3 rounded-full hover:bg-gray-100 cursor-pointer transition-colors w-full">
            <img 
              src={CURRENT_USER.avatar} 
              alt="User" 
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="hidden xl:block flex-1 overflow-hidden">
              <p className="font-bold text-sm text-gray-900 leading-tight truncate">{CURRENT_USER.name}</p>
              <p className="text-gray-500 text-sm truncate">{CURRENT_USER.handle}</p>
            </div>
            <MoreHorizontal size={18} className="hidden xl:block text-gray-500" />
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 w-full max-w-[600px] min-h-screen border-r border-gray-200 relative pb-16 sm:pb-0">
          {currentView === View.HOME && <Feed />}
          
          {currentView === View.ACTIONS && <ActionsHub onNavigateToMap={handleNavigateToMap} />}

          {currentView === View.MAP && <MapViz focusLocation={mapTarget} />}
          
          {currentView === View.NOTIFICATIONS && (
            <div className="flex flex-col h-full">
              <div className="sticky top-0 bg-white/85 backdrop-blur-md z-10">
                <div className="px-4 py-3">
                   <h2 className="text-xl font-bold text-gray-900">Notificações</h2>
                </div>
                <div className="flex border-b border-gray-200">
                   <button className="flex-1 py-4 hover:bg-gray-100 relative text-center">
                      <span className="font-bold text-sm text-gray-900">Todas</span>
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-red-600 rounded-full"></div>
                   </button>
                   <button className="flex-1 py-4 hover:bg-gray-100 relative text-center">
                      <span className="font-bold text-sm text-gray-500">Verificado</span>
                   </button>
                   <button className="flex-1 py-4 hover:bg-gray-100 relative text-center">
                      <span className="font-bold text-sm text-gray-500">Menções</span>
                   </button>
                </div>
              </div>
              
              <div className="flex-1">
                 {NOTIFICATIONS.map(notif => (
                   <div key={notif.id} className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors flex gap-3 cursor-pointer">
                      <div className="w-8 flex justify-end">
                         {notif.type === 'like' && <Star size={24} className="text-pink-600 fill-current" />}
                         {notif.type === 'retweet' && <div className="text-green-500 text-xl font-bold">↻</div>}
                         {notif.type === 'follow' && <UserIcon size={24} className="text-blue-500 fill-current" />}
                         {notif.type === 'mention' && <span className="text-gray-500 text-lg">@</span>}
                      </div>
                      <div className="flex-1">
                         <div className="flex items-center gap-2 mb-1">
                            <img src={notif.user.avatar} className="w-8 h-8 rounded-full" />
                         </div>
                         <p className="text-gray-900 text-sm">
                            <span className="font-bold">{notif.user.name}</span> 
                            {notif.type === 'like' && ' curtiu seu post'}
                            {notif.type === 'retweet' && ' repostou seu post'}
                            {notif.type === 'follow' && ' seguiu você'}
                            {notif.type === 'mention' && ' mencionou você'}
                         </p>
                         {notif.postContent && (
                           <p className="text-gray-500 text-sm mt-1">{notif.postContent}</p>
                         )}
                         {notif.content && (
                           <p className="text-gray-900 text-sm mt-1">{notif.content}</p>
                         )}
                      </div>
                   </div>
                 ))}
              </div>
            </div>
          )}

          {currentView === View.PROFILE && (
            <div className="flex flex-col min-h-screen">
               {/* Header Navigation */}
               <div className="sticky top-0 bg-white/85 backdrop-blur-md z-10 px-4 py-1 flex items-center gap-6 border-b border-gray-100">
                  <button onClick={() => setCurrentView(View.HOME)} className="p-2 rounded-full hover:bg-gray-100">
                    <ArrowLeft size={20} />
                  </button>
                  <div>
                    <h2 className="text-lg font-bold leading-none">{CURRENT_USER.name}</h2>
                    <span className="text-xs text-gray-500">1.254 posts</span>
                  </div>
               </div>

               {/* Banner */}
               <div className="h-48 bg-gray-200 w-full overflow-hidden">
                 {CURRENT_USER.banner && <img src={CURRENT_USER.banner} className="w-full h-full object-cover" />}
               </div>
               
               {/* Profile Info */}
               <div className="px-4 pb-4">
                  <div className="flex justify-between items-start">
                    <div className="relative -mt-20 mb-3">
                      <img src={CURRENT_USER.avatar} className="w-36 h-36 rounded-full border-4 border-white object-cover" />
                    </div>
                    <button className="mt-3 px-4 py-1.5 border border-gray-300 rounded-full font-bold text-sm hover:bg-gray-100 transition-colors">
                      Editar perfil
                    </button>
                  </div>
                  
                  <div className="mt-1">
                    <div className="flex items-center gap-1">
                       <h1 className="text-xl font-extrabold text-gray-900">{CURRENT_USER.name}</h1>
                       {CURRENT_USER.isVerified && (
                          <svg viewBox="0 0 24 24" aria-label="Conta verificada" className="w-5 h-5 text-red-600 fill-current"><g><path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .495.083.965.238 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z"></path></g></svg>
                       )}
                    </div>
                    <p className="text-gray-500 text-sm">{CURRENT_USER.handle}</p>
                  </div>

                  <p className="mt-3 text-gray-900 text-[15px]">{CURRENT_USER.bio}</p>
                  
                  <div className="flex gap-4 mt-3 text-gray-500 text-sm">
                     <div className="flex items-center gap-1">
                        <MapIcon size={16} />
                        <span>Betim, Brasil</span>
                     </div>
                     <div className="flex items-center gap-1">
                        <Calendar size={16} />
                        <span>Ingressou em {CURRENT_USER.joinedDate}</span>
                     </div>
                  </div>

                  <div className="flex gap-4 mt-3 text-sm">
                    <span className="text-gray-500"><strong className="text-gray-900">{CURRENT_USER.following}</strong> Seguindo</span>
                    <span className="text-gray-500"><strong className="text-gray-900">{CURRENT_USER.followers}</strong> Seguidores</span>
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
                  {/* Reuse Feed Items logic or simplified version */}
                  <div className="p-8 text-center text-gray-500 text-sm">
                     Aqui aparecerão seus posts.
                  </div>
               </div>
            </div>
          )}
        </main>

        {/* Right Sidebar (News/Trends) - Hidden on smaller maps view */}
        {currentView !== View.MAP && (
          <Trends />
        )}
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="sm:hidden fixed bottom-0 w-full bg-white border-t border-gray-200 flex justify-between px-2 pb-safe z-50 h-[60px]">
        <MobileNavItem view={View.HOME} icon={Home} label="Início" currentView={currentView} setCurrentView={setCurrentView} hasNewActions={hasNewActions} />
        <MobileNavItem view={View.ACTIONS} icon={Megaphone} label="Ações" currentView={currentView} setCurrentView={setCurrentView} hasNewActions={hasNewActions} />
        <MobileNavItem view={View.MAP} icon={MapIcon} label="Mapa" currentView={currentView} setCurrentView={setCurrentView} hasNewActions={hasNewActions} />
        <MobileNavItem view={View.NOTIFICATIONS} icon={Bell} label="Avisos" currentView={currentView} setCurrentView={setCurrentView} hasNewActions={hasNewActions} />
        <MobileNavItem view={View.PROFILE} icon={UserIcon} label="Perfil" currentView={currentView} setCurrentView={setCurrentView} hasNewActions={hasNewActions} />
      </div>
    </div>
  );
};

export default App;