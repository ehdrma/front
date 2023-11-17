import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { Audio } from 'expo-av';
import Slider from '@react-native-community/slider';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Learning = ({ route }) => {
  const { article } = route.params;
  const navigation = useNavigation();
  const [showOriginal, setShowOriginal] = useState(true);
  const [isTranslated, setIsTranslated] = useState(true);
  const [bodyContent, setBodyContent] = useState(article.body);
  const [isLoading, setIsLoading] = useState(false);
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(1);
  const [selectedAnswers, setSelectedAnswers] = useState(Array(article.quizzes.length).fill(null));
  const [showCorrectAnswers, setShowCorrectAnswers] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);


  
  useEffect(() => {
    setBodyContent(showOriginal ? article.body : isTranslated ? article.translatedText : article.body);
  }, [showOriginal, isTranslated, article]);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleMenuPress = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const handleBackPress = () => {
    if (sound) {
      sound.unloadAsync();
    }
    navigation.goBack();
  };

  const handleTranslateToggle = () => {
    setShowOriginal(!showOriginal);
  };

  const handlePlayAudio = async () => {
    setIsLoading(true);
    try {
      if (sound) {
        if (isPlaying) {
          await sound.pauseAsync();
        } else {
          await sound.playAsync();
        }
        setIsPlaying(!isPlaying);
      } else {
        const response = await fetch('http://192.168.219.107:5000/text-to-speech', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: article.body,
          }),
        });

        if (response.ok) {
          const { audioUrl } = await response.json();
          const { sound } = await Audio.Sound.createAsync({ uri: audioUrl });
          setSound(sound);
          await sound.playAsync();
          setIsPlaying(true);

          const getAudioDuration = async () => {
            const { durationMillis } = await sound.getStatusAsync();
            setDuration(durationMillis);
          };

          if (sound) {
            getAudioDuration();
          }

          return () => {
            if (sound) {
              sound.unloadAsync();
            }
          };
        } else {
          const errorResponse = await response.json();
          Alert.alert('음성 변환 오류', errorResponse.error);
        }
      }
    } catch (error) {
      console.error('음성 변환 오류:', error);
      Alert.alert('음성 변환 오류', '음성 변환 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSliderChange = (value) => {
    if (sound) {
      const newPosition = value * duration;
      setPosition(newPosition);
      sound.setPositionAsync(newPosition);
    }
  };

  const checkAnswers = () => {
    setShowCorrectAnswers(true);
  };

  const handleLearnComplete = async () => {
    try {
      // AsyncStorage에서 현재까지의 학습 데이터 불러오기
      const storedData = await AsyncStorage.getItem('learningData');
      const learningData = storedData ? JSON.parse(storedData) : {};

      // 현재 날짜 구하기 (예: "2023-11-16")
      const currentDate = new Date().toISOString().split('T')[0];

      // 현재 학습 데이터에 새로운 데이터 추가
      const newLearningItem = {
        title: article.title,  // 필요한 데이터에 맞게 수정
        content: article.body,  // 필요한 데이터에 맞게 수정
      };

      if (learningData[currentDate]) {
        learningData[currentDate].push(newLearningItem);
      } else {
        learningData[currentDate] = [newLearningItem];
      }

      // AsyncStorage에 업데이트된 학습 데이터 저장
      await AsyncStorage.setItem('learningData', JSON.stringify(learningData));

      // 홈 화면으로 이동
      navigation.navigate('Home');
    } catch (error) {
      console.error('학습 데이터 저장 오류:', error);
    }
  };

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
        <Text style={styles.title}>
          {showOriginal
            ? article.title
            : isTranslated
              ? article.translatedTitle
              : article.title}
        </Text>
        <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor: '#d9d9d9',
              },
            ]}
            onPress={toggleModal}
          >
            <Text
              style={[
                styles.buttonText,
                {
                  color: '#282828',
                },
              ]}
            >
              핵심 어휘 보기
            </Text>
          </TouchableOpacity>
        <View style={styles.bodyContainer}>
          <Text style={styles.body}>
            {bodyContent}
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor: isLoading ? '#d9d9d9' : isPlaying ? '#990011' : '#d9d9d9',
              },
            ]}
            onPress={handlePlayAudio}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#990011" />
            ) : (
              <Text
                style={[
                  styles.buttonText,
                  {
                    color: isLoading ? '#ffffff' : isPlaying ? '#ffffff' : '#282828',
                  },
                ]}
              >
                {isLoading ? '음성 변환 중...' : isPlaying ? '일시 정지' : '원어 듣기'}
              </Text>
            )}
          </TouchableOpacity>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={1}
            value={position / duration}
            onValueChange={handleSliderChange}
            disabled={!sound}
          />
          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor: showOriginal ? '#d9d9d9' : isTranslated ? '#990011' : '#d9d9d9',
              },
            ]}
            onPress={handleTranslateToggle}
          >
            <Text
              style={[
                styles.buttonText,
                {
                  color: showOriginal ? '#282828' : isTranslated ? '#ffffff' : '#282828',
                },
              ]}
            >
              {showOriginal ? '번역 보기' : isTranslated ? '원문 보기' : '번역 보기'}
            </Text>
          </TouchableOpacity>
        </View>

        <Modal
          visible={isModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.wordListContainer}>
              {article.words.map((word, index) => (
                <View key={index} style={styles.wordItem}>
                  <Text style={styles.word}>{word.word}</Text>
                  <Text style={styles.meaning}>{word.meaning}</Text>
                </View>
              ))}
            </View>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalCloseButtonText}>닫기</Text>
            </TouchableOpacity>
          </View>
        </Modal>

        {/* 추가된 코드: 퀴즈 섹션 */}
        <View style={styles.quizContainer}>
          {article.quizzes.map((quiz, index) => (
            <View key={index} style={styles.quizItem}>
              <Text style={styles.quizQuestion}>{quiz.question}</Text>
              <View style={styles.quizOptions}>
                {quiz.options.map((option, optionIndex) => (
                  <TouchableOpacity
                    key={optionIndex}
                    style={[
                      styles.quizOption,
                      {
                        backgroundColor:
                          showCorrectAnswers &&
                          selectedAnswers[index] === option &&
                          selectedAnswers[index] === quiz.correctAnswer
                            ? '#3B5998' // 답이 맞으면
                            : showCorrectAnswers &&
                              selectedAnswers[index] === option &&
                              selectedAnswers[index] !== quiz.correctAnswer
                            ? '#3B5998' // 답이 틀리면
                            : selectedAnswers[index] === option
                            ? '#3B5998' // 답 선택
                            : '#d9d9d9', // 선택하지 않은 상태일 때는 회색
                      },
                    ]}
                    onPress={() => {
                      const newSelectedAnswers = [...selectedAnswers];
                      newSelectedAnswers[index] = option;
                      setSelectedAnswers(newSelectedAnswers);
                    }}
                    disabled={showCorrectAnswers}
                  >
                    <Text
                      style={{
                        color:
                          selectedAnswers[index] === option
                            ? '#ffffff'
                            : selectedAnswers[index] === null
                            ? '#282828'
                            : '#777777',
                      }}
                    >
                      {option}
                    </Text>
                    {showCorrectAnswers &&
                      selectedAnswers[index] === option &&
                      selectedAnswers[index] !== quiz.correctAnswer && (
                        <MaterialCommunityIcons
                          name="close"
                          size={20}
                          color="#FF5733"
                          style={{ marginLeft: 5 }}
                        />
                      )}
                    {showCorrectAnswers &&
                      option === quiz.correctAnswer && (
                        <MaterialCommunityIcons
                          name="check-bold"
                          size={20}
                          color="#4CAF50"
                          style={{ marginLeft: 5 }}
                        />
                      )}
                  </TouchableOpacity>
                ))}
              </View>
              {showCorrectAnswers && (
                <Text style={styles.correctAnswer}>
                  정답: {quiz.correctAnswer}
                </Text>
              )}
            </View>
          ))}
          {showCorrectAnswers ? null : (
            <TouchableOpacity
              style={styles.checkAnswerButton}
              onPress={checkAnswers}
              disabled={selectedAnswers.some((answer) => answer === null) || showCorrectAnswers}
            >
              <Text style={styles.checkAnswerButtonText}>정답 확인</Text>
            </TouchableOpacity>
          )}
          {showCorrectAnswers && (
            <TouchableOpacity style={styles.learnCompleteButton} onPress={handleLearnComplete}>
              <Text style={styles.learnCompleteButtonText}>학습 완료</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCF6F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 85,
    marginBottom: 7,
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
  bodyContainer: {
    backgroundColor: '#fff',
    padding: 23,
    borderRadius: 10,
    elevation: 5,
    shadowColor: '#c8c8c8', // 그림자 색상
    shadowOffset: { width: 0, height: 0.5 }, // 그림자의 오프셋 (수평, 수직)
    shadowOpacity: 0.8, // 그림자 투명도
    shadowRadius: 4, // 그림자의 둥근 정도
  },
  body: {
    fontSize: 16,
    letterSpacing: 1.5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center', // 세로 가운데 정렬을 위해 추가
    marginTop: 26,
    marginBottom: 21,
  },
  slider: {
    flex: 1, // 슬라이더가 가득 차도록 설정
    marginHorizontal: 20,
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
  quizContainer: {
    marginTop: 30,
  },
  quizTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  quizItem: {
    marginBottom: 20,
  },
  quizQuestion: {
    fontSize: 16,
    marginBottom: 10,
  },
  quizOptions: {
    flexDirection: 'column',
    marginBottom: 10,
  },
  quizOption: {
    fontSize: 14,
    marginBottom: 5,
  },
  correctAnswer: {
    fontSize: 14,
    color: '#007900', // 정답 텍스트의 색상
  },
  checkAnswerButton: {
    backgroundColor: '#d9d9d9',
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  checkAnswerButtonText: {
    color: '#282828',
    fontWeight: 'bold',
  },
  learnCompleteButton: {
    backgroundColor: '#4CAF50', // 버튼 배경색
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  learnCompleteButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wordListContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    shadowColor: '#c8c8c8',
    shadowOffset: { width: 0, height: 0.5 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  wordItem: {
    marginBottom: 15,
  },
  word: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  meaning: {
    fontSize: 14,
    color: '#777777',
  },
  modalCloseButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 5,
    padding: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  modalCloseButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
});

export default Learning;