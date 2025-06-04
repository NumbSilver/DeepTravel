import {Message} from '../store/chatStore';

// 添加必要的类型定义
declare global {
  interface Response {
    body: ReadableStream<Uint8Array> | null;
  }

  interface ReadableStream<R> {
    getReader(): ReadableStreamDefaultReader<R>;
  }

  interface ReadableStreamDefaultReader<R> {
    read(): Promise<ReadableStreamReadResult<R>>;
    releaseLock(): void;
  }

  interface ReadableStreamReadResult<R> {
    done: boolean;
    value: R;
  }
}

const API_BASE_URL = 'http://localhost:3000/api';

export const chatService = {
  // 非流式对话
  async sendMessage(messages: Message[]): Promise<Message> {
    try {
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: messages.map(msg => ({
            role: msg.isUser ? 'user' : 'assistant',
            content: msg.text,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();
      return {
        id: Date.now().toString(),
        text: data.content,
        isUser: false,
        timestamp: new Date(),
      };
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },

  // 流式对话
  sendMessageStream(
    messages: Message[],
    onData: (data: {content?: string; reasoning?: string}) => void,
    onComplete: () => void,
    onError: (error: Error) => void,
  ) {
    console.log('开始发送流式请求');

    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${API_BASE_URL}/chat/stream`);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Accept', 'text/event-stream');

    let buffer = '';

    xhr.onprogress = () => {
      const newData = xhr.responseText.slice(buffer.length);
      buffer = xhr.responseText;

      // 处理 SSE 格式的数据
      const lines = newData.split('\n');
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const jsonStr = line.slice(6); // 移除 'data: ' 前缀

          // 处理 [DONE] 标记
          if (jsonStr === '[DONE]') {
            console.log('收到结束标记');
            onComplete();
            return;
          }

          try {
            const data = JSON.parse(jsonStr);
            console.log('收到数据:', data);

            if (data.type === 'connected') {
              console.log('收到连接确认');
              continue;
            }

            // 将 content 和 reasoning 通过 onData 回调传递给 UI
            if (data.content || data.reasoning) {
              onData({content: data.content, reasoning: data.reasoning});
            }
          } catch (error) {
            console.error('解析数据错误:', error);
          }
        }
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        console.log('流式响应完成');
      } else {
        onError(new Error(`HTTP error! status: ${xhr.status}`));
      }
    };

    xhr.onerror = () => {
      console.error('流式请求错误');
      onError(new Error('Network error'));
    };

    xhr.send(
      JSON.stringify({
        messages: messages.map(msg => ({
          role: msg.isUser ? 'user' : 'assistant',
          content: msg.text,
        })),
      }),
    );
  },
};
