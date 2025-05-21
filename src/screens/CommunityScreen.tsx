import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Modal,
  TextInput,
} from 'react-native';
import {FontAwesome} from '@expo/vector-icons';
import {Post} from '../types';
import Icon from 'react-native-vector-icons/FontAwesome';

const CommunityScreen = () => {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      userId: '1',
      userName: '小明',
      userAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      content: '大家有没有推荐的考研资料？',
      image:
        'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
      createdAt: new Date(),
      likes: 12,
      comments: [
        {
          id: '1',
          userId: '2',
          userName: '小红',
          content: '我有电子版，私信你！',
          createdAt: new Date(),
        },
        {
          id: '2',
          userId: '3',
          userName: '阿伟',
          content: '推荐考研帮APP！',
          createdAt: new Date(),
        },
      ],
    },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [postContent, setPostContent] = useState('');
  const [selectedImage, setSelectedImage] = useState('');

  const handleCreatePost = () => {
    const newPost: Post = {
      id: Date.now().toString(),
      userId: '1',
      userName: '小明',
      userAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      content: postContent,
      image: selectedImage,
      createdAt: new Date(),
      likes: 0,
      comments: [],
    };
    setPosts([newPost, ...posts]);
    setModalVisible(false);
    setPostContent('');
    setSelectedImage('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>社区广场</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}>
          <Icon name="book" size={22} color="#3a8ee6" />
          <Text style={styles.addButtonText}>发帖</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.postList}>
        {posts.map(post => (
          <View key={post.id} style={styles.postCard}>
            <View style={styles.postHeader}>
              <Image source={{uri: post.userAvatar}} style={styles.avatar} />
              <View>
                <Text style={styles.userName}>{post.userName}</Text>
                <Text style={styles.postTime}>
                  {post.createdAt.toLocaleDateString()}
                </Text>
              </View>
            </View>
            <Text style={styles.postContent}>{post.content}</Text>
            {post.image && (
              <Image source={{uri: post.image}} style={styles.postImage} />
            )}
            <View style={styles.postActions}>
              <TouchableOpacity style={styles.actionButton}>
                <Icon name="book" size={22} color="#3a8ee6" />
                <Text style={styles.actionText}>{post.likes}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Icon name="book" size={22} color="#3a8ee6" />
                <Text style={styles.actionText}>{post.comments.length}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.comments}>
              {post.comments.map(comment => (
                <View key={comment.id} style={styles.comment}>
                  <Text style={styles.commentUser}>{comment.userName}：</Text>
                  <Text>{comment.content}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>发布新帖子</Text>
            <TextInput
              style={styles.input}
              multiline
              placeholder="说点什么吧..."
              value={postContent}
              onChangeText={setPostContent}
            />
            <TouchableOpacity
              style={styles.imageButton}
              onPress={() => {
                // 这里应该实现图片选择功能
                setSelectedImage(
                  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
                );
              }}>
              <Icon name="book" size={22} color="#3a8ee6" />
              <Text style={styles.imageButtonText}>添加图片</Text>
            </TouchableOpacity>
            {selectedImage && (
              <Image
                source={{uri: selectedImage}}
                style={styles.selectedImage}
              />
            )}
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setModalVisible(false)}>
                <Text style={styles.buttonText}>取消</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleCreatePost}>
                <Text style={[styles.buttonText, styles.saveButtonText]}>
                  发布
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f8fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    marginTop: 20,
    marginHorizontal: 12,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderWidth: 1,
    borderColor: '#3a8ee6',
    borderRadius: 6,
  },
  addButtonText: {
    color: '#3a8ee6',
    marginLeft: 4,
  },
  postList: {
    padding: 16,
  },
  postCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userName: {
    fontWeight: '600',
  },
  postTime: {
    fontSize: 12,
    color: '#888',
  },
  postContent: {
    marginBottom: 12,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },
  postActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  actionText: {
    marginLeft: 4,
    color: '#888',
  },
  comments: {
    marginTop: 12,
  },
  comment: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  commentUser: {
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 6,
    padding: 12,
    minHeight: 100,
    marginBottom: 16,
  },
  imageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#3a8ee6',
    borderRadius: 6,
    marginBottom: 16,
  },
  imageButtonText: {
    color: '#3a8ee6',
    marginLeft: 8,
  },
  selectedImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 6,
    marginHorizontal: 8,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#3a8ee6',
  },
  buttonText: {
    color: '#3a8ee6',
  },
  saveButtonText: {
    color: '#fff',
  },
});

export default CommunityScreen;
