import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CallGPT } from './gpt';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

const QuizScreen = ({ quizData, updateSelectedOptions }) => {
  return (
    <View style={styles.container}>
      {quizData.map((quiz, questionIndex) => (
        <View key={questionIndex} style={styles.quizContainer}>
          <Text style={styles.question}>{quiz.question}</Text>
          {quiz.options.map((option, optionIndex) => (
            <TouchableOpacity
              key={optionIndex}
              style={[
                styles.optionButton,
                // 변경: 선택한 옵션에 따라 스타일 변경
                quiz.selectedOption === optionIndex
                  ? styles.selectedOption
                  : styles.unselectedOption,
              ]}
              onPress={() => updateSelectedOptions(questionIndex, optionIndex)}
            >
              <View style={styles.optionContainer}>
                <Text>{option}</Text>
                {quiz.showResult && (
                  <View style={styles.resultContainer}>
                    {/* 변경: 아이콘 위치 조정 및 marginLeft 추가 */}
                    {quiz.isCorrect && quiz.selectedOption === optionIndex && (
                      <MaterialCommunityIcons
                        name="check-bold"
                        size={21}
                        color="#4CAF50"
                        style={styles.resultIcon}
                      />
                    )}
                    {!quiz.isCorrect && quiz.answer === optionIndex + 1 && (
                      <MaterialCommunityIcons
                        name="check-bold"
                        size={21}
                        color="#4CAF50"
                        style={styles.resultIcon}
                      />
                    )}
                    {!quiz.isCorrect && quiz.selectedOption === optionIndex && (
                      <MaterialCommunityIcons
                        name="close"
                        size={21}
                        color="#FF5733"
                        style={styles.resultIcon}
                      />
                    )}
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </View>
  );
};

const WordQuiz = () => {
  const [quizData, setQuizData] = useState([]);
  const [quizResults, setQuizResults] = useState([]);
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [showCheckAnswerButton, setShowCheckAnswerButton] = useState(false);
  const [isCheckAnswerButtonVisible, setCheckAnswerButtonVisible] = useState(true);

  const handleMenuPress = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  const updateSelectedOptions = (questionIndex, optionIndex) => {
    setQuizData((prevQuizData) => {
      const updatedQuizData = [...prevQuizData];
      updatedQuizData[questionIndex].selectedOption = optionIndex;
      return updatedQuizData;
    });
  };

  const checkAnswers = () => {
  const results = quizData.map(
    (quiz) => quiz.selectedOption === quiz.answer - 1
  );
  setQuizResults(results);

  setQuizData((prevQuizData) =>
    prevQuizData.map((quiz, index) => ({
      ...quiz,
      showResult: true,
      isCorrect: results[index],
    }))
  );

  // 퀴즈 확인 버튼이 눌린 후에 숨기기
  setCheckAnswerButtonVisible(false);
};

const fetchData = async () => {
    try {
      const storedData = await AsyncStorage.getItem('learningData');
      const learningData = storedData ? JSON.parse(storedData) : {};
      const todayDate = new Date().toISOString().split('T')[0];
  
      const todayLearningData = learningData[todayDate] || [];
  
      let allKeywords = [];
  
      todayLearningData.forEach((item) => {
        const itemKeywords = item.keywords || [];
        allKeywords = allKeywords.concat(itemKeywords);
      });
  
      console.log('Today\'s Keywords:', allKeywords);
  
      const response = await CallGPT(`Create a quiz for the following words:\n${JSON.stringify(allKeywords)}`);
  
      const generatedQuiz = response?.choices[0]?.text;
  
      if (generatedQuiz) {
        const quizPrompts = processGeneratedQuiz(generatedQuiz, allKeywords);
        setQuizData(quizPrompts);
        setShowCheckAnswerButton(true);
      } else {
        console.error('API 응답에서 퀴즈 데이터를 가져올 수 없습니다. 응답:', response);
      }
    } catch (error) {
      console.error('데이터 가져오기 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  function processGeneratedQuiz(generatedQuiz, allKeywords) {
    const quizPrompts = allKeywords.map((wordInfo) => {
      const options = shuffleArray(
        allKeywords.filter((option) => option.word !== wordInfo.word)
      );

      const answerIndex = Math.floor(Math.random() * 4);

      options.splice(answerIndex, 0, wordInfo);

      const formattedOptions = options
        .slice(0, 4)
        .map(
          (option, index) => `${index + 1}) ${option.meaning}`
        );

      return {
        question: `Q. '${wordInfo.word}'의 뜻은 무엇인가요?`,
        options: formattedOptions,
        answer: answerIndex + 1,
      };
    });
    return quizPrompts.slice(0, 5);
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleMenuPress} style={styles.menuButton}>
          <Image source={require('./assets/menu.png')} style={styles.menu} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <Image source={require('./assets/back.png')} style={styles.back} resizeMode="contain" />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.scrollViewContent} showsVerticalScrollIndicator={false}>
        {loading ? ( // 로딩 스피너 표시
          <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#990011" />
          <Text style={styles.loadingText}>퀴즈 생성 중..</Text>
        </View>
          
        ) : (
          showCheckAnswerButton && <QuizScreen quizData={quizData} updateSelectedOptions={updateSelectedOptions} />
        )}

{isCheckAnswerButtonVisible && !loading && (
  <TouchableOpacity
    style={styles.checkAnswerButton}
    onPress={checkAnswers}
  >
    <Text style={styles.checkAnswerButtonText}>정답 확인</Text>
  </TouchableOpacity>
)}
      </ScrollView>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCF6F5',
  },
  quizContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  question: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
  },
  optionButton: {
    flex: 1,
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    alignItems: 'center',
  },
  selectedOption: {
    backgroundColor: 'rgba(153, 0, 17, 0.15)', // 남색으로 변경
  },
  // 변경: 선택하지 않은 옵션의 스타일
  unselectedOption: {
    backgroundColor: '#d9d9d9', // 연한 회색으로 변경
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 85,
    marginBottom: 7,
    //backgroundColor: '#FCF6F5'
  },
  menuButton: {
    left: 30,
    width: 40,
    height: 40,
  },
  backButton: {
    right: 25,
    width: 40,
    height: 40,
  },
  menu: {
    width: '100%',
    height: '100%',
  },
  back: {
    width: '100%',
    height: '100%',
  },
  scrollViewContent: {
    padding: 25,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 25,
    textAlign: 'center',
    letterSpacing: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center', // 세로 가운데 정렬을 위해 추가
  },
  button: {
    borderRadius: 25,
    paddingVertical: 11,
    paddingHorizontal: 16,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  quizItem: {
    marginBottom: 20,
  },
  quizQuestion: {
    fontSize: 16,
    marginBottom: 15,
    fontWeight: '500',
  },
  correctAnswer: {
    fontSize: 14,
    color: '#007900', // 정답 텍스트의 색상
  },
  checkAnswerButton: {
    backgroundColor: '#d9d9d9',
    borderRadius: 17,
    padding: 10,
    marginTop: 7,
    marginBottom: 20,
    alignItems: 'center',
  },
  checkAnswerButtonText: {
    color: '#282828',
    fontWeight: 'bold',
    fontSize: 15,
  },
  learnCompleteButton: {
    backgroundColor: '#990011',
    borderRadius: 17,
    padding: 10,
    marginTop: 10,
    marginBottom: 15,
    alignItems: 'center',
  },
  learnCompleteButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#c8c8c8',
    shadowOffset: { width: 0, height: 0.5 },
    shadowOpacity: 1,
    shadowRadius: 4,
  },
  wordListContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
  },
  wordItem: {
    marginBottom: 20,
    alignItems: 'center',
  },
  wordItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '62%', // 부모 요소와 동일한 폭
  },
  word: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 7,
  },
  meaning: {
    fontSize: 16,
    color: '#777777',
  },
  modalCloseButton: {
    backgroundColor: '#990011',
    borderRadius: 5,
    padding: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  modalCloseButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  text1: {
    color: '#6E696D',
    fontSize: windowWidth * 0.035,
    fontWeight: '600',
    //alignSelf: 'flex-start',
    //marginBottom: windowHeight * 0.04,
  },
  textContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginBottom: windowHeight * 0.04,
  },
  resultIcon: {
    marginLeft: 4,
  },
  resultContainer: {
    flexDirection: 'row', // 변경: 결과 아이콘을 가로로 나열
    alignItems: 'center', // 변경: 결과 아이콘을 세로 중앙 정렬
    marginLeft: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: '600',
    color: '#990011',
  },
});

export default WordQuiz;