import React, { useState, useEffect } from 'react';
import { Home, Map as MapIcon, User as UserIcon, Bell, SquarePen, Star, MoreHorizontal, Megaphone, BarChart2, Search, MessageSquare } from 'lucide-react';
import { Feed } from './components/Feed';
import { MapViz } from './components/MapViz';
import { Trends } from './components/Trends';
import { ActionsHub } from './components/ActionsHub';
import { LandingPage } from './components/LandingPage';
import { ProfileDashboard } from './components/ProfileDashboard';
import { EstrelinhaAI } from './components/EstrelinhaAI';
import { Dashboard } from './components/Dashboard';
import { Chat } from './components/Chat';
import { CURRENT_USER, NOTIFICATIONS, LEADERS_LIST } from './constants';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

enum View {
  HOME = 'HOME',
  MAP = 'MAP',
  ACTIONS = 'ACTIONS',
  PROFILE = 'PROFILE',
  NOTIFICATIONS = 'NOTIFICATIONS',
  DASHBOARD = 'DASHBOARD',
  CHAT = 'CHAT'
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
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState<View>(View.HOME);
  const [profileUser, setProfileUser] = useState<any>(CURRENT_USER);
  const [user, setUser] = useState<any>(null);
  
  // New state to control map focus from ActionsHub
  const [mapTarget, setMapTarget] = useState<{lat: number, lng: number, zoom: number} | null>(null);

  // Fake notification state
  const hasNewActions = true; 

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setIsAuthenticated(true);
        setUser(currentUser);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleNavigateToMap = (lat: number, lng: number) => {
    setMapTarget({ lat, lng, zoom: 16 });
    setCurrentView(View.MAP);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-red-600 text-white">
        <Star size={80} className="animate-spin fill-current mb-6" />
        <h1 className="text-3xl font-bold tracking-tight">Rede Estrela</h1>
        <p className="text-red-200 mt-2 font-medium">Conectando a militância...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LandingPage />;
  }

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
              
              {/* Lideranças em Destaque */}
              <div className="hidden xl:block w-full mt-4 mb-2 px-3">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Lideranças em Destaque</h3>
                <div className="flex flex-col gap-2">
                  {LEADERS_LIST.map((leader) => (
                    <div 
                      key={leader.id} 
                      className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-100 cursor-pointer transition-colors"
                      onClick={() => {
                        setProfileUser(leader);
                        setCurrentView(View.PROFILE);
                      }}
                    >
                      <img src={leader.avatar} alt={leader.name} className="w-8 h-8 rounded-full object-cover" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-900 truncate flex items-center gap-1">
                          {leader.name}
                          {leader.isVerified && (
                            <svg viewBox="0 0 24 24" aria-label="Conta verificada" className="w-3 h-3 text-red-600 fill-current flex-shrink-0"><g><path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .495.083.965.238 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z"></path></g></svg>
                          )}
                        </p>
                        <p className="text-xs text-gray-500 truncate">{leader.handle}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <SidebarItem view={View.ACTIONS} icon={Megaphone} label="Ações" currentView={currentView} setCurrentView={setCurrentView} hasNewActions={hasNewActions} />
              <SidebarItem view={View.MAP} icon={MapIcon} label="Mapa Militância" currentView={currentView} setCurrentView={setCurrentView} hasNewActions={hasNewActions} />
              <SidebarItem view={View.CHAT} icon={MessageSquare} label="Mensagens" currentView={currentView} setCurrentView={setCurrentView} hasNewActions={false} />
              <SidebarItem view={View.DASHBOARD} icon={BarChart2} label="Métricas" currentView={currentView} setCurrentView={setCurrentView} hasNewActions={hasNewActions} />
              <SidebarItem view={View.NOTIFICATIONS} icon={Bell} label="Notificações" currentView={currentView} setCurrentView={setCurrentView} hasNewActions={hasNewActions} />
              <div onClick={() => setProfileUser(CURRENT_USER)}>
                <SidebarItem view={View.PROFILE} icon={UserIcon} label="Perfil" currentView={currentView} setCurrentView={setCurrentView} hasNewActions={hasNewActions} />
              </div>
            </nav>

            <button className="mt-8 bg-red-600 hover:bg-red-700 text-white rounded-full p-4 xl:py-3.5 xl:w-[90%] font-bold shadow-lg transition-transform hover:scale-105 flex justify-center items-center">
              <SquarePen className="xl:hidden" size={24} />
              <span className="hidden xl:block text-lg">Postar</span>
            </button>
          </div>

          <div className="mt-auto flex items-center gap-3 p-3 rounded-full hover:bg-gray-100 cursor-pointer transition-colors w-full">
            <img 
              src={user?.photoURL || CURRENT_USER.avatar} 
              alt="User" 
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="hidden xl:block flex-1 overflow-hidden">
              <p className="font-bold text-sm text-gray-900 leading-tight truncate">{user?.displayName || CURRENT_USER.name}</p>
              <p className="text-gray-500 text-sm truncate">{user?.email || CURRENT_USER.handle}</p>
            </div>
            <MoreHorizontal size={18} className="hidden xl:block text-gray-500" />
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 w-full max-w-[600px] min-h-screen border-r border-gray-200 relative pb-16 sm:pb-0">
          {/* Global Search Bar */}
          <div className="sticky top-0 bg-white/85 backdrop-blur-md z-20 border-b border-gray-200 px-4 py-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Buscar na Rede Estrela..." 
                className="w-full bg-gray-100 border-none rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-red-600"
              />
            </div>
          </div>

          {currentView === View.HOME && <Feed />}
          
          {currentView === View.ACTIONS && <ActionsHub onNavigateToMap={handleNavigateToMap} />}

          {currentView === View.MAP && <MapViz focusLocation={mapTarget} />}

          {currentView === View.CHAT && <Chat />}

          {currentView === View.DASHBOARD && <Dashboard />}
          
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
            <ProfileDashboard user={profileUser} onBack={() => setCurrentView(View.HOME)} />
          )}
        </main>

        {/* Right Sidebar (News/Trends) - Hidden on smaller maps view */}
        {currentView !== View.MAP && currentView !== View.CHAT && (
          <Trends />
        )}
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="sm:hidden fixed bottom-0 w-full bg-white border-t border-gray-200 flex justify-between px-2 pb-safe z-50 h-[60px]">
        <MobileNavItem view={View.HOME} icon={Home} label="Início" currentView={currentView} setCurrentView={setCurrentView} hasNewActions={hasNewActions} />
        <MobileNavItem view={View.ACTIONS} icon={Megaphone} label="Ações" currentView={currentView} setCurrentView={setCurrentView} hasNewActions={hasNewActions} />
        <MobileNavItem view={View.MAP} icon={MapIcon} label="Mapa" currentView={currentView} setCurrentView={setCurrentView} hasNewActions={hasNewActions} />
        <MobileNavItem view={View.CHAT} icon={MessageSquare} label="Mensagens" currentView={currentView} setCurrentView={setCurrentView} hasNewActions={false} />
        <div onClick={() => setProfileUser(CURRENT_USER)}>
          <MobileNavItem view={View.PROFILE} icon={UserIcon} label="Perfil" currentView={currentView} setCurrentView={setCurrentView} hasNewActions={hasNewActions} />
        </div>
      </div>

      <EstrelinhaAI />
    </div>
  );
};

export default App;