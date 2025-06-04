import {create} from 'zustand';
import {chatService} from '../services/chatService';

export interface Message {
  id: string;
  text: string;
  reasoning?: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatState {
  messages: Message[];
  isLoading: boolean;
  addMessage: (message: Message) => void;
  setLoading: (loading: boolean) => void;
  clearMessages: () => void;
  sendMessage: (text: string) => Promise<void>;
  sendMessageStream: (text: string) => Promise<void>;
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  isLoading: false,
  addMessage: message =>
    set(state => ({
      messages: [...state.messages, message],
    })),
  setLoading: loading =>
    set(() => ({
      isLoading: loading,
    })),
  clearMessages: () =>
    set(() => ({
      messages: [],
    })),
  sendMessage: async (text: string) => {
    const {messages, addMessage, setLoading} = get();

    // 添加用户消息
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      isUser: true,
      timestamp: new Date(),
    };
    addMessage(userMessage);

    try {
      setLoading(true);
      const response = await chatService.sendMessage([
        ...messages,
        userMessage,
      ]);
      addMessage(response);
    } catch (error) {
      console.error('Error sending message:', error);
      // 可以在这里添加错误处理逻辑
    } finally {
      setLoading(false);
    }
  },
  sendMessageStream: async (text: string) => {
    const {messages, addMessage, setLoading} = get();

    // 添加用户消息
    const userMessage: Message = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      text,
      isUser: true,
      timestamp: new Date(),
    };
    addMessage(userMessage);

    // 创建AI响应消息
    const aiMessage: Message = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      text: '',
      reasoning: '',
      isUser: false,
      timestamp: new Date(),
    };
    addMessage(aiMessage);

    try {
      setLoading(true);
      await chatService.sendMessageStream(
        [...messages, userMessage],
        chunk => {
          // 更新AI消息
          set(state => ({
            messages: state.messages.map(msg =>
              msg.id === aiMessage.id
                ? {
                    ...msg,
                    text: msg.text + (chunk.content || ''),
                    reasoning: msg.reasoning + (chunk.reasoning || ''),
                  }
                : msg,
            ),
          }));
        },
        () => {
          setLoading(false);
        },
        error => {
          console.error('Stream error:', error);
          setLoading(false);
        },
      );
    } catch (error) {
      console.error('Error in stream:', error);
      setLoading(false);
    }
  },
}));
