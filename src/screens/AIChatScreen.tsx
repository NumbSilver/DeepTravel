import React, {useState, useCallback, useEffect, useRef} from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useChatStore} from '../store/chatStore';
import {ChatMessage} from '../components/ChatMessage';

const AIChatScreen = () => {
  const [inputText, setInputText] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);
  const {messages, isLoading, addMessage, setLoading, sendMessageStream} =
    useChatStore();

  useEffect(() => {
    // 添加欢迎消息
    if (messages.length === 0) {
      addMessage({
        id: '1',
        text: '你好！我是你的AI助手，有什么我可以帮你的吗？',
        isUser: false,
        timestamp: new Date(),
      });
    }
  }, [messages.length, addMessage]);

  const handleSend = async () => {
    if (!inputText.trim() || isLoading) return;

    const text = inputText.trim();
    setInputText('');
    await sendMessageStream(text);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContentContainer}
        showsVerticalScrollIndicator={true}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd()}>
        {messages.map(message => (
          <ChatMessage
            key={`${message.timestamp.getTime()}-${message.id}-cm`}
            message={message}
          />
        ))}
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#3a8ee6" />
          </View>
        )}
      </ScrollView>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="输入消息..."
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            (!inputText.trim() || isLoading) && styles.sendButtonDisabled,
          ]}
          onPress={handleSend}
          disabled={!inputText.trim() || isLoading}>
          <Icon
            name="send"
            size={20}
            color={inputText.trim() && !isLoading ? '#3a8ee6' : '#ccc'}
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f8fa',
  },
  messagesContainer: {
    flex: 1,
    padding: 16,
  },
  messagesContentContainer: {
    flexGrow: 1,
    paddingBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    backgroundColor: '#f6f8fa',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 100,
    marginRight: 8,
    fontSize: 16,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f6f8fa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  loadingContainer: {
    padding: 16,
    alignItems: 'center',
  },
});

export default AIChatScreen;
