import React, {useState, useMemo} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

// Mock 数据类型
export interface Diary {
  id: string;
  date: Date;
  emotion: 'happy' | 'sad' | 'normal' | 'angry' | 'anxious';
  content: string;
}

const emotions = [
  {type: 'happy', icon: 'smile-o', color: '#43a047'},
  {type: 'anxious', icon: 'smile-o', color: '#039be5'},
  {type: 'normal', icon: 'meh-o', color: '#fbc02d'},
  {type: 'angry', icon: 'meh-o', color: '#8e24aa'},
  {type: 'sad', icon: 'frown-o', color: '#e53935'},
];

const DiaryScreen = () => {
  const [diaries, setDiaries] = useState<Diary[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEmotion, setSelectedEmotion] = useState<string>('');
  const [diaryContent, setDiaryContent] = useState('');
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // 获取日历数据
  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    // 获取当月第一天
    const firstDay = new Date(year, month, 1);
    // 获取当月最后一天
    const lastDay = new Date(year, month + 1, 0);

    // 获取当月第一天是星期几（0-6，0表示星期日）
    const firstDayWeek = firstDay.getDay();

    // 创建日历数组
    const days = [];

    // 添加上个月的日期
    for (let i = 0; i < firstDayWeek; i++) {
      const prevMonthLastDay = new Date(year, month, 0);
      const day = prevMonthLastDay.getDate() - firstDayWeek + i + 1;
      days.push({
        date: new Date(year, month - 1, day),
        isCurrentMonth: false,
      });
    }

    // 添加当月的日期
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push({
        date: new Date(year, month, i),
        isCurrentMonth: true,
      });
    }

    // 添加下个月的日期
    const remainingDays = 21 - days.length; // 只显示3周
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false,
      });
    }

    return days;
  }, [currentMonth]);

  // 切换月份
  const changeMonth = (offset: number) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + offset);
    setCurrentMonth(newMonth);
  };

  // 获取指定日期的日记
  const getDiaryForDate = (date: Date) => {
    return diaries.find(
      diary =>
        diary.date.getDate() === date.getDate() &&
        diary.date.getMonth() === date.getMonth() &&
        diary.date.getFullYear() === date.getFullYear(),
    );
  };

  const handleSaveDiary = () => {
    if (!selectedEmotion || !diaryContent) return;

    const newDiary: Diary = {
      id: Date.now().toString(),
      date: new Date(),
      emotion: selectedEmotion as Diary['emotion'],
      content: diaryContent,
    };
    setDiaries([newDiary, ...diaries]);
    setModalVisible(false);
    setSelectedEmotion('');
    setDiaryContent('');
  };

  const getEmotionIcon = (emotion: string) => {
    const emotionData = emotions.find(e => e.type === emotion);
    return emotionData ? emotionData.icon : 'face-meh';
  };

  const getEmotionColor = (emotion: string) => {
    const emotionData = emotions.find(e => e.type === emotion);
    return emotionData ? emotionData.color : '#fbc02d';
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>情绪日记</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}>
          <Icon name="book" size={16} color="#3a8ee6" />
          <Text style={styles.addButtonText}>写日记</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.calendarContainer}>
        <View style={styles.calendarHeader}>
          <TouchableOpacity onPress={() => changeMonth(-1)}>
            <Icon name="chevron-left" size={20} color="#666" />
          </TouchableOpacity>
          <Text style={styles.calendarMonth}>
            {currentMonth.toLocaleString('zh-CN', {
              year: 'numeric',
              month: 'long',
            })}
          </Text>
          <TouchableOpacity onPress={() => changeMonth(1)}>
            <Icon name="chevron-right" size={20} color="#666" />
          </TouchableOpacity>
        </View>
        <View style={styles.calendarWeekDays}>
          {['日', '一', '二', '三', '四', '五', '六'].map((day, index) => (
            <Text key={index} style={styles.calendarWeekDay}>
              {day}
            </Text>
          ))}
        </View>
        <View style={styles.calendar}>
          {calendarDays.map((day, index) => {
            const diary = getDiaryForDate(day.date);
            const isToday =
              new Date().toDateString() === day.date.toDateString();
            return (
              <View
                key={index}
                style={[
                  styles.calendarDay,
                  day.isCurrentMonth && styles.calendarDayCurrentMonth,
                  isToday && styles.calendarDayToday,
                  !day.isCurrentMonth && styles.calendarDayOtherMonth,
                ]}>
                <Icon
                  name={diary ? getEmotionIcon(diary.emotion) : 'cloud'}
                  size={20}
                  color={diary ? getEmotionColor(diary.emotion) : '#ccc'}
                />
                <Text
                  style={[
                    styles.calendarDayText,
                    day.isCurrentMonth && styles.calendarDayTextCurrentMonth,
                    isToday && styles.calendarDayTextToday,
                    !day.isCurrentMonth && styles.calendarDayTextOtherMonth,
                  ]}>
                  {day.date.getDate()}
                </Text>
              </View>
            );
          })}
        </View>
      </View>

      <ScrollView style={styles.diaryList}>
        {diaries.map(diary => (
          <View key={diary.id} style={styles.diaryItem}>
            <Icon
              name={getEmotionIcon(diary.emotion)}
              size={20}
              color={getEmotionColor(diary.emotion)}
            />
            <View style={styles.diaryContentContainer}>
              <Text style={styles.diaryContent}>{diary.content}</Text>
              <Text style={styles.diaryDate}>
                {new Date(diary.date).toLocaleDateString()}
              </Text>
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
            <Text style={styles.modalTitle}>写下你的今日心情</Text>
            <View style={styles.emotionSelector}>
              {emotions.map(emotion => (
                <TouchableOpacity
                  key={emotion.type}
                  style={[
                    styles.emotionButton,
                    selectedEmotion === emotion.type && styles.selectedEmotion,
                  ]}
                  onPress={() => setSelectedEmotion(emotion.type)}>
                  <Icon name={emotion.icon} size={24} color={emotion.color} />
                </TouchableOpacity>
              ))}
            </View>
            <TextInput
              style={styles.input}
              multiline
              placeholder="记录今天的心情和故事..."
              value={diaryContent}
              onChangeText={setDiaryContent}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setModalVisible(false)}>
                <Text style={styles.buttonText}>取消</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSaveDiary}>
                <Text style={[styles.buttonText, styles.saveButtonText]}>
                  保存
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
  calendarContainer: {
    backgroundColor: '#fff',
    marginTop: 12,
    marginHorizontal: 12,
    borderRadius: 10,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  calendarMonth: {
    fontSize: 16,
    fontWeight: '600',
  },
  calendarWeekDays: {
    flexDirection: 'row',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  calendarWeekDay: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    color: '#666',
    width: '12%',
  },
  calendar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: 4,
  },
  calendarDay: {
    width: '12%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    backgroundColor: '#f8f9fa',
  },
  calendarDayCurrentMonth: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  calendarDayToday: {
    backgroundColor: '#e3f2fd',
    borderWidth: 1,
    borderColor: '#3a8ee6',
  },
  calendarDayOtherMonth: {
    opacity: 0.5,
    backgroundColor: '#f8f9fa',
  },
  calendarDayText: {
    marginTop: 4,
    fontSize: 12,
  },
  calendarDayTextCurrentMonth: {
    color: '#333',
  },
  calendarDayTextToday: {
    color: '#3a8ee6',
    fontWeight: '600',
  },
  calendarDayTextOtherMonth: {
    color: '#999',
  },
  diaryList: {
    padding: 16,
  },
  diaryItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  diaryContentContainer: {
    flex: 1,
    marginLeft: 12,
  },
  diaryContent: {
    fontSize: 14,
    lineHeight: 20,
  },
  diaryDate: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
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
  emotionSelector: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  emotionButton: {
    padding: 12,
    borderRadius: 8,
  },
  selectedEmotion: {
    backgroundColor: '#e3f2fd',
  },
  input: {
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 6,
    padding: 12,
    minHeight: 100,
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

export default DiaryScreen;
