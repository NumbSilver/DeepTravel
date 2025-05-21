import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import AIChatScreen from '../screens/AIChatScreen';
import DiaryScreen from '../screens/DiaryScreen';
import CommunityScreen from '../screens/CommunityScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

const AppNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName;

          if (route.name === 'AI Chat') {
            iconName = focused ? 'comments' : 'comments-o';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'user' : 'user-o';
          } else if (route.name === '情绪日记') {
            iconName = focused ? 'book' : 'book-o';
          } else if (route.name === '社区广场') {
            iconName = focused ? 'users' : 'users-o';
          }
          return <Icon name="book" size={22} color="#007AFF" />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        headerStyle: {
          backgroundColor: '#3a8ee6',
        },
        headerTintColor: '#fff',
      })}>
      <Tab.Screen name="AI Chat" component={AIChatScreen} />
      <Tab.Screen name="情绪日记" component={DiaryScreen} />
      <Tab.Screen name="社区广场" component={CommunityScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default AppNavigator;
