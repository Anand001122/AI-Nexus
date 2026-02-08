import React from 'react';
import { Plus, MessageSquare, Trash2, Clock, X } from 'lucide-react';
import { useChatStore } from '../../store/chatStore';

export const Sidebar: React.FC = () => {
    const {
        conversations,
        currentConversationId,
        setCurrentConversation,
        clearConversation,
        createConversation,
        selectedModels,
        isSidebarOpen,
        setSidebarOpen
    } = useChatStore();

    const conversationList = Object.values(conversations).sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );

    const handleNewChat = () => {
        createConversation(selectedModels[0] || 'gemini');
        setSidebarOpen(false); // Auto-close on new chat for focus
    };

    const handleSelectConv = (id: string) => {
        setCurrentConversation(id);
        setSidebarOpen(false); // Auto-close on selection
    };

    return (
        <>
            {/* Backdrop Overlay */}
            <div
                className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-500 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={() => setSidebarOpen(false)}
            />

            {/* Drawer */}
            <aside
                className={`fixed left-0 top-0 h-screen w-80 bg-[#050505] border-r border-white/5 flex flex-col z-50 transition-transform duration-500 ease-in-out shadow-[20px_0_50px_rgba(0,0,0,0.5)] ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                {/* Header / Close Button */}
                <div className="p-6 pt-2 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">
                            <MessageSquare className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-white font-black uppercase tracking-tighter text-lg italic">Nexus <span className="text-blue-500">History</span></span>
                    </div>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="p-2 hover:bg-white/5 rounded-xl text-white/40 hover:text-white transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* New Chat Button */}
                <div className="px-6 pb-6">
                    <button
                        onClick={handleNewChat}
                        className="w-full py-4 px-4 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold flex items-center justify-center space-x-3 transition-all transform hover:scale-[1.02] active:scale-95 shadow-[0_0_20px_rgba(37,99,235,0.2)]"
                    >
                        <Plus className="h-5 w-5" />
                        <span>New Nexus Chat</span>
                    </button>
                </div>

                {/* History List */}
                <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2 custom-scrollbar">
                    <div className="flex items-center space-x-2 px-2 mb-4 text-white/30 uppercase tracking-[0.2em] text-[10px] font-black">
                        <Clock className="h-3 w-3" />
                        <span>Recent Intelligence</span>
                    </div>

                    {conversationList.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-40 text-center px-6">
                            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3">
                                <MessageSquare className="h-5 w-5 text-white/20" />
                            </div>
                            <p className="text-xs text-white/30 font-medium">No history yet. Start a session to capture insights.</p>
                        </div>
                    ) : (
                        conversationList.map((conv) => (
                            <div
                                key={conv.id}
                                className={`group flex items-center p-3 rounded-2xl cursor-pointer transition-all border ${currentConversationId === conv.id
                                    ? 'bg-white/10 border-white/10 shadow-lg'
                                    : 'bg-transparent border-transparent hover:bg-white/5'
                                    }`}
                                onClick={() => handleSelectConv(conv.id)}
                            >
                                <div className={`p-2 rounded-xl mr-3 ${currentConversationId === conv.id ? 'bg-blue-500/20 text-blue-400' : 'bg-white/5 text-white/40'
                                    }`}>
                                    <MessageSquare className="h-4 w-4" />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <p className={`text-sm font-semibold truncate ${currentConversationId === conv.id ? 'text-white' : 'text-white/60 group-hover:text-white/80'
                                        }`}>
                                        {conv.messages.find(m => m.isUser)?.content || 'New Session'}
                                    </p>
                                    <p className="text-[10px] text-white/30 font-mono mt-0.5">
                                        {conv.aiModel.split('/')[0]} • {new Date(conv.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        clearConversation(conv.id);
                                    }}
                                    className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-rose-500/20 hover:text-rose-400 text-white/20 rounded-lg transition-all ml-2"
                                    title="Clear Session"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer info */}
                <div className="p-6 border-t border-white/5 bg-black/40">
                    <div className="flex items-center justify-between text-[10px] font-bold text-white/20 uppercase tracking-widest">
                        <span>{conversationList.length} Sessions</span>
                        <span>v1.2.0</span>
                    </div>
                </div>
            </aside>
        </>
    );
};
