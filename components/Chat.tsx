import React, { useState, useEffect, useRef } from 'react';
import { collection, query, where, onSnapshot, addDoc, serverTimestamp, orderBy, getDocs } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { Send, Users, MessageSquare } from 'lucide-react';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: any;
}

const handleFirestoreError = (error: unknown, operationType: OperationType, path: string | null) => {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
};

export const Chat = () => {
  const [chats, setChats] = useState<any[]>([]);
  const [activeChat, setActiveChat] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [users, setUsers] = useState<any[]>([]);
  const [showNewChat, setShowNewChat] = useState(false);
  const [showNewGroup, setShowNewGroup] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentUser = auth.currentUser;

  useEffect(() => {
    if (!currentUser) return;

    // Fetch users for new chat in real-time
    const qUsers = query(collection(db, 'users'));
    const unsubscribeUsers = onSnapshot(qUsers, (snapshot) => {
      const usersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).filter(u => u.id !== currentUser.uid);
      setUsers(usersData);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'users');
    });

    // Listen to user's chats
    const qChats = query(
      collection(db, 'chats'),
      where('participants', 'array-contains', currentUser.uid)
    );

    const unsubscribeChats = onSnapshot(qChats, (snapshot) => {
      const chatsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setChats(chatsData);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'chats');
    });

    return () => {
      unsubscribeUsers();
      unsubscribeChats();
    };
  }, [currentUser]);

  useEffect(() => {
    if (!activeChat) return;

    const q = query(
      collection(db, `chats/${activeChat.id}/messages`),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMessages(msgs);
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, `chats/${activeChat.id}/messages`);
    });

    return () => unsubscribe();
  }, [activeChat]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChat || !currentUser) return;

    const text = newMessage.trim();
    setNewMessage('');

    try {
      await addDoc(collection(db, `chats/${activeChat.id}/messages`), {
        chatId: activeChat.id,
        senderId: currentUser.uid,
        senderName: currentUser.displayName || 'Usuário',
        text,
        timestamp: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `chats/${activeChat.id}/messages`);
    }
  };

  const startDirectChat = async (otherUserId: string) => {
    if (!currentUser) return;
    
    // Check if chat already exists
    const existingChat = chats.find(c => c.type === 'direct' && c.participants.includes(otherUserId));
    if (existingChat) {
      setActiveChat(existingChat);
      setShowNewChat(false);
      return;
    }

    try {
      const docRef = await addDoc(collection(db, 'chats'), {
        type: 'direct',
        participants: [currentUser.uid, otherUserId],
        createdAt: serverTimestamp(),
        createdBy: currentUser.uid
      });
      setActiveChat({ id: docRef.id, type: 'direct', participants: [currentUser.uid, otherUserId] });
      setShowNewChat(false);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'chats');
    }
  };

  const createGroupChat = async () => {
    if (!currentUser || !groupName.trim() || selectedUsers.length === 0) return;

    try {
      const participants = [currentUser.uid, ...selectedUsers];
      const docRef = await addDoc(collection(db, 'chats'), {
        type: 'group',
        name: groupName.trim(),
        participants,
        createdAt: serverTimestamp(),
        createdBy: currentUser.uid
      });
      setActiveChat({ id: docRef.id, type: 'group', name: groupName.trim(), participants });
      setShowNewGroup(false);
      setGroupName('');
      setSelectedUsers([]);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'chats');
    }
  };

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  const formatTime = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  if (!currentUser) return <div className="p-4">Faça login para acessar o chat.</div>;

  return (
    <div className="flex h-[calc(100vh-60px)] sm:h-screen bg-white">
      {/* Sidebar */}
      <div className={`w-full sm:w-1/3 border-r border-gray-200 flex flex-col ${activeChat ? 'hidden sm:flex' : 'flex'}`}>
        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-white">
          <h2 className="text-xl font-bold text-gray-900">Mensagens</h2>
          <div className="flex gap-2">
            <button onClick={() => { setShowNewGroup(true); setShowNewChat(false); }} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200" title="Novo Grupo">
              <Users size={20} className="text-gray-600" />
            </button>
            <button onClick={() => { setShowNewChat(true); setShowNewGroup(false); }} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200" title="Nova Conversa">
              <MessageSquare size={20} className="text-gray-600" />
            </button>
          </div>
        </div>

        {showNewGroup ? (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
              <span className="font-bold">Novo Grupo</span>
              <button onClick={() => { setShowNewGroup(false); setGroupName(''); setSelectedUsers([]); }} className="text-red-600 text-sm">Cancelar</button>
            </div>
            <div className="p-4 border-b border-gray-100">
              <input 
                type="text" 
                placeholder="Nome do Grupo" 
                value={groupName}
                onChange={e => setGroupName(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-600"
              />
            </div>
            <div className="flex-1 overflow-y-auto">
              {users.length === 0 ? (
                <div className="p-8 text-center text-gray-500 text-sm">
                  Nenhum outro usuário encontrado. Peça para um colega acessar o app!
                </div>
              ) : (
                users.map(user => (
                  <div key={user.id} onClick={() => toggleUserSelection(user.id)} className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`} className="w-10 h-10 rounded-full" alt={user.name} />
                      <span className="font-bold text-gray-900">{user.name}</span>
                    </div>
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${selectedUsers.includes(user.id) ? 'bg-red-600 border-red-600' : 'border-gray-300'}`}>
                      {selectedUsers.includes(user.id) && <span className="text-white text-xs">✓</span>}
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="p-4 border-t border-gray-200">
              <button 
                onClick={createGroupChat}
                disabled={!groupName.trim() || selectedUsers.length === 0}
                className="w-full bg-red-600 text-white font-bold py-2 rounded-full disabled:opacity-50"
              >
                Criar Grupo ({selectedUsers.length})
              </button>
            </div>
          </div>
        ) : showNewChat ? (
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
              <span className="font-bold">Nova Conversa</span>
              <button onClick={() => setShowNewChat(false)} className="text-red-600 text-sm">Cancelar</button>
            </div>
            {users.length === 0 ? (
              <div className="p-8 text-center text-gray-500 text-sm">
                Nenhum outro usuário encontrado. Peça para um colega acessar o app!
              </div>
            ) : (
              users.map(user => (
                <div key={user.id} onClick={() => startDirectChat(user.id)} className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer flex items-center gap-3">
                  <img src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`} className="w-10 h-10 rounded-full" alt={user.name} />
                  <span className="font-bold text-gray-900">{user.name}</span>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto">
            {chats.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                Nenhuma conversa ainda. Comece uma nova!
              </div>
            ) : (
              chats.map(chat => {
                const isGroup = chat.type === 'group';
                const otherUserId = chat.participants.find((p: string) => p !== currentUser.uid);
                const otherUser = users.find(u => u.id === otherUserId);
                const chatName = isGroup ? chat.name : (otherUser?.name || 'Usuário');
                
                return (
                  <div 
                    key={chat.id} 
                    onClick={() => setActiveChat(chat)}
                    className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer flex items-center gap-3 ${activeChat?.id === chat.id ? 'bg-red-50' : ''}`}
                  >
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                      {isGroup ? <Users size={24} className="text-gray-500" /> : <img src={otherUser?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${otherUserId}`} className="w-full h-full object-cover" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 truncate">{chatName}</h3>
                      <p className="text-sm text-gray-500 truncate">{chat.lastMessage || 'Nova conversa'}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* Chat Area */}
      <div className={`w-full sm:w-2/3 flex flex-col ${!activeChat ? 'hidden sm:flex' : 'flex'}`}>
        {activeChat ? (
          <>
            <div className="p-4 border-b border-gray-200 bg-white flex items-center gap-3">
              <button className="sm:hidden text-gray-500 mr-2" onClick={() => setActiveChat(null)}>← Voltar</button>
              <h2 className="font-bold text-lg">
                {activeChat.type === 'group' ? activeChat.name : 'Conversa Direta'}
              </h2>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
              {messages.map(msg => {
                const isMe = msg.senderId === currentUser.uid;
                return (
                  <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] rounded-2xl p-3 ${isMe ? 'bg-red-600 text-white rounded-br-none' : 'bg-white border border-gray-200 text-gray-900 rounded-bl-none'}`}>
                      {!isMe && activeChat.type === 'group' && <div className="text-xs font-bold text-red-600 mb-1">{msg.senderName}</div>}
                      <p className="text-sm">{msg.text}</p>
                      <div className={`text-[10px] mt-1 text-right ${isMe ? 'text-red-200' : 'text-gray-400'}`}>
                        {formatTime(msg.timestamp)}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-200 flex gap-2">
              <input 
                type="text" 
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                placeholder="Digite uma mensagem..." 
                className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:border-red-600"
              />
              <button type="submit" disabled={!newMessage.trim()} className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 disabled:opacity-50">
                <Send size={20} className="ml-1" />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500 bg-gray-50">
            <MessageSquare size={48} className="mb-4 text-gray-300" />
            <p>Selecione uma conversa ou inicie uma nova</p>
          </div>
        )}
      </div>
    </div>
  );
};
