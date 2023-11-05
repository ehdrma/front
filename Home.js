import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, StatusBar, Dimensions, FlatList } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { DrawerActions } from '@react-navigation/native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const Home = ({ navigation }) => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    // 서버에서 기사 목록 가져오기
    fetch('http://192.168.219.120:5000/articles')
      .then(response => response.json())
      .then(data => {
        setArticles(data); // 기사 목록을 상태 변수에 저장
      })
      .catch(error => console.error('Error fetching articles:', error));
  }, []); // 컴포넌트가 마운트될 때 한 번만 실행

  const handleMenuPress = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.articleItem}
        onPress={() => navigation.navigate('Learning', { article: item })}>
        <Text style={styles.articleTitle}>{item.title}</Text>
      </TouchableOpacity>
    );
  };


  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.container}>
        <TouchableOpacity onPress={handleMenuPress}>
          <Image source={require('./assets/menu.png')} style={styles.menu} />
        </TouchableOpacity>
        <Image source={require('./assets/human.png')} style={styles.human} />
        <TouchableOpacity style={styles.Button}>
          <Text style={styles.ButtonText}>오늘의 단어 퀴즈 GO!</Text>
        </TouchableOpacity>
        <Text style={styles.customText}>학습하고 싶은 기사를 골라보세요!</Text>
        <FlatList
          data={articles}
          renderItem={renderItem}
          keyExtractor={(item) => item._id.toString()}
          contentContainerStyle={styles.articleList}
        />
      </View>
      <StatusBar style="auto" />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1, // 스크롤 가능한 영역을 확장합니다.
    backgroundColor: "#FCF6F5",
  },
  container: {
    flex: 1,
    marginLeft: 1,
    justifyContent: 'flex-start',
    paddingHorizontal: windowWidth * 0.1,
    paddingTop: windowHeight * 0.09,
  },
  menu: {
    left: windowWidth * 0.0001, // 원하는 좌측 여백으로 조정
    position: 'absolute',
    width: windowWidth * 0.1,
    height: windowHeight * 0.046,
  },
  human: {
    top: windowHeight * 0.12, // 원하는 높이로 조정
    right: windowWidth * 0.055, // 원하는 우측 여백으로 조정
    position: 'absolute',
    width: windowWidth * 0.36,
    height: windowHeight * 0.18,
  },
  Button: {
    position: 'absolute',
    top: windowHeight * 0.217, // 원하는 높이로 조정
    left: windowWidth * 0.09, // 원하는 좌측 여백으로 조정
    width: windowWidth * 0.47,
    height: windowHeight * 0.047,
    backgroundColor: '#990011',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  ButtonText: {
    color: '#ffffff',
    fontSize: windowWidth * 0.037,
    fontWeight: 'bold',
  },
  customText: {
    color: '#282828',
    position: 'absolute',
    top: windowHeight * 0.269, // 원하는 높이로 조정
    left: windowWidth * 0.11,
    fontSize: windowWidth * 0.035,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: windowHeight * 0.008,
    fontWeight: 'bold',
  },
  articleList: {
    marginTop: windowHeight * 0.215,
    paddingBottom: windowHeight * 0.05, // FlatList 아래 여백 조절
  },
  articleItem: {
    backgroundColor: '#fff',
    padding: 20,
    marginVertical: 10,
    borderRadius: 8,
    elevation: 5,
  },
  articleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Home;
