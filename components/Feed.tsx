import React, { useState, useMemo } from 'react';
import { Heart, MessageCircle, Repeat, Share2, Image as ImageIcon, Smile, MapPin, ArrowUpDown, X, Maximize2, Bookmark } from 'lucide-react';
import { MOCK_POSTS, CURRENT_USER } from '../constants';
import { Post } from '../types';

export const Feed: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const [newPostContent, setNewPostContent] = useState('');
  const [activeTab, setActiveTab] = useState<'FOR_YOU' | 'FOLLOWING' | 'NEWS'>('FOR_YOU');
  
  // States for new features
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
  const [sortByPopularity, setSortByPopularity] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const MOCK_NEWS = [
    {
      id: 'news1',
      title: 'Governo Federal anuncia novos investimentos do PAC em Minas Gerais',
      source: 'PT Brasil',
      time: '2h',
      content: 'Obras de infraestrutura e mobilidade urbana vão beneficiar mais de 2 milhões de mineiros na região metropolitana de Belo Horizonte.',
      image: 'https://picsum.photos/seed/pacmg/600/300',
      link: '#'
    },
    {
      id: 'news2',
      title: 'Bolsa Família alcança marca histórica de famílias atendidas no Vale do Jequitinhonha',
      source: 'Ministério do Desenvolvimento',
      time: '5h',
      content: 'Com o novo reajuste, o programa social garante segurança alimentar e dignidade para milhares de famílias na região.',
      image: 'https://picsum.photos/seed/bolsafamiliamg/600/300',
      link: '#'
    },
    {
      id: 'news3',
      title: 'Deputados do PT-MG aprovam projeto de proteção ambiental para a Serra do Curral',
      source: 'ALMG',
      time: '1d',
      content: 'A proposta visa barrar a mineração predatória e garantir a preservação de um dos maiores símbolos da capital mineira.',
      image: 'https://picsum.photos/seed/serradocurral/600/300',
      link: '#'
    }
  ];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Interaction handlers
  const handleLike = (e: React.MouseEvent, postId: string) => {
    e.stopPropagation();
    setPosts(posts.map(post => {
      if (post.id === postId) {
         const isLiked = !post.hasLiked;
         let count = parseMetric(post.likes);
         if (isLiked) count++; else count--;
         return { ...post, hasLiked: isLiked, likes: formatMetric(count) };
      }
      return post;
    }));
  };

  const handleRetweet = (e: React.MouseEvent, postId: string) => {
    e.stopPropagation();
    setPosts(posts.map(post => {
      if (post.id === postId) {
         const isRT = !post.hasRetweeted;
         let count = parseMetric(post.retweets);
         if (isRT) count++; else count--;
         return { ...post, hasRetweeted: isRT, retweets: formatMetric(count) };
      }
      return post;
    }));
  };

  const handleSave = (e: React.MouseEvent, postId: string) => {
    e.stopPropagation();
    setPosts(posts.map(post => post.id === postId ? { ...post, hasSaved: !post.hasSaved } : post));
  };

  // Helper to parse "10K", "1.5M" to numbers for sorting/calculating
  const parseMetric = (val: string): number => {
    if (!val) return 0;
    const n = parseFloat(val.replace(/[K,M]/g, '').replace(',', '.'));
    if (val.includes('M')) return n * 1000000;
    if (val.includes('K')) return n * 1000;
    return n;
  };

  const formatMetric = (val: number): string => {
    if (val >= 1000000) return (val / 1000000).toFixed(1).replace('.0', '') + 'M';
    if (val >= 1000) return (val / 1000).toFixed(1).replace('.0', '') + 'K';
    return val.toString();
  };

  // eslint-disable-next-line react-hooks/preserve-manual-memoization
  const displayedPosts = useMemo(() => {
    const list = [...posts];
    if (activeTab === 'FOR_YOU' && sortByPopularity) {
       list.sort((a, b) => {
          const scoreA = parseMetric(a.likes) + parseMetric(a.retweets) * 2 + parseMetric(a.comments);
          const scoreB = parseMetric(b.likes) + parseMetric(b.retweets) * 2 + parseMetric(b.comments);
          return scoreB - scoreA;
       });
    }
    return list;
  }, [posts, activeTab, sortByPopularity]);

  const handlePost = () => {
    if (!newPostContent.trim()) return;

    const newPost: Post = {
      id: Date.now().toString(),
      user: CURRENT_USER,
      content: newPostContent,
      timestamp: 'Agora',
      likes: '0',
      comments: '0',
      retweets: '0',
      views: '1',
    };

    setPosts([newPost, ...posts]);
    setNewPostContent('');
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    showToast('Link copiado para a área de transferência!');
  };

  return (
    <div className="flex-1 border-r border-gray-200 min-h-screen max-w-[600px] w-full relative bg-white">
      {/* Sticky Header with Tabs */}
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-md border-b border-gray-200">
        <div className="grid grid-cols-3 relative">
          <button 
            onClick={() => setActiveTab('FOR_YOU')}
            className="hover:bg-gray-100 transition-colors py-4 relative flex justify-center"
          >
            <span className={`font-bold text-sm ${activeTab === 'FOR_YOU' ? 'text-gray-900' : 'text-gray-500'}`}>
              Para você
            </span>
            {activeTab === 'FOR_YOU' && (
              <div className="absolute bottom-0 w-14 h-1 bg-red-600 rounded-full"></div>
            )}
          </button>
          <button 
             onClick={() => setActiveTab('FOLLOWING')}
             className="hover:bg-gray-100 transition-colors py-4 relative flex justify-center"
          >
            <span className={`font-bold text-sm ${activeTab === 'FOLLOWING' ? 'text-gray-900' : 'text-gray-500'}`}>
              Seguindo
            </span>
            {activeTab === 'FOLLOWING' && (
              <div className="absolute bottom-0 w-16 h-1 bg-red-600 rounded-full"></div>
            )}
          </button>
          <button 
             onClick={() => setActiveTab('NEWS')}
             className="hover:bg-gray-100 transition-colors py-4 relative flex justify-center"
          >
            <span className={`font-bold text-sm ${activeTab === 'NEWS' ? 'text-gray-900' : 'text-gray-500'}`}>
              Notícias
            </span>
            {activeTab === 'NEWS' && (
              <div className="absolute bottom-0 w-16 h-1 bg-red-600 rounded-full"></div>
            )}
          </button>
          
          {/* Sort Filter Toggle (Only for FOR YOU) */}
          {activeTab === 'FOR_YOU' && (
            <button 
              onClick={() => setSortByPopularity(!sortByPopularity)}
              className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-gray-200 transition-colors ${sortByPopularity ? 'text-red-600 bg-red-50' : 'text-gray-500'}`}
              title={sortByPopularity ? "Ordenado por relevância" : "Ordenar por mais populares"}
            >
              <ArrowUpDown size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Post Creator */}
      {activeTab !== 'NEWS' && (
        <div className="px-4 py-3 border-b border-gray-200 hidden sm:block">
          <div className="flex gap-4">
            <img 
              src={CURRENT_USER.avatar} 
              alt="Avatar" 
              className="w-10 h-10 rounded-full object-cover flex-shrink-0"
            />
            <div className="flex-1">
              <textarea
                className="w-full text-xl text-gray-900 placeholder-gray-500 focus:outline-none resize-none mt-2 bg-transparent leading-relaxed"
                placeholder="O que está acontecendo?"
                rows={2}
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
              />
              <div className="flex justify-between items-center mt-3 border-t border-gray-100 pt-3">
                <div className="flex gap-1 text-red-600">
                  <button className="p-2 hover:bg-red-50 rounded-full transition-colors"><ImageIcon size={18} /></button>
                  <button className="p-2 hover:bg-red-50 rounded-full transition-colors"><Smile size={18} /></button>
                  <button className="p-2 hover:bg-red-50 rounded-full transition-colors"><MapPin size={18} /></button>
                </div>
                <button 
                  onClick={handlePost}
                  disabled={!newPostContent.trim()}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-5 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm shadow-sm"
                >
                  Postar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Posts List */}
      {activeTab !== 'NEWS' ? (
        <div>
          {displayedPosts.map((post) => (
            <article key={post.id} className="px-4 py-3 border-b border-gray-200 hover:bg-gray-50/40 transition-colors cursor-pointer">
              {/* Repost Indicator */}
              {post.isRepost && (
                <div className="flex items-center gap-2 text-xs font-bold text-gray-500 mb-1.5 ml-8">
                   <Repeat size={12} />
                   <span>{post.repostUser} repostou</span>
                </div>
              )}
              
              <div className="flex gap-3">
                <img 
                  src={post.user.avatar} 
                  alt={post.user.name} 
                  className="w-10 h-10 rounded-full object-cover flex-shrink-0 hover:opacity-90 transition-opacity"
                />
                <div className="flex-1 min-w-0">
                  {/* Header Row */}
                  <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 overflow-hidden text-ellipsis whitespace-nowrap">
                        <span className="font-bold text-gray-900 hover:underline">{post.user.name}</span>
                        {post.user.isVerified && (
                           <svg viewBox="0 0 24 24" aria-label="Conta verificada" className="w-4 h-4 text-red-600 fill-current"><g><path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .495.083.965.238 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z"></path></g></svg>
                        )}
                        <span className="text-gray-500 text-sm truncate">{post.user.handle}</span>
                        <span className="text-gray-500 text-sm">·</span>
                        <span className="text-gray-500 text-sm hover:underline">{post.timestamp}</span>
                      </div>
                      <button className="text-gray-400 hover:text-red-600 transition-colors p-1 rounded-full hover:bg-red-50">
                          <X size={14} className="opacity-0 group-hover:opacity-100" />
                      </button>
                  </div>
  
                  {/* Content */}
                  <p className="text-gray-900 text-[15px] mt-1 whitespace-pre-wrap leading-normal">
                    {post.content}
                  </p>
                </div>
              </div>

              {/* Prominent Image Attachment */}
              {post.image && (
                <div className="mt-3 -mx-4 sm:mx-0 sm:rounded-2xl overflow-hidden border-y sm:border border-gray-200 group relative shadow-sm">
                   <img 
                    src={post.image} 
                    alt="Post attachment" 
                    onClick={(e) => {
                      e.stopPropagation();
                      setFullscreenImage(post.image || null);
                    }}
                    className="w-full max-h-[500px] object-cover hover:opacity-95 transition-opacity cursor-pointer"
                  />
                  <button 
                      className="absolute bottom-3 right-3 bg-black/60 hover:bg-black/80 p-1.5 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all duration-200 backdrop-blur-sm"
                      onClick={(e) => {
                          e.stopPropagation();
                          setFullscreenImage(post.image || null);
                      }}
                   >
                      <Maximize2 size={16} />
                   </button>
                </div>
              )}

              {/* Actions Footer */}
              <div className="flex justify-between mt-3 ml-12 pl-1 max-w-[425px] text-gray-500">
                <button className="group flex items-center gap-1 transition-colors hover:text-blue-500">
                  <div className="p-2 group-hover:bg-blue-50 rounded-full transition-colors">
                    <MessageCircle size={18} />
                  </div>
                  <span className="text-xs group-hover:text-blue-500 tabular-nums">{post.comments}</span>
                </button>
                    
                    <button 
                      onClick={(e) => handleRetweet(e, post.id)}
                      className={`group flex items-center gap-1 transition-colors ${post.hasRetweeted ? 'text-green-500' : 'hover:text-green-500'}`}
                    >
                      <div className={`p-2 rounded-full transition-colors ${post.hasRetweeted ? 'bg-green-50' : 'group-hover:bg-green-50'}`}>
                        <Repeat size={18} strokeWidth={post.hasRetweeted ? 2.5 : 2} />
                      </div>
                      <span className="text-xs tabular-nums">{post.retweets}</span>
                    </button>
  
                    <button 
                      onClick={(e) => handleLike(e, post.id)}
                      className={`group flex items-center gap-1 transition-colors ${post.hasLiked ? 'text-pink-600' : 'hover:text-pink-600'}`}
                    >
                      <div className={`p-2 rounded-full transition-colors ${post.hasLiked ? 'bg-pink-50' : 'group-hover:bg-pink-50'}`}>
                        <Heart size={18} fill={post.hasLiked ? "currentColor" : "none"} />
                      </div>
                      <span className="text-xs tabular-nums">{post.likes}</span>
                    </button>
  
                    <button 
                      onClick={(e) => handleSave(e, post.id)}
                      className={`group flex items-center gap-1 transition-colors ${post.hasSaved ? 'text-blue-500' : 'hover:text-blue-500'}`}
                    >
                       <div className={`p-2 rounded-full transition-colors ${post.hasSaved ? 'bg-blue-50' : 'group-hover:bg-blue-50'}`}>
                        <Bookmark size={18} fill={post.hasSaved ? "currentColor" : "none"} />
                      </div>
                    </button>
  
                    <button 
                      className="group flex items-center cursor-pointer hover:text-blue-500"
                      onClick={handleShare}
                    >
                      <div className="p-2 group-hover:bg-blue-50 rounded-full transition-colors">
                        <Share2 size={18} />
                      </div>
                    </button>
                  </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 min-h-screen">
          <div className="p-4 bg-white border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Notícias e Conquistas</h2>
            <p className="text-gray-500 text-sm mt-1">Acompanhe as ações do PT em Minas Gerais</p>
          </div>
          <div className="flex flex-col">
            {MOCK_NEWS.map((news) => (
              <article key={news.id} className="bg-white border-b border-gray-200 p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                      <span className="font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">{news.source}</span>
                      <span>·</span>
                      <span>{news.time}</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 leading-tight mb-2 hover:text-red-600 transition-colors">
                      {news.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                      {news.content}
                    </p>
                    <div className="flex items-center gap-4 text-gray-500">
                      <button className="flex items-center gap-1.5 hover:text-red-600 transition-colors text-xs font-medium">
                        <Share2 size={14} /> Compartilhar
                      </button>
                      <button className="flex items-center gap-1.5 hover:text-blue-600 transition-colors text-xs font-medium">
                        <Bookmark size={14} /> Salvar
                      </button>
                    </div>
                  </div>
                  <div className="w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 rounded-xl overflow-hidden border border-gray-100">
                    <img src={news.image} alt={news.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}

      {/* FULLSCREEN IMAGE MODAL */}
      {fullscreenImage && (
         <div className="fixed inset-0 bg-black/90 z-[60] flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={() => setFullscreenImage(null)}>
            <button className="absolute top-4 right-4 text-white p-2 hover:bg-white/20 rounded-full" onClick={() => setFullscreenImage(null)}>
               <X size={32} />
            </button>
            <img src={fullscreenImage} className="max-w-full max-h-full object-contain rounded-lg shadow-2xl" onClick={(e) => e.stopPropagation()} />
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