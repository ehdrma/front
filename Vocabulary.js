// Vocabulary.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, Dimensions, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { Audio } from 'expo-av';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const itemsPerPage = 7;

const MAX_DISPLAY_PAGES = 5;

const Vocabulary = () => {
  const navigation = useNavigation();
  const [keywords, setKeywords] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleMenuPress = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedData = await AsyncStorage.getItem('learningData');
        const learningData = storedData ? JSON.parse(storedData) : {};
        let allKeywords = [];

        Object.values(learningData).forEach((dateData) => {
          dateData.forEach((item) => {
            const itemKeywords = item.keywords || [];
            allKeywords = allKeywords.concat(itemKeywords);
          });
        });

        setKeywords(allKeywords);
      } catch (error) {
        console.error('학습 데이터 불러오기 오류:', error);
      }
    };

    fetchData();
  }, []);

  const handlePlayAudio = async (text) => {
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

        const { sound } = await Audio.Sound.createAsync({ uri: audioUrl });
        setSound(sound);
        await sound.playAsync();
        setIsPlaying(true);
      } else {
        const errorMessage = response.data.error || 'Unknown error';
        Alert.alert('음성 변환 오류', errorMessage);
      }
    } catch (error) {
      console.error('음성 변환 오류:', error);
      Alert.alert('음성 변환 오류', '음성 변환 중 오류가 발생했습니다.');
    }
  };

  const paginatedKeywords = keywords.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const formattedData = paginatedKeywords.map((word, index) => ({
    key: index.toString(),
    word: word.word,
    meaning: word.meaning,
  }));

  const totalPages = Math.ceil(keywords.length / itemsPerPage);
  const startPage = (Math.ceil(currentPage / MAX_DISPLAY_PAGES) - 1) * MAX_DISPLAY_PAGES + 1;
  const endPage = Math.min(startPage + MAX_DISPLAY_PAGES - 1, totalPages);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const stopAudio = async () => {
    if (sound) {
      await sound.stopAsync();
      setIsPlaying(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleMenuPress} style={styles.menuButton}>
        <Image source={require('./assets/menu.png')} style={styles.menu} />
      </TouchableOpacity>
      <View style={styles.contentContainer}>
        <FlatList
          data={formattedData}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                stopAudio(); // 다른 단어를 누르면 이전 음성 정지
                handlePlayAudio(item.word); // 선택한 단어에 대한 TTS 재생
              }}
            >
              <View style={styles.wordContainer}>
                {/* 수정된 부분: 이미지를 누르면 음성 재생 */}
                <TouchableOpacity onPress={() => handlePlayAudio(item.word)}>
                  <Image source={require('./assets/speaker.png')} style={styles.speakerIcon} />
                </TouchableOpacity>
                {/* 수정된 부분 끝 */}
                <Text style={styles.word}>{item.word}</Text>
                <Text style={styles.meaning}>{item.meaning}</Text>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.key}
        />
        {/* 페이징 컨트롤 */}
        <View style={styles.paginationContainer}>
          {/* 이전 페이지로 이동하는 화살표 */}
          <TouchableOpacity
            style={[styles.arrowButton, currentPage === 1 && styles.disabledButton]}
            onPress={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <Text style={styles.pageButtonText}>{'<'}</Text>
          </TouchableOpacity>

          {Array.from({ length: endPage - startPage + 1 }).map((_, index) => (
            <TouchableOpacity
              key={startPage + index}
              style={[
                styles.pageButton,
                currentPage === startPage + index && styles.currentPageButton,
              ]}
              onPress={() => handlePageChange(startPage + index)}
            >
              <Text style={styles.pageButtonText}>{startPage + index}</Text>
            </TouchableOpacity>
          ))}

          {/* 다음 페이지로 이동하는 화살표 */}
          <TouchableOpacity
            style={[styles.arrowButton, currentPage === totalPages && styles.disabledButton]}
            onPress={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <Text style={styles.pageButtonText}>{'>'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCF6F5',
    paddingHorizontal: windowWidth * 0.08,
    paddingTop: windowHeight * 0.08,
    flexDirection: 'row',
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
    marginTop: windowHeight * 0.09,
    paddingBottom: windowHeight * 0.11,
  },
  wordContainer: {
    backgroundColor: '#fff',
    padding: 18,
    marginVertical: 10,
    marginHorizontal: 4,
    borderRadius: 8,
    elevation: 5,
    shadowColor: '#c8c8c8', // 그림자 색상
    shadowOffset: { width: 0, height: 0.5 }, // 그림자의 오프셋 (수평, 수직)
    shadowOpacity: 0.8, // 그림자 투명도
    shadowRadius: 4, // 그림자의 둥근 정도
    flexDirection: 'row', // Speaker 이미지 추가를 위해 수정
    alignItems: 'center', // Speaker 이미지 추가를 위해 수정
  },
  word: {
    fontSize: 18.5,
    fontWeight: 'bold',
    marginBottom: 8,
    flex: 1, // Speaker 이미지 추가를 위해 수정
  },
  meaning: {
    fontSize: 16.5,
    color: '#777777',
  },
  paginationContainer: {
    top: windowHeight * 0.036,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  pageButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginHorizontal: 5,
    borderRadius: 5,
  },
  currentPageButton: {
    backgroundColor: '#e0e0e0',
  },
  pageButtonText: {
    color: '#282828',
  },
  arrowButton: {
    paddingHorizontal: 14,
    paddingVertical: 5,
  },
  disabledButton: {
    opacity: 0.5,
  },
  speakerIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
});

export default Vocabulary;
