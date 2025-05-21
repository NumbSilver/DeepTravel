import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

// Mock 数据类型
export interface User {
  id: string;
  name: string;
  avatar: string;
  grade: string;
  major: string;
}

export interface UserPost {
  id: string;
  content: string;
  createdAt: string;
}

// Mock 数据
const mockUser: User = {
  id: '1',
  name: '小美',
  avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
  grade: '大三',
  major: '计算机科学与技术',
};

const mockUserPosts: UserPost[] = [
  {
    id: '1',
    content: '大家有没有推荐的考研资料？',
    createdAt: '1小时前',
  },
];

const ProfileScreen = () => {
  const [user] = useState<User>(mockUser);
  const [posts] = useState<UserPost[]>(mockUserPosts);
  const [showSettings, setShowSettings] = useState(false);

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Image source={{uri: user.avatar}} style={styles.avatar} />
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.info}>
            {user.grade} · {user.major}
          </Text>
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>编辑资料</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>我的帖子</Text>
          {posts.map(post => (
            <View key={post.id} style={styles.postItem}>
              <Text style={styles.postContent}>{post.content}</Text>
              <Text style={styles.postTime}>{post.createdAt}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => setShowSettings(true)}>
            <Icon name="gear" size={20} color="#333" />
            <Text style={styles.settingText}>设置</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem}>
            <Icon name="circle-info" size={20} color="#333" />
            <Text style={styles.settingText}>关于</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem}>
            <Icon name="sign-out" size={20} color="#333" />
            <Text style={styles.settingText}>退出登录</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* 设置弹窗 */}
      <Modal
        visible={showSettings}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSettings(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>设置</Text>
            <TouchableOpacity style={styles.settingItem}>
              <Icon name="bell" size={20} color="#333" />
              <Text style={styles.settingText}>通知设置</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingItem}>
              <Icon name="lock" size={20} color="#333" />
              <Text style={styles.settingText}>隐私安全</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingItem}>
              <Icon name="palette" size={20} color="#333" />
              <Text style={styles.settingText}>主题切换</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.closeButton]}
              onPress={() => setShowSettings(false)}>
              <Text style={styles.buttonText}>返回</Text>
            </TouchableOpacity>
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
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginBottom: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  info: {
    color: '#888',
    fontSize: 14,
    marginBottom: 12,
  },
  editButton: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#3a8ee6',
    borderRadius: 6,
  },
  editButtonText: {
    color: '#3a8ee6',
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 12,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  postItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  postContent: {
    marginBottom: 4,
  },
  postTime: {
    fontSize: 12,
    color: '#888',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  settingText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#333',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginTop: 16,
  },
  closeButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#3a8ee6',
  },
  buttonText: {
    fontSize: 16,
    color: '#3a8ee6',
    textAlign: 'center',
  },
});

export default ProfileScreen;
