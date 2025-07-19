import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { 
  Menu, 
  Send, 
  Mic, 
  ChevronDown, 
  Zap, 
  Brain, 
  Sparkles, 
  Users, 
  Atom,
  Lock,
  MessageCircle,
  Plus,
  Edit3,
  Trash2,
  Loader2,
  X,
  Settings,
  User,
  LogOut,
  Search
} from 'lucide-react';





// API Base URL - Update this to match your backend
//const API_BASE_URL = "http://localhost:3000/api";
const API_BASE_URL = "https://fuznex.onrender.com/api";

// API Functions
const apiCall = async (endpoint, options = {}) => {
  // Using session storage instead of localStorage for demo
  const token = sessionStorage.getItem('authToken');
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} - ${response.statusText}`);
  }

  return response.json();
};

// Updated API functions to match your backend
const sendMessage = async (content, messages, threadId, assistantModel) => {
  return apiCall('/chat/message', {
    method: 'POST',
    body: JSON.stringify({
      content,
      messages,
      thread_id: threadId,
      assistant_model: assistantModel.toLowerCase()
    }),
  });
};

const getThreadMessages = async (threadId) => {
  return apiCall(`/chat/thread/${threadId}`);
};

const createThread = async (initialMessage, assistantName) => {
  return apiCall('/chat/threads', {
    method: 'POST',
    body: JSON.stringify({
      initialMessage,
      assistantName: assistantName.toLowerCase()
    }),
  });
};

const getThreads = async () => {
  return apiCall('/chat/threads');
};

const deleteThread = async (threadId) => {
  return apiCall(`/chat/thread/${threadId}`, {
    method: 'DELETE',
  });
};

const formatMessagesForAPI = (messages) => {
  return messages.map(msg => ({
    sender: msg.type === 'user' ? 'user' : 'ai',
    text: msg.content,
    content: msg.content
  }));
};

const FuzNexChatScreen = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [assistantSelectorOpen, setAssistantSelectorOpen] = useState(false);
  const [selectedAssistant, setSelectedAssistant] = useState('Groq');
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [inputHeight, setInputHeight] = useState("auto");
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [isFirstMessage, setIsFirstMessage] = useState(true);
  const [messages, setMessages] = useState([]);
  const [threads, setThreads] = useState([]);
  const [currentThread, setCurrentThread] = useState(null);
  const [editingThread, setEditingThread] = useState(null);
  const [newThreadTitle, setNewThreadTitle] = useState('');
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  
  const messageListRef = useRef(null);
  const inputRef = useRef(null);

  const assistants = [
    { name: 'Groq', icon: Zap, status: 'ready', color: 'text-purple-400' },
    { name: 'OpenAI', icon: Brain, status: 'ready', color: 'text-green-400' },
    { name: 'Nexmind (Beta)', icon: Atom, status: 'not-ready', color: 'text-gray-400' },
    { name: 'Gemini', icon: Sparkles, status: 'not-ready', color: 'text-gray-400' },
    { name: 'Together AI', icon: Users, status: 'not-ready', color: 'text-gray-400' }
  ];

  // Check backend connection on mount
  useEffect(() => {
    checkBackendConnection();
  }, []);

  // Load threads on component mount
  useEffect(() => {
    if (isConnected) {
      loadThreads();
    }
  }, [isConnected]);

  // Check if backend is connected
  const checkBackendConnection = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/chat/threads`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        setIsConnected(true);
        setError(null);
      } else {
        throw new Error('Backend not responding');
      }
    } catch (err) {
      setIsConnected(false);
      setError('Unable to connect to backend server. Please try again or contact the developer');
      console.error('Backend connection error:', err);
    }
  };

  // Load threads from backend
  const loadThreads = async () => {
    if (!isConnected) return;
    
    try {
      const threadsData = await getThreads();
      setThreads(threadsData);
      
      // If we have threads, set the first one as current
      if (threadsData.length > 0 && !currentThread) {
        setCurrentThread(threadsData[0].id);
        loadMessages(threadsData[0].id);
      } else if (threadsData.length === 0) {
        // Show welcome message if no threads
        showWelcomeMessage();
      }
    } catch (err) {
      console.error('Error loading threads:', err);
      setError('Failed to load threads from backend');
    }
  };

  // Show welcome message for new users
  const showWelcomeMessage = () => {
    const welcomeMessage = {
      id: 'welcome-' + Date.now(),
      type: 'ai',
      content: `Hello! I'm your ${selectedAssistant} assistant. How can I help you today?`,
      timestamp: new Date(),
      assistant: selectedAssistant
    };
    setMessages([welcomeMessage]);
    setIsFirstMessage(true);
  };

  // Load messages for a thread
  const loadMessages = async (threadId) => {
    if (!threadId || !isConnected) return;
    
    setIsLoadingMessages(true);
    try {
      const messagesData = await getThreadMessages(threadId);
      
      // Convert backend message format to frontend format
      const formattedMessages = messagesData.map(msg => ({
        id: msg.id || msg.chat_id,
        type: msg.sender === 'user' ? 'user' : 'ai',
        content: msg.encrypted_content || msg.message || msg.content,
        timestamp: new Date(msg.created_at),
        assistant: msg.assistant_model || selectedAssistant
      }));
      
      setMessages(formattedMessages);
      setIsFirstMessage(formattedMessages.length === 0);
    } catch (err) {
      console.error('Error loading messages:', err);
      setError('Failed to load messages from backend');
    } finally {
      setIsLoadingMessages(false);
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      const scrollHeight = inputRef.current.scrollHeight;
      const maxHeight = 100;
      const newHeight = Math.min(scrollHeight, maxHeight);
      setInputHeight(`${newHeight}px`);
    }
  }, [inputText]);

  // Send message handler
  const sendMessageHandler = async () => {
    const trimmed = (inputText || "").trimEnd();
    if (!trimmed || isLoading || !isConnected) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // If no current thread, create a new one
      if (!currentThread) {
        const newThreadData = await createThread(trimmed, selectedAssistant);
        const newThread = newThreadData.thread;
        
        // Add the new thread to the list
        setThreads(prev => [newThread, ...prev]);
        setCurrentThread(newThread.id);
        
        // Load messages for the new thread (which should include the first message and AI response)
        await loadMessages(newThread.id);
        setInputText('');
        setIsLoading(false);
        return;
      }
      
      // Create user message immediately for UI feedback
      const userMessage = {
        id: Date.now(),
        type: 'user',
        content: trimmed,
        timestamp: new Date(),
        assistant: selectedAssistant
      };
      
      setMessages(prev => [...prev, userMessage]);
      setInputText('');
      setIsFirstMessage(false);
      
      // Prepare messages for API call - use the correct format
      const apiMessages = formatMessagesForAPI(messages);
      
      // Send message to backend
      const response = await sendMessage(
        trimmed,
        apiMessages,
        currentThread,
        selectedAssistant
      );
      
      // Add AI response to messages
      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: response.reply,
        timestamp: new Date(),
        assistant: selectedAssistant
      };
      
      setMessages(prev => [...prev, aiMessage]);
      
      // Update thread last message
      setThreads(prev => prev.map(t => 
        t.id === currentThread ? { 
          ...t, 
          lastMessage: trimmed.slice(0, 50) + (trimmed.length > 50 ? '...' : ''),
          timestamp: new Date() 
        } : t
      ));
      
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message. Please check connection.');
      
      // Remove the user message if sending failed
      setMessages(prev => prev.filter(msg => msg.id !== Date.now()));
    } finally {
      setIsLoading(false);
    }
  };

  const selectAssistant = (assistant) => {
    if (assistant.status === 'ready') {
      setSelectedAssistant(assistant.name);
      setAssistantSelectorOpen(false);
      
      // Update welcome message if no current thread
      if (!currentThread && messages.length > 0 && messages[0].id?.toString().startsWith('welcome-')) {
        showWelcomeMessage();
      }
    }
  };

  const createNewThread = async () => {
    try {
      // Reset state for new thread
      setMessages([]);
      setCurrentThread(null);
      setIsFirstMessage(true);
      setSidebarOpen(false);
      setError(null);
      
      // Show initial AI message
      showWelcomeMessage();
      
    } catch (err) {
      console.error('Error creating new thread:', err);
      setError('Failed to create new thread');
    }
  };

  const deleteThreadHandler = async (threadId) => {
    if (!isConnected) return;
    
    try {
      await deleteThread(threadId);
      
      // Remove thread from local state
      setThreads(prev => prev.filter(t => t.id !== threadId));
      
      // If we deleted the current thread, switch to another or create new
      if (currentThread === threadId) {
        const remainingThreads = threads.filter(t => t.id !== threadId);
        if (remainingThreads.length > 0) {
          setCurrentThread(remainingThreads[0].id);
          loadMessages(remainingThreads[0].id);
        } else {
          setCurrentThread(null);
          setMessages([]);
          setIsFirstMessage(true);
          showWelcomeMessage();
        }
      }
    } catch (err) {
      console.error('Error deleting thread:', err);
      setError('Failed to delete thread from backend');
    }
  };

  const updateThreadTitle = (threadId, newTitle) => {
    setThreads(prev => prev.map(t => 
      t.id === threadId ? { ...t, title: newTitle } : t
    ));
    setEditingThread(null);
  };

  const switchThread = async (threadId) => {
    setCurrentThread(threadId);
    setSidebarOpen(false);
    await loadMessages(threadId);
  };

  const filteredThreads = threads.filter(thread => 
    (thread.title || 'New Chat').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (thread.lastMessage || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]);

  const AssistantIcon = ({ assistant }) => {
    const assistantData = assistants.find(a => a.name === assistant);
    if (!assistantData) return null;
    const Icon = assistantData.icon;
    return <Icon className={`w-4 h-4 ${assistantData.color}`} />;
  };

  return (
    <div
      className="w-full max-w-sm h-screen mx-auto flex flex-col text-white relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #0a0a0c 40%, #1e1e24 70%, #0a0a0c 100%)',
        maxWidth: '375px',
        height: '719px',
      }}
    >
      {/* Connection Status */}
      {!isConnected && (
        <div className="absolute top-[105px] left-4 right-4 bg-amber-500 bg-opacity-20 border border-amber-500 border-opacity-50 rounded-lg p-3 z-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-amber-300 font-medium">Connection Lost..!</p>
              <p className="text-xs text-amber-200">Retry or wait for a while</p>
            </div>
            <button 
              onClick={checkBackendConnection}
              className="text-amber-300 hover:text-amber-100 text-sm underline"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="absolute top-[120px] left-4 right-4 bg-red-500 bg-opacity-20 border border-red-500 border-opacity-50 rounded-lg p-3 z-50 mt-16">
          <p className="text-sm text-red-300">{error}</p>
          <button 
            onClick={() => setError(null)}
            className="absolute top-[-5px] right-[-12px] text-red-300 hover:text-red-100 bg-transparent"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="absolute inset-0 bg-black opacity-50 z-20"
          style={{ backdropFilter: 'blur(4px)' }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className="absolute left-0 top-0 h-full w-72 border-r border-white border-opacity-10 transform transition-transform duration-300 z-30 bg-transparent-100" style={{
        backdropFilter: 'blur(60px)',
        transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)'
      }}>
        <div className=" p-4 h-full  flex flex-col">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between mb-4 flex-shrink-0">
            <h2 className="text-lg font-bold mb-5 mt-5 text-white-400">
              Chat Threads
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={createNewThread}
                disabled={!isConnected}
                className="p-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
              >
                <Plus className="w-4 h-4" />
              </button>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 bg-white bg-opacity-10 rounded-lg hover:bg-opacity-20 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-4 flex-shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search threads..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 focus:border-transparent text-sm"
              />
            </div>
          </div>
          
          {/* Connection Status in Sidebar */}
          <div className="mb-4 flex-shrink-0">
            <div className={`flex items-center space-x-2 text-xs px-2 py-1 rounded ${
              isConnected ? 'text-green-400' : 'text-red-400'
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                isConnected ? 'bg-green-400' : 'bg-red-400'
              }`}></div>
              <span>{isConnected ? 'Connected' : 'Offline/Error Connecting'}</span>
            </div>
          </div>
          
          {/* Threads List - Only scrollable part */}
          <div className="flex-1 overflow-y-auto space-y-2" style={{ scrollbarWidth: 'thin' }}>
            {filteredThreads.length === 0 ? (
              <div className="text-center text-gray-400 text-sm py-8">
                {isConnected ? 'No threads yet. Start a conversation!' : 'Connect to server to load threads'}
              </div>
            ) : (
              filteredThreads.map((thread) => (
                <div
                  key={thread.id}
                  className={`p-3 rounded-lg border transition-all cursor-pointer ${
                    currentThread === thread.id
                      ? 'bg-purple-600 bg-opacity-20 border-purple-500 border-opacity-50'
                      : 'bg-white bg-opacity-5 border-white border-opacity-10 hover:bg-white hover:bg-opacity-10 hover:border-opacity-20'
                  }`}
                  onClick={() => isConnected && switchThread(thread.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 flex-1">
                      <AssistantIcon assistant={thread.assistant_used || selectedAssistant} />
                      <div className="flex-1 min-w-0">
                        {editingThread === thread.id ? (
                          <input
                            type="text"
                            value={newThreadTitle}
                            onChange={(e) => setNewThreadTitle(e.target.value)}
                            onBlur={() => updateThreadTitle(thread.id, newThreadTitle)}
                            onKeyPress={(e) => e.key === 'Enter' && updateThreadTitle(thread.id, newThreadTitle)}
                            className="w-full bg-transparent border-none outline-none text-white text-sm"
                            autoFocus
                          />
                        ) : (
                                <h3 className="font-medium text-sm truncate text-white">
                                  {(thread.title?.length > 40 ? thread.title.slice(0, 40) + '…' : thread.title) || 'New Chat'}
                                </h3>
                              )}
                              <p className="text-xs text-gray-400 truncate">
                                {(thread.lastMessage?.length > 40 ? thread.lastMessage.slice(0, 30) + '…' : thread.lastMessage)  || 'No messages yet'}
                              </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingThread(thread.id);
                          setNewThreadTitle(thread.title || 'New Chat');
                        }}
                        className="p-1 hover:bg-white hover:bg-opacity-10 rounded transition-colors"
                        disabled={!isConnected}
                      >
                        <Edit3 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteThreadHandler(thread.id);
                        }}
                        className="p-1 hover:bg-red-500 hover:bg-opacity-20 rounded transition-colors"
                        disabled={!isConnected}
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div
        className="flex-1 flex flex-col mt-3 h-full overflow-hidden"
        style={{
          background: 'radial-gradient(circle at 30% 30%, #101213 10%, #0c0a0c 40%, #0a0a0c 90%, #0a0a0c 70%, #0d1117 100%)',
        }}
      >
        {/* Chat Header */}
        <div className="px-4 py-4 flex-shrink-0 border-b border-white/10 bg-transparent">
          <div className="absolute top-[101px] left-0 w-full h-[1.5px] bg-gradient-to-r from-transparent via-[#2f2f2f] to-transparent" />
          <div className="flex items-center justify-between ">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 bg-white bg-opacity-5 hover:bg-opacity-10 rounded-lg transition-colors"
              style={{ backdropFilter: 'blur(10px)' }}
            >
              <Menu className="w-5 h-5" />
            </button>
            
            <div className="flex flex-col items-center">
              <h1 className="text-lg font-bold text-white mb-1">
                NexMind(Beta)
              </h1>
              <button
                onClick={() => setAssistantSelectorOpen(true)}
                className="flex items-center space-x-2 text-xs text-gray-400 hover:text-white transition-colors bg-white bg-opacity-5 px-2 py-1 rounded-full"
                style={{ backdropFilter: 'blur(10px)' }}
              >
                <AssistantIcon assistant={selectedAssistant} />
                <span>{selectedAssistant}</span>
                <ChevronDown className="w-3 h-3" />
              </button>
            </div>
            
            <div className="w-9"></div>
          </div>
        </div>

        {/* Assistant Selector Modal */}
        {assistantSelectorOpen && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 p-4" style={{ backdropFilter: 'blur(4px)' }}>
            <div className="rounded-xl p-4 max-w-xs w-full border border-white border-opacity-10" style={{
              background: 'linear-gradient(135deg, rgba(45, 27, 85, 0.45), rgba(26, 20, 46, 0.75), rgba(45, 27, 105, 0.25))',
              backdropFilter: 'blur(20px)'
            }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-purple-300">
                  Select Assistant
                </h2>
                <button
                  onClick={() => setAssistantSelectorOpen(false)}
                  className="p-1 hover:bg-white hover:bg-opacity-10 rounded transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <div className="space-y-2">
                {assistants.map((assistant) => {
                  const Icon = assistant.icon;
                  return (
                    <button
                      key={assistant.name}
                      onClick={() => selectAssistant(assistant)}
                      disabled={assistant.status !== 'ready'}
                      className={`w-full p-3 rounded-lg border transition-all flex items-center justify-between ${
                        assistant.status === 'ready'
                          ? 'bg-white bg-opacity-5 border-white border-opacity-10 hover:bg-opacity-10 hover:border-opacity-20 cursor-pointer'
                          : 'bg-white bg-opacity-15 border-white border-opacity-5 cursor-not-allowed opacity-50'
                      }`}
                      style={{
                        backdropFilter: 'blur(10px)',
                        ...(selectedAssistant === assistant.name && {
                          background: 'linear-gradient(45deg, rgba(139, 92, 246, 0.1), rgba(168, 85, 247, 0.1))',
                          borderColor: 'rgba(139, 92, 246, 0.5)'
                        })
                      }}
                    >
                      <div className="flex items-center space-x-2">
                        <Icon className={`w-4 h-4 ${assistant.color}`} />
                        <span className="font-medium text-sm">{assistant.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {assistant.status !== 'ready' && (
                          <>
                            <Lock className="w-3 h-3 text-gray-500" />
                            <span className="text-xs text-gray-500">Not Ready</span>
                          </>
                        )}
                        {assistant.status === 'ready' && selectedAssistant === assistant.name && (
                          <div className="w-2 h-2 bg-purple-400 rounded-full shadow-lg" style={{ boxShadow: '0 0 10px rgba(139, 92, 246, 0.5)' }}></div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Messages Area - Only scrollable part */}
        <div 
          ref={messageListRef}
          className="flex-1 overflow-y-auto p-4 space-y-4"
          style={{ 
            background: 'linear-gradient(135deg, rgba(26, 26, 46, 0.5), rgba(22, 33, 62, 0.5), rgba(26, 26, 46, 0.5))',
            scrollbarWidth: 'thin'
          }}
        >
          {isLoadingMessages && (
            <div className="flex justify-center">
              <div className="flex items-center space-x-2">
                <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
                <span className="text-sm text-gray-300">Loading messages...</span>
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-xs lg:max-w-md ${msg.type === 'user' ? 'ml-auto' : 'mr-auto'}`}>
                {msg.type === 'ai' && (
                  <div className="flex items-center space-x-2 mb-2 px-1">
                    {(() => {
                        const capitalized =
                          msg.assistant?.charAt(0).toUpperCase() + msg.assistant?.slice(1).toLowerCase();
                        return (
                          <>
                            <AssistantIcon assistant={capitalized} />
                            <span className="text-xs text-gray-400 font-medium">{capitalized}</span>
                          </>
                        );
                      })()}

                  </div>
                )}
                <div className={`rounded-2xl px-4 py-3 text-sm break-words ${
                  msg.type === 'user'
                    ? 'text-white rounded-br-md'
                    : 'text-gray-100 border border-white border-opacity-20 rounded-bl-md'
                }`} style={{
                  background: msg.type === 'user' 
                    ? 'linear-gradient(45deg, #8b5cf6, #6366f1)'
                    : 'rgba(75, 85, 99, 0.5)',
                  backdropFilter: msg.type === 'ai' ? 'blur(10px)' : 'none',
                  boxShadow: msg.type === 'user' ? '0 4px 12px rgba(139, 92, 246, 0.3)' : '0 2px 8px rgba(0, 0, 0, 0.1)'
                }}>
                <ReactMarkdown
    remarkPlugins={[remarkGfm]}
    rehypePlugins={[rehypeRaw]}
    components={{
      p: ({ node, ...props }) => (
        <p className="text-sm leading-relaxed text-gray-200  leading-[1.7]" {...props} />
      ),
      strong: ({ node, ...props }) => (
        <strong className="font-bold text-white-400 leading-[2.7]" {...props} />
      ),
      em: ({ node, ...props }) => (
        <em className="italic text-white-300 " {...props} />
      ),
      code: ({ node, ...props }) => (
        <code className="bg-gray-800 px-1 py-0.5 rounded text-xs text-white-200 font-mono" {...props} />
      ),
      ul: ({ node, ...props }) => (
        <ul className="list-disc ml-6 text-sm" {...props} />
      ),
      li: ({ node, ...props }) => (
        <li className="mb-1" {...props} />
      ),
      h1: ({ node, ...props }) => (
        <h1 className="text-2xl font-bold mt-2 mb-1 text-white-300" {...props} />
      ),
      h2: ({ node, ...props }) => (
        <h2 className="text-lg font-semibold mt-1 mb-1 text-gray-100 " {...props} />
      ),
      a: ({ node, ...props }) => (
        <a className="text-blue-400 underline" target="_blank" rel="noreferrer" {...props} />
      ),
    }}
  >
    {msg.content}
  </ReactMarkdown>


                </div>
               
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-xs lg:max-w-md mr-auto">
                <div className="flex items-center space-x-2 mb-2 px-1">
                  <AssistantIcon assistant={selectedAssistant} />
                  <span className="text-xs text-gray-400 font-medium">{selectedAssistant}</span>
                </div>
                <div className="rounded-2xl rounded-bl-md px-4 py-3 border border-white border-opacity-20" style={{  background: 'rgba(75, 85, 99, 0.5)',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                }}>
                  <p className="text-sm leading-relaxed animate-pulse text-gray-300">
                    Thinking...
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
{/* Chat Input Bar - Fixed at bottom */}
<div className="relative px-4 pt-2 pb-[2.3rem] bg-transparent backdrop-blur-10">
  {/* Decorative Top Line */}
  <div
    className="absolute top-0 left-0 w-full h-px"
    style={{
      background: 'linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.3), transparent)',
    }}
  />

  {/* Bottom Separator (above mic circle) */}
  <div className="absolute bottom-[1.8rem] left-0 w-full h-[1.5px] bg-gradient-to-r from-transparent via-[#ffffff33] to-transparent" />

  {/* Input Container */}
  <div
    className="flex gap-2 items-center rounded-xl px-3 py-2 border border-white border-opacity-20"
    style={{
      background: 'rgba(75, 85, 99, 0.3)',
      backdropFilter: 'blur(20px)',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
    }}
  >
    {/* Mic Button */}
    <button
      className="p-2 hover:bg-white hover:bg-opacity-10 rounded-full flex items-center justify-center transition-colors"
      onClick={() => setIsListening(!isListening)}
    >
      <Mic className={`w-4 h-4 ${isListening ? 'text-red-400' : 'text-purple-400'}`} />
    </button>

    {/* Text Input */}
    <textarea
      ref={inputRef}
      value={inputText}
      onChange={(e) => setInputText(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          sendMessageHandler();
        }
      }}
      placeholder="Ask something…"
      style={{
        height: inputHeight,
        scrollbarWidth: 'thin',
        resize: 'none',
      }}
      className="flex-1 overflow-y-auto text-sm bg-transparent placeholder-gray-400 outline-none pr-2 text-white"
      disabled={isLoading}
    />

    {/* Send Button */}
    <button
      onClick={sendMessageHandler}
      className="p-2 rounded-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all duration-200"
      style={{
        background: 'linear-gradient(45deg, #8b5cf6, #6366f1)',
        boxShadow: '0 5px 15px rgba(139, 92, 246, 0.25)',
      }}
      disabled={!inputText.trim() || isLoading}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-white" />
      ) : (
        <Send className="w-4 h-4 text-white" />
      )}
    </button>
  </div>
</div>

      </div>
    </div>
  );
};

export default FuzNexChatScreen;