import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Review = () => {
  const [learningData, setLearningData] = useState([]);

  useEffect(() => {
    const fetchLearningData = async () => {
      try {
        // AsyncStorage에서 학습 데이터 불러오기
        const storedData = await AsyncStorage.getItem('learningData');
        const learningData = storedData ? JSON.parse(storedData) : {};
  
        // 학습 데이터가 배열인지 확인
        if (Array.isArray(learningData)) {
          // 필요한 작업 수행
          // 예: setLearningData(learningData);
        } else {
          console.error('learningData is not an array:', learningData);
        }
      } catch (error) {
        console.error('학습 데이터 불러오기 오류:', error);
      }
    };
  
    // 함수 호출
    fetchLearningData();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>학습 데이터 리뷰</Text>
      <ScrollView contentContainerStyle={styles.scrollViewContent} showsVerticalScrollIndicator={false}>
        {/* learningData를 기반으로 화면에 데이터를 렌더링하는 부분 */}
        {learningData.map((dateData, index) => (
          <View key={index} style={styles.dateContainer}>
            <Text style={styles.date}>{dateData.date}</Text>
            {dateData.data.map((learningItem, itemIndex) => (
              <View key={itemIndex} style={styles.learningItem}>
                <Text style={styles.learningTitle}>{learningItem.title}</Text>
                <Text style={styles.learningContent}>{learningItem.content}</Text>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCF6F5',
    padding: 25,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  scrollViewContent: {
    paddingBottom: 50, // 스크롤뷰의 하단 여백
  },
  dateContainer: {
    marginBottom: 20,
  },
  date: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  learningItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  learningTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  learningContent: {
    fontSize: 14,
  },
});

export default Review;
