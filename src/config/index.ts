import Config from 'react-native-config';

export const API_URL = Config.API_URL || 'https://deeptravel.onrender.com';

export const API_ENDPOINTS = {
  CHAT: `${API_URL}/api/chat`,
  CHAT_STREAM: `${API_URL}/api/chat/stream`,
};
