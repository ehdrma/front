import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const WordQuiz = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.quizText}>오늘의 단어 퀴즈 화면</Text>
      {/* Add your quiz content here */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FCF6F5',
  },
  quizText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#990011',
  },
});

export default WordQuiz;
