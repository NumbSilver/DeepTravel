import axios from 'axios';
import {Message} from '../types';

const BASE_URL = 'https://ark.cn-beijing.volces.com/api/v3';
const API_KEY = 'yourkey';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${API_KEY}`,
  },
});

export const sendMessage = async (message: string): Promise<Message> => {
  try {
    const response = await api.post('/chat/completions', {
      messages: [{role: 'user', content: message}],
      model: 'deepseek-r1-250120',
    });

    return {
      _id: Date.now().toString(),
      text: response.data.choices[0].message.content,
      createdAt: new Date(),
      user: {
        _id: '2',
        name: 'AI助手',
        avatar: 'https://i.imgur.com/7k12EPD.png',
      },
    };
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};
