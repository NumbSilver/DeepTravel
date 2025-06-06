import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {Message} from '../store/chatStore';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({message}) => {
  return (
    <View
      style={[
        styles.messageContainer,
        message.isUser ? styles.userMessage : styles.aiMessage,
      ]}>
      <View
        style={[
          styles.messageBubble,
          message.isUser ? styles.userBubble : styles.aiBubble,
        ]}>
        {!message.isUser && message.reasoning && (
          <View style={styles.reasoningContainer}>
            <Text style={styles.reasoningLabel}>正在思考中...</Text>
            <Text style={styles.reasoningText}>{message.reasoning}</Text>
          </View>
        )}
        <Text
          style={[
            styles.messageText,
            message.isUser ? styles.userMessageText : styles.aiMessageText,
          ]}>
          {message.text}
        </Text>
      </View>
      <Text style={styles.timestamp}>
        {message.timestamp.toLocaleTimeString()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  messageContainer: {
    marginBottom: 16,
    maxWidth: '80%',
  },
  userMessage: {
    alignSelf: 'flex-end',
  },
  aiMessage: {
    alignSelf: 'flex-start',
  },
  messageBubble: {
    borderRadius: 16,
    padding: 12,
    marginBottom: 4,
  },
  userBubble: {
    backgroundColor: '#3a8ee6',
  },
  aiBubble: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#eee',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  userMessageText: {
    color: '#fff',
  },
  aiMessageText: {
    color: '#333',
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  reasoningContainer: {
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  reasoningLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  reasoningText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
  },
});
