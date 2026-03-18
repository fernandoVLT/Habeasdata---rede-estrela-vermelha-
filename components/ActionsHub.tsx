import React, { useState, useMemo } from 'react';
import { Megaphone, FileText, GraduationCap, HandHeart, Calendar, MapPin, Users, CheckCircle2, TrendingUp, Plus, Vote, X, Maximize2, Clock, ShieldCheck, AlertTriangle, Phone, Scale, ChevronLeft, ChevronRight, Link as LinkIcon, Download, Bookmark } from 'lucide-react';
import { ACTIONS_DATA, PETITIONS_DATA, UNIVERSITY_DATA, SOCIAL_AID_DATA, POLLS_DATA, FACT_CHECK_DATA } from '../constants';

interface ActionsHubProps {
  onNavigateToMap: (lat: number, lng: number) => void;
}

export const ActionsHub: React.FC<ActionsHubProps> = ({ onNavigateToMap }) => {
  const [activeTab, setActiveTab] = useState<'EVENTS' | 'PETITIONS' | 'UNI' | 'AID' | 'TRUTH'>('EVENTS');
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
  
  // States for Modals
  const [showPetitionModal, setShowPetitionModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  
  // State for Petition/Poll Switcher
  const [creationType, setCreationType] = useState<'PETITION' | 'POLL'>('PETITION');

  // State for Event Filter
  const [eventFilter, setEventFilter] = useState<'ALL' | 'PROTEST' | 'MEETING'>('ALL');
  const [regionFilter, setRegionFilter] = useState<string>('ALL');
  const [dateFilter, setDateFilter] = useState<'ALL' | 'TODAY' | 'WEEK' | '15_DAYS'>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'LIVE' | 'FUTURE' | 'PAST'>('ALL');

  // Pagination state
  const [viewMode, setViewMode] = useState<'PAGINATED' | 'ALL'>('PAGINATED');
  const [currentEventIndex, setCurrentEventIndex] = useState(0);

  // State for Attendance (Simulated local storage)
  const [attendanceState, setAttendanceState] = useState<Record<string, boolean>>({});
  const [savedActions, setSavedActions] = useState<Record<string, boolean>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const toggleSaveAction = (id: string) => {
    setSavedActions(prev => {
      const isSaved = !prev[id];
      if (isSaved) {
        showToast('Salvo em seus favoritos!');
      } else {
        showToast('Removido dos favoritos.');
      }
      return { ...prev, [id]: isSaved };
    });
  };

  // State for Carousels
  const [carouselIndices, setCarouselIndices] = useState<Record<string, number>>({});

  // State for Event Creation
  const [newEventImages, setNewEventImages] = useState<string[]>([]);
  const [currentImageInput, setCurrentImageInput] = useState('');

  // State for Events
  const [events, setEvents] = useState(ACTIONS_DATA);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDate, setNewEventDate] = useState('');
  const [newEventTime, setNewEventTime] = useState('');
  const [newEventLocation, setNewEventLocation] = useState('');
  const [newEventDescription, setNewEventDescription] = useState('');
  const [newEventType, setNewEventType] = useState<'PROTEST' | 'MEETING'>('PROTEST');

  // State for Polls
  const [polls, setPolls] = useState(POLLS_DATA);
  const [votedPolls, setVotedPolls] = useState<Record<string, string>>({}); // pollId -> optionId
  const [newPollQuestion, setNewPollQuestion] = useState('');
  const [newPollOptions, setNewPollOptions] = useState(['', '', '']);
  const [newPollDuration, setNewPollDuration] = useState('24 horas');

  // State for Petitions
  const [petitions, setPetitions] = useState(PETITIONS_DATA);
  const [signedPetitions, setSignedPetitions] = useState<Record<string, boolean>>({});
  const [newPetitionTitle, setNewPetitionTitle] = useState('');
  const [newPetitionDescription, setNewPetitionDescription] = useState('');
  const [newPetitionGoal, setNewPetitionGoal] = useState('');
  const [newPetitionAttachments, setNewPetitionAttachments] = useState<{type: 'PDF' | 'LINK', title: string, url: string}[]>([]);
  const [currentAttachmentInput, setCurrentAttachmentInput] = useState('');
  const [currentAttachmentType, setCurrentAttachmentType] = useState<'PDF' | 'LINK'>('LINK');

  const handleAddImage = () => {
    if (currentImageInput) {
      setNewEventImages([...newEventImages, currentImageInput]);
      setCurrentImageInput('');
    }
  };

  const handleAddAttachment = () => {
    if (currentAttachmentInput) {
      setNewPetitionAttachments([...newPetitionAttachments, {
        type: currentAttachmentType,
        title: currentAttachmentInput, // Simplified for demo
        url: currentAttachmentInput
      }]);
      setCurrentAttachmentInput('');
    }
  };

  const handleVote = (pollId: string, optionId: string) => {
    if (votedPolls[pollId]) return; // Already voted

    setVotedPolls(prev => ({ ...prev, [pollId]: optionId }));
    
    setPolls(prevPolls => prevPolls.map(poll => {
      if (poll.id === pollId) {
        const newTotalVotes = poll.totalVotes + 1;
        const newOptions = poll.options.map(opt => {
          if (opt.id === optionId) {
            return { ...opt, votes: opt.votes + 1 };
          }
          return opt;
        });
        
        // Recalculate percentages
        const updatedOptions = newOptions.map(opt => ({
          ...opt,
          percent: Math.round((opt.votes / newTotalVotes) * 100)
        }));

        return { ...poll, totalVotes: newTotalVotes, options: updatedOptions };
      }
      return poll;
    }));
  };

  const handleCreateEvent = () => {
    if (!newEventTitle.trim() || !newEventDate || !newEventLocation.trim()) {
      showToast('Preencha título, data e local.');
      return;
    }

    const newEvent = {
      id: `evt-${Date.now()}`,
      type: newEventType,
      title: newEventTitle,
      date: `${newEventDate} às ${newEventTime}`,
      location: newEventLocation,
      region: 'Sua Região',
      organizer: 'Você',
      confirmedCount: 1,
      timestamp: new Date(`${newEventDate}T${newEventTime || '00:00'}`).toISOString(),
      gallery: newEventImages.length > 0 ? newEventImages : undefined,
      image: newEventImages.length > 0 ? newEventImages[0] : 'https://picsum.photos/seed/new/800/600',
      isLive: false
    };

    setEvents([newEvent, ...events]);
    setShowEventModal(false);
    setNewEventTitle('');
    setNewEventDate('');
    setNewEventTime('');
    setNewEventLocation('');
    setNewEventDescription('');
    setNewEventImages([]);
    showToast('Evento criado com sucesso!');
  };

  const handleCreatePoll = () => {
    if (!newPollQuestion.trim() || newPollOptions.filter(o => o.trim()).length < 2) {
      showToast('Preencha a pergunta e pelo menos 2 opções.');
      return;
    }
    
    const validOptions = newPollOptions.filter(o => o.trim());
    
    const newPoll = {
      id: `poll-${Date.now()}`,
      question: newPollQuestion,
      options: validOptions.map((opt, idx) => ({
        id: `opt-${idx}`,
        text: opt,
        votes: 0,
        percent: 0
      })),
      totalVotes: 0,
      createdBy: {
        name: 'Você',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop'
      },
      timeLeft: newPollDuration
    };
    
    setPolls([newPoll, ...polls]);
    setShowPetitionModal(false);
    setNewPollQuestion('');
    setNewPollOptions(['', '', '']);
    showToast('Enquete lançada com sucesso!');
  };

  const handleCreatePetition = () => {
    if (!newPetitionTitle.trim() || !newPetitionDescription.trim() || !newPetitionGoal) {
      showToast('Preencha todos os campos obrigatórios.');
      return;
    }
    
    const newPetition = {
      id: `pet-${Date.now()}`,
      title: newPetitionTitle,
      description: newPetitionDescription,
      targetGoal: parseInt(newPetitionGoal) || 1000,
      currentSignatures: 0,
      createdBy: {
        name: 'Você',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop'
      },
      attachments: newPetitionAttachments
    };
    
    setPetitions([newPetition, ...petitions]);
    setShowPetitionModal(false);
    setNewPetitionTitle('');
    setNewPetitionDescription('');
    setNewPetitionGoal('');
    setNewPetitionAttachments([]);
    showToast('Petição criada com sucesso!');
  };

  const handleSignPetition = (id: string) => {
    if (signedPetitions[id]) return;
    
    setSignedPetitions(prev => ({ ...prev, [id]: true }));
    setPetitions(prev => prev.map(pet => {
      if (pet.id === id) {
        return { ...pet, currentSignatures: pet.currentSignatures + 1 };
      }
      return pet;
    }));
    showToast('Petição assinada com sucesso!');
  };

  const [now] = useState(() => Date.now());

  // Memoized Sorted & Filtered Events
  const displayedEvents = useMemo(() => {
    let filteredEvents = [...events];

    // Filter by type
    if (eventFilter !== 'ALL') {
      filteredEvents = filteredEvents.filter(e => e.type === eventFilter);
    }

    // Filter by Region
    if (regionFilter !== 'ALL') {
       filteredEvents = filteredEvents.filter(e => e.region === regionFilter);
    }

    // Filter by Status
    if (statusFilter !== 'ALL') {
      if (statusFilter === 'LIVE') {
        filteredEvents = filteredEvents.filter(e => e.date === 'AGORA!' || e.isLive);
      } else if (statusFilter === 'FUTURE') {
        filteredEvents = filteredEvents.filter(e => e.date !== 'AGORA!' && !e.isLive && new Date(e.timestamp).getTime() >= now);
      } else if (statusFilter === 'PAST') {
        filteredEvents = filteredEvents.filter(e => e.date !== 'AGORA!' && !e.isLive && new Date(e.timestamp).getTime() < now);
      }
    }

    // Filter by Date (simplified logic for demo)
    if (dateFilter !== 'ALL') {
      const oneDay = 24 * 60 * 60 * 1000;
      if (dateFilter === 'TODAY') {
        filteredEvents = filteredEvents.filter(e => e.date === 'AGORA!' || e.date.toLowerCase().includes('hoje') || (new Date(e.timestamp).getTime() - now < oneDay && new Date(e.timestamp).getTime() > now - oneDay));
      } else if (dateFilter === 'WEEK') {
        filteredEvents = filteredEvents.filter(e => new Date(e.timestamp).getTime() - now < 7 * oneDay && new Date(e.timestamp).getTime() > now - oneDay);
      } else if (dateFilter === '15_DAYS') {
        filteredEvents = filteredEvents.filter(e => new Date(e.timestamp).getTime() - now < 15 * oneDay && new Date(e.timestamp).getTime() > now - oneDay);
      }
    }

    // Sort by Date (Nearest first)
    filteredEvents.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    return filteredEvents;
  }, [events, eventFilter, regionFilter, statusFilter, dateFilter, now]);

  const uniqueRegions = useMemo(() => {
     const regions = new Set(events.map(a => a.region).filter(Boolean));
     return Array.from(regions);
  }, [events]);

  const toggleAttendance = (id: string) => {
    setAttendanceState(prev => {
       const isAttending = !prev[id];
       if (isAttending) {
         showToast('Presença confirmada! Nos vemos lá.');
       } else {
         showToast('Presença cancelada.');
       }
       return {
         ...prev,
         [id]: isAttending
       };
    });
  };

  const handleCarousel = (id: string, direction: 'prev' | 'next', length: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setCarouselIndices(prev => {
       const current = prev[id] || 0;
       let nextIndex = direction === 'next' ? current + 1 : current - 1;
       
       if (nextIndex >= length) nextIndex = 0;
       if (nextIndex < 0) nextIndex = length - 1;

       return { ...prev, [id]: nextIndex };
    });
  };

  return (
    <div className="flex-1 border-r border-gray-200 min-h-screen bg-white pb-20 sm:pb-0 relative">
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-md border-b border-gray-200 p-4">
        <h2 className="text-xl font-bold text-gray-900">Ações & Mobilização</h2>
        <p className="text-sm text-gray-500">Ferramentas de luta e solidariedade.</p>
        
        <div className="flex gap-2 mt-4 overflow-x-auto scrollbar-hide">
          <button 
            onClick={() => setActiveTab('EVENTS')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${activeTab === 'EVENTS' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            <Megaphone size={16} /> Mobilização
          </button>
          <button 
            onClick={() => setActiveTab('TRUTH')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${activeTab === 'TRUTH' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            <ShieldCheck size={16} /> Verdade
          </button>
          <button 
            onClick={() => setActiveTab('PETITIONS')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${activeTab === 'PETITIONS' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            <Vote size={16} /> Petições
          </button>
          <button 
            onClick={() => setActiveTab('UNI')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${activeTab === 'UNI' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            <GraduationCap size={16} /> Estudantes
          </button>
          <button 
            onClick={() => setActiveTab('AID')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${activeTab === 'AID' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            <HandHeart size={16} /> Apoio
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* EVENTS TAB */}
        {activeTab === 'EVENTS' && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Action Bar */}
            <div className="flex flex-col gap-3 mb-4">
               <div className="flex flex-wrap items-center gap-2">
                  <button 
                    onClick={() => setEventFilter('ALL')}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors border ${eventFilter === 'ALL' ? 'bg-black text-white border-black' : 'bg-white text-gray-600 border-gray-300'}`}
                  >
                    Todos
                  </button>
                  <button 
                    onClick={() => setEventFilter('PROTEST')}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold transition-colors border ${eventFilter === 'PROTEST' ? 'bg-red-600 text-white border-red-600' : 'bg-white text-gray-600 border-gray-300'}`}
                  >
                    <Megaphone size={12} /> Protestos
                  </button>
                  <button 
                    onClick={() => setEventFilter('MEETING')}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold transition-colors border ${eventFilter === 'MEETING' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-300'}`}
                  >
                    <Users size={12} /> Encontros
                  </button>
                  
                  {/* Region Filter Dropdown */}
                  <select 
                     className="px-3 py-1.5 rounded-full text-xs font-bold border border-gray-300 bg-white text-gray-600 focus:outline-none focus:border-red-600"
                     value={regionFilter}
                     onChange={(e) => setRegionFilter(e.target.value)}
                  >
                     <option value="ALL">Todas as Regiões</option>
                     {uniqueRegions.map(r => <option key={r} value={r as string}>{r}</option>)}
                  </select>

                  {/* Date Filter Dropdown */}
                  <select 
                     className="px-3 py-1.5 rounded-full text-xs font-bold border border-gray-300 bg-white text-gray-600 focus:outline-none focus:border-red-600"
                     value={dateFilter}
                     onChange={(e) => setDateFilter(e.target.value as any)}
                  >
                     <option value="ALL">Qualquer Data</option>
                     <option value="TODAY">Hoje</option>
                     <option value="WEEK">Esta Semana</option>
                     <option value="15_DAYS">Próximos 15 dias</option>
                  </select>

                  {/* Status Filter Dropdown */}
                  <select 
                     className="px-3 py-1.5 rounded-full text-xs font-bold border border-gray-300 bg-white text-gray-600 focus:outline-none focus:border-red-600"
                     value={statusFilter}
                     onChange={(e) => setStatusFilter(e.target.value as any)}
                  >
                     <option value="ALL">Qualquer Status</option>
                     <option value="LIVE">Ao Vivo</option>
                     <option value="FUTURE">Futuro</option>
                     <option value="PAST">Passado</option>
                  </select>
               </div>
               
               <button 
                 onClick={() => setShowEventModal(true)}
                 className="flex items-center gap-1 text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm font-bold transition-colors w-full justify-center"
               >
                 <Plus size={16} /> Criar Evento
               </button>
            </div>
            
            {viewMode === 'PAGINATED' && displayedEvents.length > 0 ? (
              <div className="relative">
                {/* Single Event Display */}
                {(() => {
                  const action = displayedEvents[currentEventIndex];
                  const gallery = action.gallery && action.gallery.length > 0 ? action.gallery : (action.image ? [action.image] : []);
                  const currentImgIndex = carouselIndices[action.id] || 0;
                  const hasGallery = gallery.length > 1;

                  return (
                    <div key={action.id} className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm bg-white relative animate-in fade-in duration-300">
                      {/* Event Type Badge - Prominent */}
                      <div className="absolute top-3 left-3 z-10">
                        <div className={`shadow-md text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-2 ${action.type === 'PROTEST' ? 'bg-red-600' : 'bg-blue-600'}`}>
                            {action.type === 'PROTEST' ? <Megaphone size={14}/> : <Users size={14}/>}
                            {action.type === 'PROTEST' ? 'PROTESTO' : 'ENCONTRO'}
                        </div>
                      </div>

                      {gallery.length > 0 && (
                        <div className="h-56 w-full bg-gray-200 relative group cursor-pointer" onClick={() => setFullscreenImage(gallery[currentImgIndex])}>
                          <img 
                              src={gallery[currentImgIndex]} 
                              className="w-full h-full object-cover transition-transform duration-500" 
                              alt="Event" 
                              loading="lazy"
                          />
                          
                          {/* Carousel Controls */}
                          {hasGallery && (
                              <>
                                <button 
                                    onClick={(e) => handleCarousel(action.id, 'prev', gallery.length, e)}
                                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <ChevronLeft size={20} />
                                </button>
                                <button 
                                    onClick={(e) => handleCarousel(action.id, 'next', gallery.length, e)}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <ChevronRight size={20} />
                                </button>
                                {/* Dots */}
                                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                                    {gallery.map((_, idx) => (
                                      <div key={idx} className={`w-1.5 h-1.5 rounded-full shadow-sm ${idx === currentImgIndex ? 'bg-white' : 'bg-white/50'}`}></div>
                                    ))}
                                </div>
                              </>
                          )}

                          <button 
                              className="absolute bottom-2 right-2 bg-black/50 hover:bg-black/70 p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                              <Maximize2 size={18} />
                          </button>
                        </div>
                      )}
                      <div className="p-4">
                        <div className="flex justify-between items-start">
                          <h4 className="font-bold text-lg text-gray-900 leading-tight flex-1 mr-2">{action.title}</h4>
                          {/* Time Badge (Sorting indicator) */}
                          <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1 whitespace-nowrap">
                              <Clock size={10} /> {action.date === 'AGORA!' ? 'AO VIVO' : 'Em breve'}
                          </span>
                        </div>
                        
                        <div className="mt-3 space-y-2 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Calendar size={16} className="text-red-600" />
                            <span>{action.date}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin size={16} className="text-red-600" />
                            <span>{action.location} {action.region && <span className="text-gray-400">({action.region})</span>}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users size={16} className="text-red-600" />
                            <span>
                                {attendanceState[action.id] ? action.confirmedCount + 1 : action.confirmedCount} confirmados • Organizado por {action.organizer}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex gap-2 mt-4">
                          <button 
                            onClick={() => toggleAttendance(action.id)}
                            className={`flex-1 py-2.5 rounded-full font-bold transition-all flex items-center justify-center gap-2 ${attendanceState[action.id] ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-900 text-white hover:bg-black'}`}
                          >
                            {attendanceState[action.id] ? <CheckCircle2 size={18} /> : null}
                            {attendanceState[action.id] ? 'Presença Confirmada' : 'Eu vou!'}
                          </button>
                          <button 
                            onClick={() => toggleSaveAction(action.id)}
                            className={`px-4 border border-gray-300 rounded-full font-bold transition-colors flex items-center justify-center ${savedActions[action.id] ? 'bg-blue-50 text-blue-600 border-blue-200' : 'text-gray-700 hover:bg-gray-50'}`}
                            title={savedActions[action.id] ? "Salvo" : "Salvar evento"}
                          >
                            <Bookmark size={20} fill={savedActions[action.id] ? "currentColor" : "none"} className={savedActions[action.id] ? "text-blue-600" : "text-gray-500"} />
                          </button>
                          {action.lat && action.lng && (
                              <button 
                                onClick={() => onNavigateToMap(action.lat!, action.lng!)}
                                className="px-4 border border-gray-300 rounded-full font-bold text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center"
                                title="Ver local no mapa"
                              >
                                <MapPin size={20} className="text-red-600" />
                              </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Pagination Controls */}
                <div className="flex justify-between items-center mt-4">
                   <button 
                     onClick={() => setCurrentEventIndex(prev => Math.max(0, prev - 1))}
                     disabled={currentEventIndex === 0}
                     className="flex items-center gap-1 px-4 py-2 text-sm font-bold text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                   >
                     <ChevronLeft size={16} /> Anterior
                   </button>
                   <span className="text-xs font-bold text-gray-500">
                     {currentEventIndex + 1} de {displayedEvents.length}
                   </span>
                   <button 
                     onClick={() => setCurrentEventIndex(prev => Math.min(displayedEvents.length - 1, prev + 1))}
                     disabled={currentEventIndex === displayedEvents.length - 1}
                     className="flex items-center gap-1 px-4 py-2 text-sm font-bold text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                   >
                     Próximo <ChevronRight size={16} />
                   </button>
                </div>
                <div className="flex justify-center mt-2">
                   <button 
                     onClick={() => setViewMode('ALL')}
                     className="text-sm font-bold text-red-600 hover:underline"
                   >
                     Ver todos os eventos
                   </button>
                </div>
              </div>
            ) : displayedEvents.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                <Calendar size={48} className="mx-auto mb-2 text-gray-300" />
                <p>Nenhum evento encontrado com os filtros atuais.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-2">
                   <h3 className="font-bold text-gray-900">Todos os Eventos</h3>
                   <button 
                     onClick={() => { setViewMode('PAGINATED'); setCurrentEventIndex(0); }}
                     className="text-sm font-bold text-red-600 hover:underline"
                   >
                     Voltar para navegação
                   </button>
                </div>
                {displayedEvents.map(action => {
                  const gallery = action.gallery && action.gallery.length > 0 ? action.gallery : (action.image ? [action.image] : []);
                  const currentImgIndex = carouselIndices[action.id] || 0;
                  const hasGallery = gallery.length > 1;

                  return (
                  <div key={action.id} className="border border-gray-200 rounded-2xl overflow-hidden hover:shadow-md transition-shadow bg-white relative">
                    {/* Event Type Badge - Prominent */}
                    <div className="absolute top-3 left-3 z-10">
                      <div className={`shadow-md text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-2 ${action.type === 'PROTEST' ? 'bg-red-600' : 'bg-blue-600'}`}>
                          {action.type === 'PROTEST' ? <Megaphone size={14}/> : <Users size={14}/>}
                          {action.type === 'PROTEST' ? 'PROTESTO' : 'ENCONTRO'}
                      </div>
                    </div>

                    {gallery.length > 0 && (
                      <div className="h-56 w-full bg-gray-200 relative group cursor-pointer" onClick={() => setFullscreenImage(gallery[currentImgIndex])}>
                        <img 
                            src={gallery[currentImgIndex]} 
                            className="w-full h-full object-cover transition-transform duration-500" 
                            alt="Event" 
                            loading="lazy"
                        />
                        
                        {/* Carousel Controls */}
                        {hasGallery && (
                            <>
                              <button 
                                  onClick={(e) => handleCarousel(action.id, 'prev', gallery.length, e)}
                                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                  <ChevronLeft size={20} />
                              </button>
                              <button 
                                  onClick={(e) => handleCarousel(action.id, 'next', gallery.length, e)}
                                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                  <ChevronRight size={20} />
                              </button>
                              {/* Dots */}
                              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                                  {gallery.map((_, idx) => (
                                    <div key={idx} className={`w-1.5 h-1.5 rounded-full shadow-sm ${idx === currentImgIndex ? 'bg-white' : 'bg-white/50'}`}></div>
                                  ))}
                              </div>
                            </>
                        )}

                        <button 
                            className="absolute bottom-2 right-2 bg-black/50 hover:bg-black/70 p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <Maximize2 size={18} />
                        </button>
                      </div>
                    )}
                    <div className="p-4">
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-lg text-gray-900 leading-tight flex-1 mr-2">{action.title}</h4>
                        {/* Time Badge (Sorting indicator) */}
                        <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1 whitespace-nowrap">
                            <Clock size={10} /> {action.date === 'AGORA!' ? 'AO VIVO' : 'Em breve'}
                        </span>
                      </div>
                      
                      <div className="mt-3 space-y-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar size={16} className="text-red-600" />
                          <span>{action.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin size={16} className="text-red-600" />
                          <span>{action.location} {action.region && <span className="text-gray-400">({action.region})</span>}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users size={16} className="text-red-600" />
                          <span>
                              {attendanceState[action.id] ? action.confirmedCount + 1 : action.confirmedCount} confirmados • Organizado por {action.organizer}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 mt-4">
                        <button 
                          onClick={() => toggleAttendance(action.id)}
                          className={`flex-1 py-2.5 rounded-full font-bold transition-all flex items-center justify-center gap-2 ${attendanceState[action.id] ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-900 text-white hover:bg-black'}`}
                        >
                          {attendanceState[action.id] ? <CheckCircle2 size={18} /> : null}
                          {attendanceState[action.id] ? 'Presença Confirmada' : 'Eu vou!'}
                        </button>
                        <button 
                          onClick={() => toggleSaveAction(action.id)}
                          className={`px-4 border border-gray-300 rounded-full font-bold transition-colors flex items-center justify-center ${savedActions[action.id] ? 'bg-blue-50 text-blue-600 border-blue-200' : 'text-gray-700 hover:bg-gray-50'}`}
                          title={savedActions[action.id] ? "Salvo" : "Salvar evento"}
                        >
                          <Bookmark size={20} fill={savedActions[action.id] ? "currentColor" : "none"} className={savedActions[action.id] ? "text-blue-600" : "text-gray-500"} />
                        </button>
                        {action.lat && action.lng && (
                            <button 
                              onClick={() => onNavigateToMap(action.lat!, action.lng!)}
                              className="px-4 border border-gray-300 rounded-full font-bold text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center"
                              title="Ver local no mapa"
                            >
                              <MapPin size={20} className="text-red-600" />
                            </button>
                        )}
                      </div>
                    </div>
                  </div>
                )})}
              </div>
            )}
          </div>
        )}

        {/* TRUTH TAB (Fake News) */}
        {activeTab === 'TRUTH' && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-gradient-to-br from-yellow-50 to-white p-6 rounded-2xl border border-yellow-200">
               <h3 className="font-bold text-gray-900 text-lg mb-2 flex items-center gap-2">
                 <ShieldCheck className="text-green-600" /> Verdade na Rede
               </h3>
               <p className="text-sm text-gray-700 mb-4">
                 Combata a desinformação. Aqui você encontra checagens oficiais de notícias que circulam nos grupos.
               </p>
               <button className="w-full bg-black text-white py-2.5 rounded-full font-bold text-sm">
                 Enviar Notícia Suspeita
               </button>
            </div>

            <h4 className="font-bold text-gray-900 mt-4 px-1">Checagens Recentes</h4>
            <div className="space-y-4">
              {FACT_CHECK_DATA.map((fc) => (
                <div key={fc.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                   {/* Fake Part */}
                   <div className="bg-red-50 p-4 border-b border-red-100">
                      <div className="flex items-center gap-2 text-red-600 font-bold text-xs uppercase mb-1">
                         <AlertTriangle size={14} /> O que dizem (Fake)
                      </div>
                      <p className="font-bold text-gray-900 text-lg leading-tight">"{fc.fakeNews}"</p>
                   </div>
                   {/* Fact Part */}
                   <div className="bg-green-50 p-4">
                      <div className="flex items-center gap-2 text-green-700 font-bold text-xs uppercase mb-1">
                         <CheckCircle2 size={14} /> A Verdade (Fato)
                      </div>
                      <p className="text-gray-800 mb-3">{fc.fact}</p>
                      <div className="flex justify-between items-end text-xs text-gray-500">
                         <span>{fc.source}</span>
                         <span>{fc.date}</span>
                      </div>
                   </div>
                   <div className="p-2 bg-gray-50 border-t border-gray-100 flex justify-between px-4">
                      <button 
                        onClick={() => toggleSaveAction(fc.id)}
                        className={`font-bold text-sm flex items-center gap-2 ${savedActions[fc.id] ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600'}`}
                      >
                        <Bookmark size={16} fill={savedActions[fc.id] ? "currentColor" : "none"} />
                        {savedActions[fc.id] ? 'Salvo' : 'Salvar'}
                      </button>
                      <button className="text-blue-600 font-bold text-sm flex items-center gap-2">
                        Compartilhar Verdade
                      </button>
                   </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PETITIONS & POLLS TAB */}
        {activeTab === 'PETITIONS' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* Influencer Area */}
            <div className="bg-gradient-to-r from-red-50 to-white p-4 rounded-2xl border border-red-100">
               <div className="flex items-center gap-3 mb-2">
                 <div className="p-2 bg-red-600 rounded-full text-white"><Users size={20} /></div>
                 <h3 className="font-bold text-gray-900">Área da Liderança</h3>
               </div>
               <p className="text-sm text-gray-700 mb-3">
                 Mobilize sua base criando enquetes e abaixo-assinados.
               </p>
               <button 
                 onClick={() => { setCreationType('PETITION'); setShowPetitionModal(true); }}
                 className="flex items-center justify-center gap-2 w-full bg-red-600 text-white py-2 rounded-lg font-bold hover:bg-red-700 transition-colors shadow-sm"
               >
                 <Plus size={18} /> Criar Nova Petição / Enquete
               </button>
            </div>

            {/* Polls Section */}
            <div>
              <h3 className="font-bold text-lg text-gray-800 mb-3 flex items-center gap-2">
                <Vote size={20} className="text-blue-600"/> Enquetes da Comunidade
              </h3>
              <div className="space-y-4">
                {polls.map(poll => (
                  <div key={poll.id} className="border border-gray-200 rounded-2xl p-4 bg-white">
                    <div className="flex items-center gap-2 mb-2 text-xs text-gray-500">
                      <img src={poll.createdBy.avatar} className="w-5 h-5 rounded-full" />
                      <span className="font-bold">{poll.createdBy.name}</span> perguntou • {poll.timeLeft}
                    </div>
                    <h4 className="font-bold text-gray-900 mb-3 text-lg">{poll.question}</h4>
                    
                    <div className="space-y-2">
                      {poll.options.map(option => {
                        const isVoted = votedPolls[poll.id] === option.id;
                        const hasVotedAny = !!votedPolls[poll.id];
                        return (
                        <div 
                          key={option.id} 
                          onClick={() => handleVote(poll.id, option.id)}
                          className={`relative h-10 w-full rounded-lg overflow-hidden transition-colors ${hasVotedAny ? 'cursor-default' : 'cursor-pointer hover:bg-gray-200'} ${isVoted ? 'bg-blue-50 border border-blue-200' : 'bg-gray-100'}`}
                        >
                           {/* Progress Bar Background */}
                           {hasVotedAny && (
                             <div className={`absolute top-0 left-0 h-full transition-all duration-1000 ${isVoted ? 'bg-blue-200' : 'bg-gray-200'}`} style={{ width: `${option.percent}%` }}></div>
                           )}
                           
                           {/* Text Content */}
                           <div className="absolute inset-0 flex justify-between items-center px-4 z-10">
                              <span className={`font-medium text-sm ${isVoted ? 'text-blue-900 font-bold' : 'text-gray-900'}`}>{option.text}</span>
                              {hasVotedAny && <span className={`font-bold text-sm ${isVoted ? 'text-blue-900' : 'text-gray-900'}`}>{option.percent}%</span>}
                           </div>
                        </div>
                      )})}
                    </div>
                    <div className="mt-3 flex justify-between items-center text-xs text-gray-500">
                      <span>{poll.totalVotes.toLocaleString()} votos totais</span>
                      <button 
                        onClick={() => toggleSaveAction(poll.id)}
                        className={`flex items-center gap-1 font-bold transition-colors ${savedActions[poll.id] ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600'}`}
                      >
                        <Bookmark size={14} fill={savedActions[poll.id] ? "currentColor" : "none"} />
                        {savedActions[poll.id] ? 'Salvo' : 'Salvar'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Petitions Section */}
            <div>
              <h3 className="font-bold text-lg text-gray-800 mb-3 flex items-center gap-2">
                <FileText size={20} className="text-green-600"/> Petições em Alta
              </h3>
              <div className="space-y-4">
                {petitions.map(pet => (
                  <div key={pet.id} className="border border-gray-200 rounded-2xl p-4 bg-white">
                    <div className="flex items-center gap-2 mb-2">
                        <img src={pet.createdBy.avatar} className="w-6 h-6 rounded-full" />
                        <span className="text-xs font-bold text-gray-500">Criado por {pet.createdBy.name}</span>
                    </div>
                    <h4 className="font-bold text-lg text-gray-900">{pet.title}</h4>
                    <p className="text-sm text-gray-600 mt-1 mb-3">{pet.description}</p>
                    
                    {/* Attachments Section */}
                    {pet.attachments && pet.attachments.length > 0 && (
                       <div className="mb-4 space-y-2">
                          {pet.attachments.map((att, i) => (
                             <a key={i} href={att.url} className="flex items-center gap-3 p-2 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors group">
                                <div className="p-2 bg-white rounded-md border border-gray-100 text-gray-500 group-hover:text-red-600 transition-colors">
                                   {att.type === 'PDF' ? <FileText size={18} /> : <LinkIcon size={18} />}
                                </div>
                                <div className="flex-1 min-w-0">
                                   <div className="font-medium text-sm text-gray-900 truncate">{att.title}</div>
                                   <div className="text-xs text-gray-500">{att.type === 'PDF' ? 'Documento PDF' : 'Link Externo'}</div>
                                </div>
                                <Download size={16} className="text-gray-400 mr-1" />
                             </a>
                          ))}
                       </div>
                    )}

                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                        <div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${(pet.currentSignatures / pet.targetGoal) * 100}%` }}></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mb-4">
                        <span>{pet.currentSignatures.toLocaleString()} assinaturas</span>
                        <span>Meta: {pet.targetGoal.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex gap-2">
                       <button 
                         onClick={() => handleSignPetition(pet.id)}
                         disabled={signedPetitions[pet.id]}
                         className={`flex-1 border font-bold py-2 rounded-full transition-colors ${signedPetitions[pet.id] ? 'bg-gray-100 text-gray-500 border-gray-200 cursor-not-allowed' : 'border-gray-300 text-red-600 hover:bg-red-50'}`}
                       >
                           {signedPetitions[pet.id] ? 'Assinada' : 'Assinar Agora'}
                       </button>
                       <button 
                         onClick={() => toggleSaveAction(pet.id)}
                         className={`px-4 border border-gray-300 rounded-full font-bold transition-colors flex items-center justify-center ${savedActions[pet.id] ? 'bg-blue-50 text-blue-600 border-blue-200' : 'text-gray-700 hover:bg-gray-50'}`}
                         title={savedActions[pet.id] ? "Salvo" : "Salvar petição"}
                       >
                         <Bookmark size={20} fill={savedActions[pet.id] ? "currentColor" : "none"} className={savedActions[pet.id] ? "text-blue-600" : "text-gray-500"} />
                       </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* UNIVERSITY TAB */}
        {activeTab === 'UNI' && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
               <h3 className="font-bold text-blue-900 flex items-center gap-2">
                 <GraduationCap size={20} /> Conexão Universitária
               </h3>
               <p className="text-sm text-blue-800 mt-1">
                 Espaço exclusivo para diretórios acadêmicos e estudantes militantes.
               </p>
            </div>

            <div className="grid gap-3">
              {UNIVERSITY_DATA.map(uni => (
                <div key={uni.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-2xl hover:bg-gray-50 cursor-pointer bg-white">
                   <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                      <GraduationCap size={24} />
                   </div>
                   <div className="flex-1">
                      <h4 className="font-bold text-gray-900">{uni.name}</h4>
                      <p className="text-xs text-gray-500">{uni.university}</p>
                      <div className="flex items-center gap-1 mt-1">
                         <span className="bg-gray-100 text-gray-600 text-[10px] px-2 py-0.5 rounded font-bold">{uni.type}</span>
                         <span className="text-xs text-gray-400">• {uni.members}</span>
                      </div>
                   </div>
                   <button className="text-red-600 font-bold text-sm">Seguir</button>
                </div>
              ))}
            </div>
            
            <div className="mt-4 p-4 border border-gray-200 rounded-2xl bg-white">
              <h4 className="font-bold text-gray-900 mb-2">Agenda Estudantil</h4>
              <ul className="space-y-3">
                <li className="text-sm text-gray-600 flex gap-2">
                  <span className="font-bold text-gray-900 w-12">14 OUT</span>
                  Assembleia Geral dos Estudantes - UFMG
                </li>
                <li className="text-sm text-gray-600 flex gap-2">
                  <span className="font-bold text-gray-900 w-12">18 OUT</span>
                  Calourada Unificada - Praça da Estação
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* SOCIAL AID TAB (With Conte com a Gente) */}
        {activeTab === 'AID' && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
             
             {/* Conte com a Gente Section */}
             <div className="bg-red-900 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                   <HandHeart size={100} />
                </div>
                <div className="relative z-10">
                   <h3 className="font-bold text-2xl mb-2">Conte com a Gente</h3>
                   <p className="text-red-100 mb-4 text-sm max-w-xs">
                     Canais diretos de suporte para a militância e comunidade. Você não está sozinho.
                   </p>
                   <div className="grid grid-cols-2 gap-3">
                      <button className="bg-white/10 hover:bg-white/20 border border-white/20 p-3 rounded-xl flex flex-col items-center gap-2 transition-colors">
                         <Scale className="text-white" size={24} />
                         <span className="text-xs font-bold">Suporte Jurídico</span>
                      </button>
                      <button className="bg-white/10 hover:bg-white/20 border border-white/20 p-3 rounded-xl flex flex-col items-center gap-2 transition-colors">
                         <Phone className="text-white" size={24} />
                         <span className="text-xs font-bold">Denúncias</span>
                      </button>
                   </div>
                </div>
             </div>

             <div className="bg-green-50 p-4 rounded-2xl border border-green-100 mb-4 mt-2">
                <div className="flex items-center gap-2 mb-2">
                   <CheckCircle2 className="text-green-700" size={24} />
                   <h3 className="font-bold text-green-800 text-lg">Rede de Solidariedade</h3>
                </div>
                <p className="text-sm text-green-800">
                  Acesso rápido a informações sobre benefícios sociais e pontos de apoio em Betim.
                </p>
             </div>

             <h3 className="font-bold text-gray-800">Serviços e Informações</h3>
             <div className="grid gap-3">
                {SOCIAL_AID_DATA.map(item => (
                   <div key={item.id} className="p-4 border border-gray-200 rounded-2xl hover:border-red-200 transition-colors bg-white">
                      <div className="flex justify-between items-start">
                         <h4 className="font-bold text-gray-900">{item.title}</h4>
                         {item.type === 'BOLSA_FAMILIA' && <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded font-bold">Importante</span>}
                      </div>
                      <p className="text-sm text-gray-600 mt-1 mb-3">{item.description}</p>
                      <button className="text-sm font-bold text-red-600 flex items-center gap-1 hover:underline">
                         Acessar <TrendingUp size={14} />
                      </button>
                   </div>
                ))}
             </div>

             <div className="mt-6 border-t border-gray-100 pt-4">
                <h3 className="font-bold text-gray-900 mb-2">Precisa de ajuda imediata?</h3>
                <div className="flex gap-2">
                   <button className="flex-1 bg-red-600 text-white py-3 rounded-lg font-bold text-sm shadow-sm hover:bg-red-700">
                      Solicitar Cesta Básica
                   </button>
                   <button className="flex-1 bg-white border border-gray-300 text-gray-700 py-3 rounded-lg font-bold text-sm hover:bg-gray-50">
                      Ver Pontos no Mapa
                   </button>
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">
                   Suas informações são mantidas em sigilo pela coordenação de assistência.
                </p>
             </div>
          </div>
        )}
      </div>

      {/* FULLSCREEN IMAGE MODAL */}
      {fullscreenImage && (
         <div className="fixed inset-0 bg-black/90 z-[60] flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={() => setFullscreenImage(null)}>
            <button className="absolute top-4 right-4 text-white p-2 hover:bg-white/20 rounded-full" onClick={() => setFullscreenImage(null)}>
               <X size={32} />
            </button>
            <img src={fullscreenImage} className="max-w-full max-h-full object-contain rounded-lg" onClick={(e) => e.stopPropagation()} loading="lazy" />
         </div>
      )}

      {/* CREATE EVENT MODAL */}
      {showEventModal && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={() => setShowEventModal(false)}>
           <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl relative" onClick={(e) => e.stopPropagation()}>
              <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-900" onClick={() => setShowEventModal(false)}>
                <X size={24} />
              </button>
              
              <h3 className="text-xl font-bold text-gray-900 mb-1">Criar Novo Evento</h3>
              <p className="text-sm text-gray-500 mb-6">Organize a militância na sua região.</p>
              
              <div className="space-y-4">
                 <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Título do Evento</label>
                    <input type="text" value={newEventTitle} onChange={e => setNewEventTitle(e.target.value)} className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-red-600 focus:outline-none" placeholder="Ex: Ato na Praça X" />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Data</label>
                        <input type="date" value={newEventDate} onChange={e => setNewEventDate(e.target.value)} className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-red-600 focus:outline-none" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Horário</label>
                        <input type="time" value={newEventTime} onChange={e => setNewEventTime(e.target.value)} className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-red-600 focus:outline-none" />
                    </div>
                 </div>
                 <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Local</label>
                    <input type="text" value={newEventLocation} onChange={e => setNewEventLocation(e.target.value)} className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-red-600 focus:outline-none" placeholder="Endereço ou ponto de referência" />
                 </div>
                 
                 <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Descrição</label>
                    <textarea rows={3} value={newEventDescription} onChange={e => setNewEventDescription(e.target.value)} className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-red-600 focus:outline-none" placeholder="Detalhes do evento..."></textarea>
                 </div>
                 
                 {/* Upload Multiple Images UI Mock */}
                 <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Imagens (Carrossel)</label>
                    <div className="flex gap-2 mb-2">
                      <input 
                        type="text" 
                        value={currentImageInput}
                        onChange={(e) => setCurrentImageInput(e.target.value)}
                        className="flex-1 border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-red-600 focus:outline-none text-sm"
                        placeholder="Cole a URL da imagem..."
                      />
                      <button 
                        onClick={handleAddImage}
                        className="bg-gray-900 text-white p-2.5 rounded-lg hover:bg-black transition-colors"
                      >
                        <Plus size={20} />
                      </button>
                    </div>
                    
                    {newEventImages.length > 0 ? (
                      <div className="flex gap-2 overflow-x-auto pb-2">
                        {newEventImages.map((img, idx) => (
                          <div key={idx} className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border border-gray-200 group">
                             <img src={img} className="w-full h-full object-cover" />
                             <button 
                               onClick={() => setNewEventImages(newEventImages.filter((_, i) => i !== idx))}
                               className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                             >
                               <X size={12} />
                             </button>
                          </div>
                        ))}
                        <div className="w-20 h-20 flex-shrink-0 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400">
                           <span className="text-xs">{newEventImages.length} fotos</span>
                        </div>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center bg-gray-50">
                          <span className="text-sm text-gray-500">Nenhuma imagem adicionada</span>
                      </div>
                    )}
                 </div>

                 <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Tipo de Evento</label>
                    <div className="flex gap-2">
                       <button onClick={() => setNewEventType('PROTEST')} className={`flex-1 py-2 border rounded-lg font-bold text-sm transition-colors ${newEventType === 'PROTEST' ? 'border-red-600 bg-red-50 text-red-600' : 'border-gray-300 bg-white text-gray-600 hover:bg-gray-50'}`}>Protesto</button>
                       <button onClick={() => setNewEventType('MEETING')} className={`flex-1 py-2 border rounded-lg font-bold text-sm transition-colors ${newEventType === 'MEETING' ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-gray-300 bg-white text-gray-600 hover:bg-gray-50'}`}>Encontro</button>
                    </div>
                 </div>
                 
                 <button className="w-full bg-red-600 text-white py-3 rounded-full font-bold hover:bg-red-700 transition-colors mt-2" onClick={handleCreateEvent}>
                    Publicar Evento
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* CREATE PETITION/POLL MODAL */}
      {showPetitionModal && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={() => setShowPetitionModal(false)}>
           <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl relative" onClick={(e) => e.stopPropagation()}>
              <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-900" onClick={() => setShowPetitionModal(false)}>
                <X size={24} />
              </button>
              
              <div className="flex border-b border-gray-200 mb-6">
                 <button 
                   className={`flex-1 pb-3 text-sm font-bold transition-colors border-b-2 ${creationType === 'PETITION' ? 'border-red-600 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                   onClick={() => setCreationType('PETITION')}
                 >
                   Nova Petição
                 </button>
                 <button 
                   className={`flex-1 pb-3 text-sm font-bold transition-colors border-b-2 ${creationType === 'POLL' ? 'border-red-600 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                   onClick={() => setCreationType('POLL')}
                 >
                   Nova Enquete
                 </button>
              </div>

              {creationType === 'PETITION' ? (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                    <p className="text-sm text-gray-500 -mt-2 mb-2">Crie uma mobilização para sua causa com coleta de assinaturas.</p>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Título</label>
                        <input type="text" value={newPetitionTitle} onChange={e => setNewPetitionTitle(e.target.value)} className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-red-600 focus:outline-none" placeholder="Ex: Reforma da Escola X" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Descrição</label>
                        <textarea rows={3} value={newPetitionDescription} onChange={e => setNewPetitionDescription(e.target.value)} className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-red-600 focus:outline-none" placeholder="Explique o motivo..."></textarea>
                    </div>
                    
                    {/* Add Attachment Section */}
                    <div>
                       <label className="block text-sm font-bold text-gray-700 mb-1 flex items-center gap-2">
                         Anexar Documento ou Link 
                         <span className="bg-blue-100 text-blue-800 text-[10px] px-2 py-0.5 rounded-full uppercase">Líderes Verificados</span>
                       </label>
                       <div className="flex gap-2 mb-2">
                          <select 
                            value={currentAttachmentType}
                            onChange={(e) => setCurrentAttachmentType(e.target.value as 'PDF' | 'LINK')}
                            className="border border-gray-300 rounded-lg p-2.5 bg-white text-sm"
                          >
                            <option value="LINK">Link</option>
                            <option value="PDF">PDF</option>
                          </select>
                          <input 
                            type="text" 
                            value={currentAttachmentInput}
                            onChange={(e) => setCurrentAttachmentInput(e.target.value)}
                            className="flex-1 border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-red-600 focus:outline-none text-sm" 
                            placeholder="URL do documento..." 
                          />
                          <button 
                            onClick={handleAddAttachment}
                            className="bg-gray-100 hover:bg-gray-200 p-2.5 rounded-lg border border-gray-300"
                          >
                             <Plus size={20} className="text-gray-600" />
                          </button>
                       </div>

                       {newPetitionAttachments.length > 0 && (
                         <div className="space-y-2 bg-gray-50 p-3 rounded-lg border border-gray-100">
                            {newPetitionAttachments.map((att, idx) => (
                              <div key={idx} className="flex items-center justify-between bg-white p-2 rounded border border-gray-200">
                                 <div className="flex items-center gap-2 overflow-hidden">
                                    {att.type === 'PDF' ? <FileText size={16} className="text-red-500" /> : <LinkIcon size={16} className="text-blue-500" />}
                                    <span className="text-xs text-gray-700 truncate max-w-[200px]">{att.title}</span>
                                 </div>
                                 <button 
                                   onClick={() => setNewPetitionAttachments(newPetitionAttachments.filter((_, i) => i !== idx))}
                                   className="text-gray-400 hover:text-red-600"
                                 >
                                   <X size={14} />
                                 </button>
                              </div>
                            ))}
                         </div>
                       )}
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Meta de Assinaturas</label>
                        <input type="number" value={newPetitionGoal} onChange={e => setNewPetitionGoal(e.target.value)} className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-red-600 focus:outline-none" placeholder="1000" />
                    </div>
                    
                    <button className="w-full bg-red-600 text-white py-3 rounded-full font-bold hover:bg-red-700 transition-colors mt-2" onClick={handleCreatePetition}>
                        Criar Petição
                    </button>
                </div>
              ) : (
                <div className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-300">
                    <p className="text-sm text-gray-500 -mt-2 mb-2">Faça perguntas à comunidade e veja os resultados em tempo real.</p>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Pergunta</label>
                        <input type="text" value={newPollQuestion} onChange={e => setNewPollQuestion(e.target.value)} className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-red-600 focus:outline-none" placeholder="Ex: Qual a prioridade do bairro?" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Opções de Resposta</label>
                        <div className="space-y-2">
                           <input type="text" value={newPollOptions[0]} onChange={e => setNewPollOptions([e.target.value, newPollOptions[1], newPollOptions[2]])} className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-red-600 focus:outline-none" placeholder="Opção 1" />
                           <input type="text" value={newPollOptions[1]} onChange={e => setNewPollOptions([newPollOptions[0], e.target.value, newPollOptions[2]])} className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-red-600 focus:outline-none" placeholder="Opção 2" />
                           <input type="text" value={newPollOptions[2]} onChange={e => setNewPollOptions([newPollOptions[0], newPollOptions[1], e.target.value])} className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-red-600 focus:outline-none" placeholder="Opção 3 (Opcional)" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Duração</label>
                        <select value={newPollDuration} onChange={e => setNewPollDuration(e.target.value)} className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-red-600 focus:outline-none">
                           <option value="24 horas">24 horas</option>
                           <option value="3 dias">3 dias</option>
                           <option value="1 semana">1 semana</option>
                        </select>
                    </div>
                    
                    <button className="w-full bg-blue-600 text-white py-3 rounded-full font-bold hover:bg-blue-700 transition-colors mt-2" onClick={handleCreatePoll}>
                        Lançar Enquete
                    </button>
                </div>
              )}
           </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded-full shadow-lg text-sm font-medium z-50 animate-in slide-in-from-bottom-5">
          {toastMessage}
        </div>
      )}
    </div>
  );
};