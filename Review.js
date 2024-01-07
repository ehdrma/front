//Review.js
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DrawerActions } from '@react-navigation/native';
import { Agenda } from 'react-native-calendars';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const Review = ({ navigation }) => {
  const [learningData, setLearningData] = useState({});

  const handleMenuPress = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  useEffect(() => {
    // AsyncStorage에서 학습 데이터 불러오기
    const fetchData = async () => {
      try {
        const storedData = await AsyncStorage.getItem('learningData');

        if (storedData) {
          const parsedData = JSON.parse(storedData);
          setLearningData(parsedData);
        }
      } catch (error) {
        console.error('학습 데이터 불러오기 오류:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const currentDate = new Date().toISOString().split('T')[0];
    console.log('현재 날짜:', currentDate);
  }, []);

  // Agenda 아이템을 렌더링하는 함수
  const renderAgendaItem = (item) => {
    return (
      <TouchableOpacity
        style={[styles.articleContainer, styles.roundedShadow]}
        onPress={() => {
          navigation.navigate('ReviewDetail', { article: item });
        }}
      >
        <Text style={styles.articleTitle}>{item.title}</Text>
        {item.translatedTitle && (
          <Text style={[styles.translatedTitle, { marginTop: 8 }]}>{item.translatedTitle}</Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Menu button */}
      <TouchableOpacity onPress={handleMenuPress} style={styles.menuButton}>
        <Image source={require('./assets/menu.png')} style={styles.menu} />
      </TouchableOpacity>

      {/* Scroll container below the menu */}
      <View style={styles.contentContainer}>
  <Agenda
    items={learningData}
    renderItem={renderAgendaItem}
    rowHasChanged={(r1, r2) => r1.title !== r2.title}
    locale={'ko'}
    style={[styles.agendaContainer, { height: '100%' }]}
    theme={{
      calendarBackground: '#ffffff', // 캘린더 배경색
      dayTextColor: '#000000', // 날짜 텍스트 색상
      textSectionTitleColor: '#939393', // 요일 날짜 글씨 크기
      todayTextColor: '#990011', // 오늘 날짜 텍스트 색상
      selectedDayTextColor: '#ffffff', // 선택된 날짜 텍스트 색상
      selectedDayBackgroundColor: '#990011',
      dotColor: '#990011',
      agendaDayTextColor: '#939393', // 날짜 글씨 색상
  agendaDayNumColor: '#939393', // 요일 글씨 색상
  agendaTodayColor: '#939393', // 당일 글씨 색상
  agendaKnobColor: '#990011',
  calendarBackground: '#FCF6F5',
  'stylesheet.calendar.header': {
    week: {marginBottom: 6,  flexDirection: 'row', justifyContent: 'space-between'},
    //day:{marginBottom: 10,  flexDirection: 'row', justifyContent: 'space-between'},
  },
    }}
    selected={new Date().toISOString().split('T')[0]} // 현재 날짜를 선택
  />
</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FCF6F5",
    //paddingHorizontal: windowWidth * 0.08,
    //paddingTop: windowHeight * 0.08,
    flexDirection: 'row'
  },
  menuButton: {
    position: 'absolute',
    top: windowHeight * 0.1,
    left: windowWidth * 0.1,
    zIndex: 1,
  },
  menu: {
    width: windowWidth * 0.09,
    height: windowHeight * 0.047,
  },
  contentContainer: {
    flex: 1,
    marginTop: windowHeight * 0.16,
    justifyContent: 'center',
    alignItems: 'center',
    //marginBottom: windowHeight * 0.07,
  },

  agendaContainer: {
    width: '100%', // 화면 가로에 꽉 차도록 설정
  },

  articleContainer: {

    top: windowHeight * 0.025,
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 8,
    marginTop: 8,
    width: windowWidth * 0.77,
    // marginBottom: 10,
  },
  articleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    //marginBottom: 5,
  },
  translatedTitle: {
    fontSize: 14,
    color: '#555',
  },
  roundedShadow: {
    borderRadius: 10,
    elevation: 5,
    marginBottom: 16,
    shadowColor: '#c8c8c8',
    shadowOffset: { width: 0, height: 0.5 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
});

export default Review;