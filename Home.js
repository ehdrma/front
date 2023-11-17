import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, StatusBar, Dimensions, ScrollView } from 'react-native';
import { DrawerActions } from '@react-navigation/native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const Home = ({ navigation }) => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    // 서버에서 기사 목록과 번역된 본문 가져오기
    fetch('http://192.168.219.107:5000/articles')
      .then(response => response.json())
      .then(data => {
        setArticles(data);
      })
      .catch(error => console.error('Error fetching articles:', error));
  }, []);

  const handleMenuPress = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const handleArticlePress = (item) => {
    navigation.navigate('Learning', { article: item });
  };

  const handleWordQuizPress = () => {
    navigation.navigate('WordQuiz');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleMenuPress} style={styles.menuButton}>
        <Image source={require('./assets/menu.png')} style={styles.menu} />
      </TouchableOpacity>
      <Image source={require('./assets/human.png')} style={styles.human} />
      <TouchableOpacity onPress={handleWordQuizPress} style={styles.Button}>
        <Text style={styles.ButtonText}>오늘의 핵심 단어 GO!</Text>
      </TouchableOpacity>
      <Text style={styles.customText}>학습하고 싶은 기사를 골라보세요!</Text>
      <ScrollView
        style={styles.articleListContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
      >
        {articles.map((item) => (
          <TouchableOpacity
            key={item._id.toString()}
            style={styles.articleItem}
            onPress={() => handleArticlePress(item)}
          >
            <Text style={styles.articleTitle}>{item.title}</Text>
            {item.translatedTitle && (
              <Text style={[styles.translatedTitle, { marginTop: 13 }]}>{item.translatedTitle}</Text>
            )}
          </TouchableOpacity>
        ))}
</ScrollView>
      <StatusBar style="auto" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FCF6F5",
    paddingHorizontal: windowWidth * 0.09,
    paddingTop: windowHeight * 0.09,
  },
  menuButton: {
    position: 'absolute',
    top: windowHeight * 0.1,
    left: windowWidth * 0.1,
    zIndex: 1, // 다른 요소보다 위에 표시되도록 설정
  },
  menu: {
    width: windowWidth * 0.09,
    height: windowHeight * 0.047,
  },
  human: {
    top: windowHeight * 0.126,
    right: windowWidth * 0.085,
    position: 'absolute',
    width: windowWidth * 0.335,
    height: windowHeight * 0.17,
  },
  Button: {
    position: 'absolute',
    top: windowHeight * 0.217,
    left: windowWidth * 0.09,
    width: windowWidth * 0.47,
    height: windowHeight * 0.047,
    backgroundColor: '#990011',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    zIndex: 1, // 다른 요소보다 위에 표시되도록 설정
  },
  ButtonText: {
    color: '#ffffff',
    fontSize: windowWidth * 0.037,
    fontWeight: 'bold',
  },
  customText: {
    color: '#282828',
    position: 'absolute',
    top: windowHeight * 0.269,
    left: windowWidth * 0.11,
    fontSize: windowWidth * 0.035,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: windowHeight * 0.008,
    fontWeight: 'bold',
  },
  articleListContainer: {
    marginTop: windowHeight * 0.22,
    paddingBottom: windowHeight * 0.1,
  },
  articleItem: {
    backgroundColor: '#fff',
    padding: 18,
    marginVertical: 12,
    marginHorizontal: 4,
    borderRadius: 8,
    elevation: 5,
    shadowColor: '#c8c8c8', // 그림자 색상
    shadowOffset: { width: 0, height: 0.5 }, // 그림자의 오프셋 (수평, 수직)
    shadowOpacity: 0.8, // 그림자 투명도
    shadowRadius: 4, // 그림자의 둥근 정도
  },
  articleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  translatedTitle: {
    fontSize: 14,
    color: '#555', // 번역된 제목의 색상 설정
  },
});

export default Home;