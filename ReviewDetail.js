// ReviewDetail.js
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
  Dimensions,
} from 'react-native';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { Audio } from 'expo-av';
import Slider from '@react-native-community/slider';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const ReviewDetail = ({ route }) => {
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
  const [isVocabularyButtonPressed, setIsVocabularyButtonPressed] = useState(false);

  const [vsound, setvSound] = useState(null);
  const [visPlaying, vsetIsPlaying] = useState(false);

  const handlePlayVocaAudio = async (text) => {
    try {
      const response = await fetch('http://172.29.48.47:5000/text-to-speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
        }),
      });

      if (response.ok) {
        const { audioUrl } = await response.json();

        const { sound: newSound } = await Audio.Sound.createAsync({ uri: audioUrl });
        setvSound(newSound);
        await newSound.playAsync();
        vsetIsPlaying(true);
      } else {
        const errorMessage = response.data.error || 'Unknown error';
        Alert.alert('음성 변환 오류', errorMessage);
      }
    } catch (error) {
      console.error('음성 변환 오류:', error);
      Alert.alert('음성 변환 오류', '음성 변환 중 오류가 발생했습니다.');
    }
  };

  const stopAudio = async () => {
    if (vsound) {
      await vsound.stopAsync();
      vsetIsPlaying(false);
    }
  };


  useEffect(() => {
    setBodyContent(showOriginal ? article.body : isTranslated ? article.translatedText : article.body);
  }, [showOriginal, isTranslated, article]);


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
        // sound 객체가 없는 경우에만 새로 생성하도록 변경
        const { sound } = await Audio.Sound.createAsync(
          { uri: article.audioUrl },
          { shouldPlay: true } // shouldPlay 옵션 추가하여 생성과 동시에 재생
        );
  
        setSound(sound);
        setIsPlaying(true);
  
        // 음성의 재생 상태가 업데이트 될 때마다 호출되는 콜백 등록
        const onPlaybackStatusUpdate = async (status) => {
          if (status.didJustFinish) {
            // 음성이 종료된 경우 재생 상태와 위치 초기화
            setIsPlaying(false);
            setPosition(0);
          }
        };
  
        // 콜백 등록
        sound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
  
        // 음성의 재생 시간을 가져오는 함수
        const getAudioDuration = async () => {
          const { durationMillis } = await sound.getStatusAsync();
          setDuration(durationMillis);
        };
  
        // 재생 시간 가져오기
        getAudioDuration();
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
  
 
  const handleTranslateToggle = () => {
    setShowOriginal(!showOriginal);
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

// 핵심 어휘 버튼을 눌렀을 때 모달을 열고 버튼 색상 변경
const toggleModal = () => {
  setModalVisible(!isModalVisible);
  setIsVocabularyButtonPressed(!isVocabularyButtonPressed);
};

// 모달이 닫힐 때 핵심 어휘 버튼 색상을 원래대로 변경
const closeModal = () => {
  setModalVisible(false);
  setIsVocabularyButtonPressed(false);
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
        
        <View style={styles.bodyContainer}>
          <Text style={styles.body}>
            {bodyContent}
          </Text>
        </View>
        <TouchableOpacity
  style={[
    styles.checkAnswerButton,
    isVocabularyButtonPressed && {
      backgroundColor: '#990011',
    },
  ]}
  onPress={toggleModal}
>
  <Text
    style={[
      styles.checkAnswerButtonText,
      {
        color: '#282828',
        textAlign: 'center',
      },
      isVocabularyButtonPressed && {
        color: '#ffffff',
      },
    ]}
  >
    핵심 어휘
  </Text>
  </TouchableOpacity>
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
  onRequestClose={closeModal}
> 
<View style={styles.modalContainer}>
  <ScrollView
    style={{ width: '87.5%', maxHeight: '50%', ...styles.wordListContainer, }}  // 필요에 따라 조절
    contentContainerStyle={{       }}
    showsVerticalScrollIndicator={false}
  >
    <View style={styles.textContainer}>
  <Text style={styles.text1}>단어를 누르면 발음을 들을 수 있어요!</Text>
</View>
    {article.keywords && article.keywords.map((word, index) => (
 <TouchableOpacity
 key={index}
 style={styles.wordItem}
 onPress={() => {stopAudio(); handlePlayVocaAudio(word.word)}}
><View style={styles.wordItemContent}>
 <Text style={styles.word}>{word.word}</Text>
 <Text style={styles.meaning}>{word.meaning}</Text></View>
</TouchableOpacity>
    ))}
  </ScrollView>
  <TouchableOpacity
    style={styles.modalCloseButton}
    onPress={closeModal}
  >
    <Text style={styles.modalCloseButtonText}>X</Text>
  </TouchableOpacity>
</View>
</Modal>
<View style={styles.quizContainer}>
  {article.quizzes.map((quiz, quizIndex) => (
    <View key={quizIndex} style={styles.quizItem}>
      <Text style={styles.quizQuestion}>{quiz.question}</Text>

      {/* 퀴즈 옵션 버튼 렌더링 */}
      {quiz.options.map((option, optionIndex) => {
        const isSelected = quiz.userAnswer && quiz.userAnswer.split(',').includes(option);
        const isCorrect = quiz.correctAnswer && quiz.correctAnswer.split(',').includes(option);
        const isUserAnswerCorrect = isSelected && isCorrect;
  const isUserAnswerIncorrect = isSelected && !isCorrect;

        return (
          <TouchableOpacity
            key={optionIndex}
            style={[
              styles.quizOption,
              {
                backgroundColor: isSelected ? 'rgba(153, 0, 17, 0.15)' : '#d9d9d9',
              },
            ]}
            disabled={true} // 버튼 비활성화
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text
                style={{
                  color: isSelected ? '#282828' : '#777777',
                }}
              >
                {option}
              </Text>
              {isCorrect &&  (
          <MaterialCommunityIcons
            name="check-bold"
            size={21}
            color="#4CAF50"
            style={{ marginLeft: 4, zIndex: 1 }}
          />
        )}
        {isUserAnswerIncorrect && (
          <MaterialCommunityIcons
            name="close"
            size={21}
            color="#FF5733"
            style={{ marginLeft: 4, zIndex: 1 }}
          />
        )}
            </View>
          </TouchableOpacity>
        );
      })}

      {/* 정답과 사용자 답안 표시 */}
      <Text style={styles.correctAnswer}>{`정답: ${quiz.correctAnswer}`}</Text>
    </View>
  ))}
</View>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  correctAnswer: {
    fontSize: 14,
    color: '#007900', // 정답 텍스트의 색상
  },
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
    marginBottom: 16,
    shadowColor: '#c8c8c8',
    shadowOffset: { width: 0, height: 0.5 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  body: {
    fontSize: 16,
    letterSpacing: 1.5,
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center', // 세로 가운데 정렬을 위해 추가
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
    marginTop: 26,
    marginBottom: 15,
  },
  quizItem: {
    marginBottom: 20,
  },
  quizQuestion: {
    fontSize: 16,
    marginBottom: 15,
    fontWeight: '500',
  },
  quizOptions: {
    flexDirection: 'column',
    marginBottom: 5,
  },
  quizOption: {
    fontSize: 16,
    paddingVertical: 10, // 위아래 여백을 조절하여 박스 크기 조절
    paddingHorizontal: 22, // 좌우 여백을 조절하여 박스 크기 조절
    marginBottom: 10,
    borderRadius: 8,
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
    marginTop: 17.5,
  },
});

export default ReviewDetail;
